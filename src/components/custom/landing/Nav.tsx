"use client"

import Link from "next/link"

import { routes } from "@/lib/routes"
import LogoutButton from "../LogoutButton"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import { useUserStore } from "@/state/context/UserContext"

const LandingNav = () => {
    const user = useUserStore((state) => state.user)

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="ml-auto flex items-center space-x-4">
                    {user !== null ? (
                        <>
                            <Link
                                href={routes.dashboard.overview}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={routes.dashboard.overview}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Settings
                            </Link>
                            <LogoutButton
                                as={memo(Button)}
                                variant="ghost"
                                className="text-sm font-medium transition-colors hover:text-primary hover:bg-orange-400/30"
                            />
                        </>
                    ) : (
                        <>
                            <Link
                                href={routes.auth.login}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Login
                            </Link>
                            <Link
                                href={routes.auth.signup}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default LandingNav
