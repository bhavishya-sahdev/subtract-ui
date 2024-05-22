import { create } from "zustand"
import { fetchAllCurrencies } from "@/lib/serverUtils"

type TSetterFunction<T extends any[]> = (...args: T) => void

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

type TOnboardingStore = {
    activePage: number
    setActivePage: TSetterFunction<[number]>

    selectedServices: string[]
    setSelectedServices: TSetterFunction<[string[]]>

    createdSubscriptions: TSubscription[]
    addCreatedSubscription: TSetterFunction<[TSubscription]>
    removeCreatedSubscription: TSetterFunction<[string]>
    setCreatedSubscriptions: TSetterFunction<[TSubscription[]]>

    currencies: TCurrency[]
    setCurrencies: TSetterFunction<[]>
}

export const useOnboardingStore = create<TOnboardingStore>((set, get) => ({
    activePage: 0,
    setActivePage: (newActivePage) => set({ activePage: newActivePage }),

    selectedServices: [],
    setSelectedServices: (values) => set({ selectedServices: values }),

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

    currencies: [],
    setCurrencies: async () => {
        const res = await fetchAllCurrencies()
        if (res.data) set({ currencies: res.data })
    },
}))
