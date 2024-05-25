import LandingNav from "@/components/custom/landing/Nav"
import { routes } from "@/lib/routes"
import { fetchUserDetails } from "@/lib/serverUtils"
import { redirect } from "next/navigation"

export default async function LandingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col">
            <LandingNav />
            {children}
        </div>
    )
}
