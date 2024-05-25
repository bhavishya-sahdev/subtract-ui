import DashboardNav from "@/components/custom/DashboardNav"
import { routes } from "@/lib/routes"
import { fetchUserDetails, fetchUserSubscriptions } from "@/lib/serverUtils"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const subscriptions = await fetchUserSubscriptions()

    return (
        <>
            <DashboardNav />
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </>
    )
}
