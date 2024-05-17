import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { client } from "./axiosClient"
import api from "./api"
import { cookies } from "next/headers"
import { cache } from "react"
import {
    TAxiosErrorResponse,
    TAxiosSuccessResponse,
    TAxiosUserDetails,
} from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const fetchUserDetails = cache(
    async (): Promise<
        | TAxiosSuccessResponse<TAxiosUserDetails>
        | TAxiosErrorResponse<{ message: string }>
    > => {
        const cookieStore = cookies()
        const token = cookieStore.get("token")
        try {
            const res = await client.get(api.user.getDetails, {
                headers: {
                    Authorization: `Bearer ${token ? token.value : ""}`,
                },
            })
            if (res.data.error !== null) cookieStore.delete("token")
            return res.data
        } catch (error) {
            cookieStore.delete("token")
            return {
                data: null,
                error: { message: "Failed to load user data" },
            }
        }
    }
)
