import { TSubscription } from "@/state/onboarding"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuid } from "uuid"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const initiateNewSubscription = (subscription?: Partial<TSubscription>): TSubscription => {
    return {
        currencyId: "",
        uuid: uuid(),
        name: "",
        renewalAmount: 0,
        renewalPeriodEnum: "monthly",
        subscribedOn: new Date(),
        ...subscription,
    }
}
