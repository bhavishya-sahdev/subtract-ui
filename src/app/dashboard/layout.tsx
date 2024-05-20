import DashboardNav from "@/components/custom/DashboardNav"
import { routes } from "@/lib/routes"
import { fetchUserDetails, fetchUserSubscriptions } from "@/lib/serverUtils"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const user = await fetchUserDetails()
    const subscriptions = await fetchUserSubscriptions()
    console.log(subscriptions)
    if (user.error !== null) redirect(routes.auth.login)

    if (!user.data.isOnboardingComplete) redirect(routes.dashboard.onboarding)

    return (
        <>
            <DashboardNav user={user.data} />
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </>
    )
}
