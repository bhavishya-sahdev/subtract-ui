import { routes } from "@/lib/routes"
import { fetchUserDetails } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const user = await fetchUserDetails()

    if (user.error === null) {
        if (user.data.isOnboardingComplete) redirect(routes.dashboard.overview)
        else redirect(routes.dashboard.onboarding)
    }
    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    )
}
