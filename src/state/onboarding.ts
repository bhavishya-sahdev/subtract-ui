import { create } from "zustand"
import { fetchAllCurrencies, fetchPrefabs } from "@/lib/serverUtils"
import { TSetterFunction } from "@/lib/types"
import { z } from "zod"

type TSubscription = {
    id: string
    name: string
    subscribedOn: Date
    currencyId: string
    renewalAmount: number
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

type TOnboardingStore = {
    activePage: number
    setActivePage: TSetterFunction<[number]>

    createdSubscriptions: TSubscription[]
    addCreatedSubscription: TSetterFunction<[TSubscription]>
    removeCreatedSubscription: TSetterFunction<[string]>
    setCreatedSubscriptions: TSetterFunction<[TSubscription[]]>

    selectedPrefabs: string[]
    setSelectedPrefabs: TSetterFunction<[string[]]>

    currencies: TCurrency[]
    setCurrencies: TSetterFunction<[]>

    prefabs: TPrefab[]
    setPrefabs: TSetterFunction<[]>

    selectedServiceId: string | null
    setSelectedServiceId: TSetterFunction<[string]>
}

export const useOnboardingStore = create<TOnboardingStore>((set, get) => ({
    activePage: 0,
    setActivePage: (newActivePage) => set({ activePage: newActivePage }),

    createdSubscriptions: [],
    addCreatedSubscription: (value) => {
        const updatedSubscriptions = get().createdSubscriptions
        updatedSubscriptions.push(value)
        set({ createdSubscriptions: updatedSubscriptions })
    },
    removeCreatedSubscription: (value) => {
        const subscriptions = get().createdSubscriptions
        const updatedSubscriptions = subscriptions.filter((service) => service.id !== value)
        set({ createdSubscriptions: updatedSubscriptions })
    },
    setCreatedSubscriptions: (values) => set({ createdSubscriptions: values }),

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
