import { create } from "zustand"

type TSetterFunction<T extends any[]> = (...args: T) => void

type TOnboardingStore = {
    activePage: number
    setActivePage: TSetterFunction<[number]>
    selectedServices: string[]
    setSelectedServices: TSetterFunction<[string[]]>
}

export const useOnboardingStore = create<TOnboardingStore>((set) => ({
    activePage: 0,
    setActivePage: (newActivePage) => set({ activePage: newActivePage }),

    selectedServices: [],
    setSelectedServices: (values) => {
        set({ selectedServices: values })
    },
}))
