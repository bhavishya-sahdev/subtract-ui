"use client"
import api from "@/lib/api"
import { client } from "@/lib/axiosClient"
import { routes } from "@/lib/routes"
import { fetchUserDetails, fetchUserPayments } from "@/lib/serverUtils"
import { useUserStore } from "@/state/context/UserContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
export default function Callback() {
    const params = useSearchParams()
    const { push } = useRouter()
    const setUser = useUserStore((state) => state.setUser)
    const setPayments = useUserStore((state) => state.setPayments)
    const user = useUserStore((state) => state.user)

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line no-extra-semi
            ;(async () => {
                const { data: payments } = await fetchUserPayments()
                if (payments) setPayments(payments)
                push(user.isOnboardingComplete ? routes.dashboard.overview : routes.dashboard.onboarding)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        const authenticateWithGoogle = async () => {
            const code = params.get("code")
            if (!code) return

            const res = await client.post(api.auth.google, {
                code,
            })

            if (res.data.error !== null) return push(routes.DEFAULT)

            const user = await fetchUserDetails()
            setUser(user.data)
        }

        authenticateWithGoogle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    return (
        <div>
            <p>Please wait while authentication is in progress</p>
        </div>
    )
}
