import { TSubscription } from "@/state/onboarding"
import { type ClassValue, clsx } from "clsx"
import { add } from "date-fns"
import { twMerge } from "tailwind-merge"
import { v4 as uuid } from "uuid"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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
