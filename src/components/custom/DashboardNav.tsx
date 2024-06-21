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
import { LogOut, Menu } from "lucide-react"
import { useUserStore } from "@/state/context/UserContext"
import { cn } from "@/lib/utils"
import { Separator, Sheet, SheetContent, SheetTrigger } from "../ui"
import { useState } from "react"

const DashboardNav = () => {
    const user = useUserStore((state) => state.user)

    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // match path
    const pathname = usePathname()
    if (user === null) return null
    return (
        <nav>
            <div className="h-[60px] flex items-center p-4 justify-between bg-[#19191C]">
                <div className="flex gap-4">
                    <Link href={routes.DEFAULT}>
                        <Button variant="ghost" className="text-lg font-bold px-0 hover:bg-transparent">
                            Subtract
                        </Button>
                    </Link>

                    <div className="hidden sm:block">
                        <Link href={routes.dashboard.DEFAULT}>
                            <Button variant="link" className="text-foreground justify-start">
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="hidden md:flex">
                        {user && (
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
                        )}
                    </div>
                    <Sheet open={isSheetOpen} onOpenChange={() => setIsSheetOpen(!isSheetOpen)}>
                        <SheetTrigger asChild className="sm:hidden">
                            <Button size="icon" variant="ghost">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            onCloseAutoFocus={(e) => {
                                e.preventDefault()
                            }}
                        >
                            <nav className="flex flex-col py-2 space-y-2">
                                <Link href={routes.dashboard.overview}>
                                    <Button variant="link" className="text-foreground justify-start">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href={routes.dashboard.settings}>
                                    <Button variant="link" className="text-foreground justify-start">
                                        Settings
                                    </Button>
                                </Link>
                                <Separator />
                                <LogoutButton as={Button} variant="link" className="text-foreground justify-start">
                                    Logout
                                </LogoutButton>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

export default DashboardNav
