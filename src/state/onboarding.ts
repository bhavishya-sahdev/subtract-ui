import { create } from "zustand"
import { streamingDataID } from "./staticData"

type TSetterFunction<T extends any[]> = (...args: T) => void

type TSubscription = {
    id: string
    name: string
    subscribedOn: Date
    currencyId: string
    renewalAmount: number
}

type TOnboardingStore = {
    activePage: number
    setActivePage: TSetterFunction<[number]>
    selectedServices: streamingDataID[]
    setSelectedServices: TSetterFunction<[streamingDataID[]]>

    createdSubscriptions: TSubscription[]
    addCreatedSubscription: TSetterFunction<[TSubscription]>
    removeCreatedSubscription: TSetterFunction<[string]>
    setCreatedSubscriptions: TSetterFunction<[TSubscription[]]>
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
        const updatedSubscriptions = subscriptions.filter(
            (service) => service.id !== value
        )
        set({ createdSubscriptions: updatedSubscriptions })
    },
    setCreatedSubscriptions: (values) => set({ createdSubscriptions: values }),
}))
