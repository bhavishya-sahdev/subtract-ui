import Link from "next/link"

import { routes } from "@/lib/routes"
import LogoutButton from "./LogoutButton"

type TLandingNavProps = {
    isLoggedIn: boolean
}
const LandingNav = ({ isLoggedIn }: TLandingNavProps) => {
    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="ml-auto flex items-center space-x-4">
                    {isLoggedIn ? (
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
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href={routes.dashboard.overview}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Login
                            </Link>
                            <Link
                                href={routes.dashboard.overview}
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
