import DashboardNav from "@/components/custom/DashboardNav"
import { Button } from "@/components/ui"
import { fetchUserSubscriptions } from "@/lib/serverUtils"
import { Calendar, Home, Settings } from "lucide-react"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const subscriptions = await fetchUserSubscriptions()

    return (
        <div className="min-h-screen flex flex-col">
            <DashboardNav />
            <div className="flex flex-1">
                <div className="w-[20%] flex justify-between flex-col max-w-[300px] border-r border-r-zinc-800">
                    <nav className="p-4">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Home size={18} /> Overview
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Calendar size={18} /> Calender
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings size={18} /> Settings
                        </Button>
                    </nav>
                    <div>
                        <Button>Options</Button>
                    </div>
                </div>

                <div className="space-y-4 p-8 pt-6 flex-1">{children}</div>
            </div>
        </div>
    )
}
