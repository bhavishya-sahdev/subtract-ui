"use client"

import { Button } from "@/components/ui"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/state/context/UserContext"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const user = useUserStore((state) => state.user)

    const pathname = usePathname()
    if (!user) return

    return (
        <div>
            <div className="py-4">
                <p className="text-3xl font-semibold">Welcome, {user.name}</p>
                <p className="text-muted-foreground text-lg">Here&apos;s a quick overview of your account</p>
            </div>
            <nav className="flex gap-4">
                <Link href={routes.dashboard.overview}>
                    <Button
                        className={cn(
                            "w-full text-muted-foreground p-0",
                            pathname.startsWith(routes.dashboard.DEFAULT) &&
                                pathname !== routes.dashboard.subscriptions &&
                                "text-foreground"
                        )}
                        variant="link"
                    >
                        Overview
                    </Button>
                </Link>
                <Link href={routes.dashboard.subscriptions}>
                    <Button
                        className={cn(
                            "w-full text-muted-foreground p-0",
                            pathname === routes.dashboard.subscriptions && "text-foreground"
                        )}
                        variant="link"
                    >
                        Subscriptions
                    </Button>
                </Link>
                <Link href="/">
                    <Button
                        className={cn("w-full text-muted-foreground p-0", pathname === "TODO" && "text-foreground")}
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
