"use server"

import { client } from "./axiosClient"
import api from "./api"
import { cookies } from "next/headers"
import { cache } from "react"
import {
    TAxiosErrorResponse,
    TAxiosSuccessResponse,
    TAxiosUserDetails,
} from "./types"
import { redirect } from "next/navigation"

export const fetchUserDetails = cache(
    async (): Promise<
        | TAxiosSuccessResponse<TAxiosUserDetails>
        | TAxiosErrorResponse<{ message: string }>
    > => {
        "use server"
        const cookieStore = cookies()
        const token = cookieStore.get("token")
        try {
            const res = await client.get(api.user.getDetails, {
                headers: {
                    Authorization: `Bearer ${token ? token.value : ""}`,
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

export async function handleLogout() {
    const cookieStore = cookies()
    cookieStore.delete("token")
    redirect("/")
}
