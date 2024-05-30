import { TSubscription } from "@/state/onboarding"
import { type ClassValue, clsx } from "clsx"
import { add, addDays, addMonths, addYears } from "date-fns"
import { twMerge } from "tailwind-merge"
import { v4 as uuid } from "uuid"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type PaymentStatus = "paid" | "pending" | "upcoming"

export interface PaymentObject {
    date: Date
    status: PaymentStatus
    amount?: number
    currencyId?: string
}

export function generatePayments(
    creationDate: Date,
    renewalPeriodEnum: "annually" | "monthly" | "weekly" | "custom",
    renewalPeriodDays?: number,
    amount?: number,
    currencyId?: string
): PaymentObject[] {
    const payments: PaymentObject[] = []
    let nextPaymentDate = new Date(creationDate)

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

    while (nextPaymentDate <= new Date()) {
        payments.push({ date: new Date(nextPaymentDate), amount, currencyId, status: "paid" })
        getNextPaymentDate()
    }

    // Add one pending payment for the future
    payments.push({ date: new Date(nextPaymentDate), amount, currencyId, status: "upcoming" })

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
        paymentCount: 0,
        totalCost: 0,
        upcomingPaymentDate: add(new Date(), { months: 1 }),
        ...subscription,
    }
}
