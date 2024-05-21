"use client"

import Link from "next/link"

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
import { TAxiosUserDetails } from "@/lib/types"
import LogoutButton from "./LogoutButton"
import { LogOut } from "lucide-react"

type TDashboardNavProps = {
    user: TAxiosUserDetails
}
const DashboardNav = ({ user }: TDashboardNavProps) => {
    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-4 lg:space-x-6 mx-4">
                    <Link
                        href={routes.dashboard.overview}
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Overview
                    </Link>
                    <Link
                        href={routes.dashboard.details}
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Details
                    </Link>
                    <Link
                        href={routes.dashboard.settings}
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Settings
                    </Link>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="md:w-[100px] lg:w-[300px]"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {user.name.replace(" ", "").slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                        >
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
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
