import { fetchAllCurrencies } from "@/lib/serverUtils"
import { TAxiosCurrencyDetails, TAxiosPaymentDetails, TAxiosUserDetails, TSetterFunction } from "@/lib/types"
import { createStore } from "zustand/vanilla"

export type TUserState = {
    user: TAxiosUserDetails | null
    subscriptions: TAxiosUserDetails["subscriptions"]
    payments: TAxiosPaymentDetails[]
}

export type TUserActions = {
    setUser: TSetterFunction<[TUserState["user"]]>
    setSubscriptions: TSetterFunction<[TUserState["subscriptions"]]>
    fetchSubscriptions: () => Promise<void>
    setPayments: TSetterFunction<[TUserState["payments"]]>
    fetchPayments: () => Promise<void>
}

export type TUserStore = TUserActions & TUserState

export const createUserStore = (
    initUser: TAxiosUserDetails | null = null,
    initSubscriptions: TAxiosUserDetails["subscriptions"] = [],
    initPayments: TAxiosPaymentDetails[] = []
) => {
    return createStore<TUserStore>()((set) => ({
        user: initUser,
        setUser: (user) => set({ user }),

        subscriptions: initSubscriptions,
        setSubscriptions: (subscriptions) => set({ subscriptions }),
        fetchSubscriptions: async () => {
            // fetch subscriptions
        },

        payments: initPayments,
        fetchPayments: async () => {
            // fetch payments
        },
        setPayments: (payments) => set({ payments }),
    }))
}
