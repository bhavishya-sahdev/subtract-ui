"use client"

import Link from "next/link"
import { routes } from "@/lib/routes"
import LogoutButton from "../LogoutButton"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import { useUserStore } from "@/state/context/UserContext"

const userLinks = [
    {
        href: routes.dashboard.overview,
        label: "Dashboard",
    },
    {
        href: routes.dashboard.settings,
        label: "Settings",
    },
]

const guestLinks = [
    {
        href: routes.auth.login,
        label: "Login",
    },
    {
        href: routes.auth.signup,
        label: "Sign Up",
    },
]

const LandingNav = () => {
    const user = useUserStore((state) => state.user)

    return (
        <nav className="">
            <div className="flex h-16 items-center px-4">
                <div className="ml-auto flex items-center space-x-4">
                    {user !== null ? (
                        <>
                            {userLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <LogoutButton
                                as={memo(Button)}
                                variant="ghost"
                                className="text-sm font-medium transition-colors hover:text-primary hover:bg-orange-400/30"
                            />
                        </>
                    ) : (
                        <>
                            {guestLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default LandingNav
