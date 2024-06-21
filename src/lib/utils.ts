import { TPayment, TSubscription } from "@/state/onboarding"
import { type ClassValue, clsx } from "clsx"
import { add, addDays, addMonths, addYears } from "date-fns"
import { twMerge } from "tailwind-merge"
import { v4 as uuid } from "uuid"
import {
    TAxiosCurrencyDetails,
    TAxiosErrorResponse,
    TAxiosPaymentDetails,
    TAxiosSuccessResponse,
    TAxiosUserDetails,
    TError,
} from "./types"
import { z } from "zod"
import { client } from "./axiosClient"
import api from "./api"
import { fetchAllCurrencies } from "./serverUtils"
import { useCallback } from "react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const createSubscriptionsWithPayments = async <T extends Record<string, any>>(
    data: T
): Promise<
    | TAxiosSuccessResponse<{
          subscriptions: {
              ownerId: string
              subscriptionId: string
          }[]
      }>
    | TAxiosErrorResponse<TError>
> => {
    try {
        const res = await client.post(api.subscription.createWithPayments, data)
        if (res.data.error) return { data: null, error: res.data.error }
        return { data: res.data, error: null }
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to create subscriptions" },
        }
    }
}

export const updateUserOnboardingStatus = async (): Promise<
    TAxiosSuccessResponse<TAxiosUserDetails> | TAxiosErrorResponse<z.ZodError | { message: string }>
> => {
    try {
        const res = await client.post(api.user.updateOnboardingStatus)
        if (res.data.error) return { data: null, error: { message: res.data.error } }
        return { data: res.data, error: null }
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to update onboarding status" },
        }
    }
}

export const fetchUserDetails = async (): Promise<
    TAxiosSuccessResponse<TAxiosUserDetails> | TAxiosErrorResponse<{ message: string }>
> => {
    try {
        const res = await client.get(api.user.getSubscriptions)
        return res.data
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to load user data" },
        }
    }
}

export const fetchUserSubscriptions = async () => {
    try {
        const res = await client.get(api.user.getSubscriptions)

        return res.data
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to load subscription data" },
        }
    }
}

export const fetchUserPayments = async (): Promise<
    TAxiosSuccessResponse<TAxiosPaymentDetails[]> | TAxiosErrorResponse<{ message: string }>
> => {
    try {
        const res = await client.get(api.user.getPayments)

        return res.data
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to load payment data" },
        }
    }
}

export const removeSubscription = async (
    subscriptionId: string
): Promise<TAxiosSuccessResponse<null> | TAxiosErrorResponse<TError>> => {
    try {
        const res = await client.post(api.subscription.remove(subscriptionId))
        if (res.data.error) return { data: null, error: res.data.error }
        return { data: res.data, error: null }
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to remove subscription" },
        }
    }
}

export function generatePayments({
    creationDate,
    renewalPeriodEnum,
    amount,
    currencyId,
    renewalPeriodDays,
}: {
    creationDate: Date
    renewalPeriodEnum: "annually" | "monthly" | "weekly" | "custom"
    renewalPeriodDays?: number
    amount?: number
    currencyId?: string
}): TPayment[] {
    const payments: TPayment[] = []
    const tomorrow = addDays(new Date(), 1)
    tomorrow.setHours(0, 0, 0, 0)
    let nextPaymentDate = new Date(creationDate)
    nextPaymentDate.setHours(0, 0, 0, 0)
    const handleCustomPeriod = (daysToAdd: number = 7) => {
        if (renewalPeriodDays) {
            return addDays(nextPaymentDate, renewalPeriodDays * daysToAdd)
        } else {
            throw new Error("renewalPeriodDays is required for custom period")
        }
    }

    const getNextPaymentDate = () => {
        switch (renewalPeriodEnum) {
            case "annually":
                nextPaymentDate = addYears(nextPaymentDate, 1)
                break
            case "monthly":
                nextPaymentDate = addMonths(nextPaymentDate, 1)
                break
            case "weekly":
                nextPaymentDate = addDays(nextPaymentDate, 7)
                break
            case "custom":
                nextPaymentDate = handleCustomPeriod()
                break
        }
    }

    while (nextPaymentDate <= tomorrow) {
        payments.push({ date: new Date(nextPaymentDate), amount, currencyId, paymentStatusEnum: "paid" })
        getNextPaymentDate()
    }

    // Add one pending payment for the future
    payments.push({ date: new Date(nextPaymentDate), amount, currencyId, paymentStatusEnum: "upcoming" })

    return payments.reverse()
}

export const initiateNewSubscription = (subscription?: Partial<TSubscription>): TSubscription => {
    return {
        uuid: uuid(),
        name: "",
        currencyId: "",
        renewalPeriodEnum: "monthly",
        renewalAmount: 0,
        renewalPeriodDays: 1,
        creationDate: new Date(),
        upcomingPaymentDate: add(new Date(), { months: 1 }),
        ...subscription,
    }
}

export const setCurrencyList = async () => {
    "use client"

    const currencies = localStorage.getItem("currencies")
    if (currencies) return

    try {
        const res = await fetchAllCurrencies()
        if (res.data) {
            localStorage.setItem("currencies", JSON.stringify(res.data))
        }
    } catch (e) {
        console.error(e)
    }
}

export const useRenderAmount = (currencies: TAxiosCurrencyDetails[]) => {
    return useCallback(
        (value: string, amount: number) => {
            const c = currencies.find((c) => c.uuid === value)
            if (!c) return ""

            return new Intl.NumberFormat("en-US", { style: "currency", currency: c.code }).format(amount)
        },
        [currencies]
    )
}
