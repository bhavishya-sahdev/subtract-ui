"use server"

import { TCurrency, TPrefab } from "@/state/onboarding"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import api from "./api"
import { client } from "./axiosClient"
import { TAxiosErrorResponse, TAxiosSuccessResponse, TAxiosUserDetails } from "./types"

export const fetchUserDetails = cache(
  async (): Promise<TAxiosSuccessResponse<TAxiosUserDetails> | TAxiosErrorResponse<{ message: string }>> => {
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
        error: { message: "Failed to load user data" },
      }
    }
  }
)

export const fetchAllCurrencies = cache(
  async (): Promise<TAxiosSuccessResponse<TCurrency[]> | TAxiosErrorResponse<{ message: string }>> => {
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
