"use client"

import { Button } from "@/components/ui"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/state/context/UserContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const user = useUserStore((state) => state.user)

    const pathname = usePathname()

    const identifyPage = useMemo(() => {
        if (pathname === routes.dashboard.subscriptions) return "Subscriptions"
        if (pathname === routes.dashboard.payments) return "Payments"
        return "Overview"
    }, [pathname])

    if (!user) return

    return (
        <div>
            <div className="py-4">
                <p className="text-3xl font-semibold">Welcome, {user.name}</p>
                <p className="text-muted-foreground text-lg">
                    {identifyPage === "Overview"
                        ? "Here's a quick overview of your account"
                        : identifyPage === "Payments"
                        ? "Here are your payments"
                        : "Here are your subscriptions"}
                </p>
            </div>
            <nav className="flex gap-4">
                <Link href={routes.dashboard.overview}>
                    <Button
                        tabIndex={-1}
                        className={cn(
                            "w-full text-muted-foreground p-0",
                            identifyPage === "Overview" && "text-foreground"
                        )}
                        variant="link"
                    >
                        Overview
                    </Button>
                </Link>
                <Link href={routes.dashboard.subscriptions}>
                    <Button
                        tabIndex={-1}
                        className={cn(
                            "w-full text-muted-foreground p-0",
                            identifyPage === "Subscriptions" && "text-foreground"
                        )}
                        variant="link"
                    >
                        Subscriptions
                    </Button>
                </Link>
                <Link href={routes.dashboard.payments}>
                    <Button
                        tabIndex={-1}
                        className={cn(
                            "w-full text-muted-foreground p-0",
                            identifyPage === "Payments" && "text-foreground"
                        )}
                        variant="link"
                    >
                        Payments
                    </Button>
                </Link>
            </nav>
            {children}
        </div>
    )
}
