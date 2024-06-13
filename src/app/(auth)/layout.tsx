import { routes } from "@/lib/routes"
import { fetchUserDetails } from "@/lib/serverUtils"
import { redirect } from "next/navigation"

export default async function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#19191C] to-[#24242B]">
            {children}
        </div>
    )
}
