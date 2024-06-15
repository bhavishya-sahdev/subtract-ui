"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import { createUserStore, TUserStore } from "../user"
import { StoreApi, useStore } from "zustand"
import { IDefaultStoreProviderProps, TAxiosPaymentDetails, TAxiosUserDetails } from "@/lib/types"
import { setCurrencyList } from "@/lib/utils"

const UserContext = createContext<StoreApi<TUserStore> | null>(null)

export const UserStoreProvider = ({
    children,
    user,
    payments,
}: IDefaultStoreProviderProps & { user: TAxiosUserDetails | null; payments: TAxiosPaymentDetails[] }) => {
    const storeRef = useRef<StoreApi<TUserStore>>()
    if (!storeRef.current) {
        storeRef.current = createUserStore(user, [], payments)
    }

    useEffect(() => {
        // eslint-disable-next-line no-extra-semi
        ;(async () => setCurrencyList())()
    }, [])

    return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>
}

export const useUserStore = <T,>(selector: (store: TUserStore) => T): T => {
    const userStoreContext = useContext(UserContext)

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`)
    }

    return useStore(userStoreContext, selector)
}
