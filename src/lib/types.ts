import { TSubscription } from "@/state/onboarding"
import { ReactNode } from "react"
import { z } from "zod"

export type TSetterFunction<T extends any[]> = (...args: T) => void

export interface IDefaultStoreProviderProps {
    children: ReactNode
}

export type TAxiosSuccessResponse<T> = {
    data: T
    error: null
}
export type TAxiosErrorResponse<T> = {
    data: null
    error: T
}

export type TServerError = {
    message: string
}

export type TError = TServerError | z.ZodIssue[]

export type TAxiosUserDetails = {
    uuid: string
    email: string
    name: string
    updatedAt: string
    createdAt: string
    isOnboardingComplete: boolean
    subscriptionCount: number
    paymentCount: number
    isGoogleUser: boolean
    subscriptions: TSubscription[]
}

export type TPaymentStatusEnum = "pending" | "paid" | "upcoming"

export type TAxiosPaymentDetails = {
    uuid: string
    amount: number
    currencyId: string
    paymentMethod: string | null
    date: string
    subscriptionId: string
    ownerId: string
    paymentStatusEnum: TPaymentStatusEnum
}

export type TAxiosCurrencyDetails = {
    uuid: string
    symbol: string
    name: string
    symbolNative: string
    decimalDigits: number
    rounding: string
    code: string
    namePlural: string
}
