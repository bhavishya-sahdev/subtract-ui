import { fetchAllCurrencies, fetchPrefabs } from "@/lib/serverUtils"
import { TSetterFunction } from "@/lib/types"
import { z } from "zod"
import { useFieldArray } from "react-hook-form"
import { createStore } from "zustand/vanilla"
import { MutableRefObject } from "react"

export const renewalPeriodEnum = z.enum(["annually", "monthly", "weekly", "custom"], {
    invalid_type_error: "Incorrect value",
    required_error: "Required",
    message: "Required",
})

export const SubscriptionFormSchema = z.object({
    name: z.string(),
    subscribedOn: z.date(),
    currencyId: z.string(),
    renewalAmount: z.number().nonnegative(),
    renewalPeriodEnum: renewalPeriodEnum.default("monthly"),
    renewalPeriodDays: z.number().gt(1).default(1).optional(),
})
export type TSubscriptionFormSchema = z.infer<typeof SubscriptionFormSchema>

export type TSubscription = TSubscriptionFormSchema & { uuid: string }

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
