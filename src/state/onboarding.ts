import { fetchAllCurrencies, fetchPrefabs } from "@/lib/serverUtils"
import { TSetterFunction } from "@/lib/types"
import { add } from "date-fns"
import { z } from "zod"
import { createStore } from "zustand/vanilla"

export const renewalPeriodEnum = z.enum(["annually", "monthly", "weekly", "custom"], {
    invalid_type_error: "Incorrect value",
    required_error: "Required",
    message: "Required",
})

export type TRenewalPeriodEnum = z.infer<typeof renewalPeriodEnum>

export const PaymentStatus = z.enum(["paid", "pending", "upcoming"], {
    invalid_type_error: "Incorrect value",
    required_error: "Required",
    message: "Required",
})
export type TPaymentStatus = z.infer<typeof PaymentStatus>

export const PaymentSchema = z.object({
    date: z.date(),
    status: PaymentStatus,
    amount: z.coerce.number().optional(),
    currencyId: z.string().uuid("Please select a currency").optional(),
})
export type TPayment = z.infer<typeof PaymentSchema>

export const SubscriptionFormSchema = z.object({
    name: z.string().min(3),
    creationDate: z.date(),
    currencyId: z.string().uuid("Please select a currency").optional(),
    renewalAmount: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.coerce.number({ message: "Required" }).nonnegative()
    ),
    renewalPeriodEnum: renewalPeriodEnum,
    renewalPeriodDays: z.coerce.number().gte(1).optional(),
    paymentCount: z.number().nonnegative(),
    totalCost: z.number().nonnegative(),
    uuid: z.string().uuid(),
    upcomingPaymentDate: z.date().min(add(new Date(), { days: 1 })),
})

export type TSubscription = z.infer<typeof SubscriptionFormSchema>

export type TOnboardingForm = {
    subscriptions: TSubscription[]
}

export type TCurrency = {
    uuid: string
    symbol: string
    name: string
    symbolNative: string
    decimalDigits: number
    rounding: string
    code: string
    namePlural: string
}

export const PrefabSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string(),
})

export type TPrefab = z.infer<typeof PrefabSchema>

export type TOnboardingState = {
    activePage: number
    selectedPrefabs: string[]
    currencies: TCurrency[]
    prefabs: TPrefab[]
    selectedServiceId: string | null
}

export type TOnboardingActions = {
    setSelectedPrefabs: TSetterFunction<[string[]]>
    setCurrencies: TSetterFunction<[]>
    setActivePage: TSetterFunction<[number]>
    setPrefabs: TSetterFunction<[]>
    setSelectedServiceId: TSetterFunction<[string]>
}

export type TOnboardingStore = TOnboardingState & TOnboardingActions

export const createOnboardingStore = () => {
    return createStore<TOnboardingStore>((set) => ({
        activePage: 0,
        setActivePage: (newActivePage) => set({ activePage: newActivePage }),

        selectedPrefabs: [],
        setSelectedPrefabs: (values) => set({ selectedPrefabs: values }),

        currencies: [],
        setCurrencies: async () => {
            const res = await fetchAllCurrencies()
            if (res.data) set({ currencies: res.data })
        },

        prefabs: [],
        setPrefabs: async () => {
            const res = await fetchPrefabs()
            if (res.data) set({ prefabs: res.data })
        },

        selectedServiceId: null,
        setSelectedServiceId: (value) => set({ selectedServiceId: value }),
    }))
}
