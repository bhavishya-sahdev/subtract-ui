import { TAxiosUserDetails, TSetterFunction } from "@/lib/types"
import { createStore } from "zustand/vanilla"

export type TUserState = {
    user: TAxiosUserDetails | null
}

export type TUserActions = {
    setUser: TSetterFunction<[TUserState["user"]]>
}

export type TUserStore = TUserActions & TUserState

export const createUserStore = (initUser: TAxiosUserDetails | null = null) => {
    return createStore<TUserStore>()((set) => ({
        user: initUser,
        setUser: (user) => set({ user }),
    }))
}
