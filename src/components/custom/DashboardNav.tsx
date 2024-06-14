"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { GearIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { routes } from "@/lib/routes"
import LogoutButton from "./LogoutButton"
import { LogOut } from "lucide-react"
import { useUserStore } from "@/state/context/UserContext"
import { cn } from "@/lib/utils"

const DashboardNav = () => {
    const user = useUserStore((state) => state.user)

    // match path
    const pathname = usePathname()
    if (user === null) return null
    return (
        <nav>
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-4 lg:space-x-6 mx-4">
                    <Link href={routes.DEFAULT}>
                        <Button
                            variant="link"
                            className={cn(
                                "w-full text-muted-foreground p-0",
                                pathname === routes.DEFAULT && "text-foreground"
                            )}
                        >
                            Home
                        </Button>
                    </Link>

                    <Link href={routes.dashboard.overview}>
                        <Button
                            variant="link"
                            className={cn(
                                "w-full text-muted-foreground p-0",
                                pathname.startsWith(routes.dashboard.DEFAULT) &&
                                    pathname !== routes.dashboard.settings &&
                                    "text-foreground"
                            )}
                        >
                            Dashboard
                        </Button>
                    </Link>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Input type="search" placeholder="Search..." className="md:w-[100px] lg:w-[300px]" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar>
                                    <AvatarFallback>{user.name.replace(" ", "").slice(0, 2)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={routes.dashboard.settings}>
                                <DropdownMenuItem>
                                    <GearIcon className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                            </Link>
                            <LogoutButton as={DropdownMenuItem}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </LogoutButton>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

export default DashboardNav
