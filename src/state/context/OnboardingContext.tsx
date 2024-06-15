"use client"

import { createContext, useContext, useRef } from "react"
import { StoreApi, useStore } from "zustand"
import { createOnboardingStore, TOnboardingStore } from "../onboarding"
import { IDefaultStoreProviderProps } from "@/lib/types"

const OnboardingContext = createContext<StoreApi<TOnboardingStore> | null>(null)

export const OnboardingStoreProvider = ({ children }: IDefaultStoreProviderProps) => {
    const storeRef = useRef<StoreApi<TOnboardingStore>>()
    if (!storeRef.current) {
        storeRef.current = createOnboardingStore()
    }

    return <OnboardingContext.Provider value={storeRef.current}>{children}</OnboardingContext.Provider>
}

export const useOnboardingStore = <T,>(selector: (store: TOnboardingStore) => T): T => {
    const OnboardingStoreContext = useContext(OnboardingContext)

    if (!OnboardingStoreContext) {
        throw new Error(`useOnboardingStore must be use within OnboardingStoreProvider`)
    }

    return useStore(OnboardingStoreContext, selector)
}
