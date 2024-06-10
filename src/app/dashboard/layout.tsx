import DashboardNav from "@/components/custom/DashboardNav"
import { Button } from "@/components/ui"
import { Calendar, Home, Settings } from "lucide-react"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <DashboardNav />
            <div className="flex flex-1">
                <div className="space-y-4 p-8 pt-6 flex-1">{children}</div>
            </div>
        </div>
    )
}
