import DashboardNav from "@/components/custom/DashboardNav"
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
        redirect("/")
    }

    return (
        <div className="h-full">
            <DashboardNav user={user.data} />
            {children}
        </div>
    )
}
