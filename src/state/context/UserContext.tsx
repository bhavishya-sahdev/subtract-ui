"use client"

import { createContext, useContext, useRef } from "react"
import { createUserStore, TUserStore } from "../user"
import { StoreApi, useStore } from "zustand"
import { IDefaultStoreProviderProps, TAxiosUserDetails } from "@/lib/types"

const UserContext = createContext<StoreApi<TUserStore> | null>(null)

export const UserStoreProvider = ({
    children,
    user,
}: IDefaultStoreProviderProps & { user: TAxiosUserDetails | null }) => {
    const storeRef = useRef<StoreApi<TUserStore>>()
    if (!storeRef.current) {
        storeRef.current = createUserStore(user)
    }

    return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>
}

export const useUserStore = <T,>(selector: (store: TUserStore) => T): T => {
    const userStoreContext = useContext(UserContext)

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`)
    }

    return useStore(userStoreContext, selector)
}
