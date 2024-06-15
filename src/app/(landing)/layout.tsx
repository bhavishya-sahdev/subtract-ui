import LandingNav from "@/components/custom/landing/Nav"
import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui"
import { routes } from "@/lib/routes"
import { Menu } from "lucide-react"
import Link from "next/link"

export default async function LandingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col">
            <LandingNav />
            <div className="h-full overflow-auto">{children}</div>
        </div>
    )
}
