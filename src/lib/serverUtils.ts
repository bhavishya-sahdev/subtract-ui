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
