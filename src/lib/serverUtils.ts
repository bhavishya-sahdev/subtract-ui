"use server"

import { TPrefab } from "@/state/onboarding"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import api from "./api"
import { client } from "./axiosClient"
import {
    TAxiosCurrencyDetails,
    TAxiosErrorResponse,
    TAxiosPaymentDetails,
    TAxiosSuccessResponse,
    TAxiosUserDetails,
} from "./types"

export const authWithGoogle = async (
    code: string
): Promise<TAxiosSuccessResponse<{ token: string }> | TAxiosErrorResponse<{ message: string }>> => {
    try {
        const res = await client.post(api.auth.google, {
            code,
        })
        return res.data
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to authenticate with Google" },
        }
    }
}

export const fetchUserDetails = cache(
    async (): Promise<TAxiosSuccessResponse<TAxiosUserDetails> | TAxiosErrorResponse<{ message: string }>> => {
        const cookieStore = cookies()
        const token = cookieStore.get("token")
        try {
            const res = await client.get(api.user.getSubscriptions, {
                headers: {
                    Cookie: `token=${token ? token.value : ""}`,
                },
            })
            return res.data
        } catch (error) {
            return {
                data: null,
                error: { message: "Failed to load user data" },
            }
        }
    }
)

export const fetchAllCurrencies = cache(
    async (): Promise<TAxiosSuccessResponse<TAxiosCurrencyDetails[]> | TAxiosErrorResponse<{ message: string }>> => {
        try {
            const res = await client.get(api.utils.currency)
            return res.data
        } catch (error) {
            return {
                data: null,
                error: { message: "Failed to load currency list" },
            }
        }
    }
)

export const fetchUserSubscriptions = cache(async () => {
    const cookieStore = cookies()
    const token = cookieStore.get("token")
    try {
        const res = await client.get(api.user.getSubscriptions, {
            headers: {
                Authorization: `Bearer ${token ? token.value : ""}`,
            },
        })

        return res.data
    } catch (error) {
        return {
            data: null,
            error: { message: "Failed to load subscription data" },
        }
    }
})

export const fetchUserPayments = cache(
    async (): Promise<TAxiosSuccessResponse<TAxiosPaymentDetails[]> | TAxiosErrorResponse<{ message: string }>> => {
        const cookieStore = cookies()
        const token = cookieStore.get("token")
        try {
            const res = await client.get(api.user.getPayments, {
                headers: {
                    Cookie: `token=${token ? token.value : ""}`,
                },
            })

            return res.data
        } catch (error) {
            return {
                data: null,
                error: { message: "Failed to load payment data" },
            }
        }
    }
)

export const fetchPrefabs = cache(
    async (): Promise<TAxiosSuccessResponse<TPrefab[]> | TAxiosErrorResponse<{ message: string }>> => {
        try {
            const res = await client.get(api.utils.prefab)
            return res.data
        } catch (error) {
            return {
                data: null,
                error: { message: "Failed to load prefab list" },
            }
        }
    }
)

export async function handleLogout() {
    const cookieStore = cookies()
    cookieStore.delete("token")
    redirect("/")
}
