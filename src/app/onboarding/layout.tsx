import DashboardNav from "@/components/custom/DashboardNav"
import { routes } from "@/lib/routes"
import { fetchUserDetails } from "@/lib/serverUtils"
import { redirect } from "next/navigation"

export default async function OnboardingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const user = await fetchUserDetails()
    // const subscriptions = await fetchUserSubscriptions()
    // console.log(subscriptions)
    if (user.error !== null) {
        redirect(routes.auth.login)
    }

    return (
        <div className="h-full flex flex-col">
            <DashboardNav user={user.data} />
            {children}
        </div>
    )
}
