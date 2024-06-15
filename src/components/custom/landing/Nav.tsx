"use client"

import Link from "next/link"

import { routes } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/state/context/UserContext"
import { Separator, Sheet, SheetContent, SheetTrigger } from "@/components/ui"
import { Menu } from "lucide-react"
import { useState } from "react"

const LandingNav = () => {
    const user = useUserStore((state) => state.user)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const handleClick = (id: string) => (event: React.MouseEvent) => {
        event.preventDefault()
        console.log(id)
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    return (
        <div className="h-[60px] flex items-center p-4 justify-between bg-[#19191C]">
            <div className="flex gap-4">
                <Link href={routes.DEFAULT}>
                    <Button variant="ghost" className="text-lg font-bold px-0 hover:bg-transparent">
                        Subtract
                    </Button>
                </Link>
                <div className="hidden sm:block">
                    <Button variant="link" onClick={handleClick("about")} className="text-foreground justify-start">
                        About
                    </Button>
                    <Button variant="link" onClick={handleClick("features")} className="text-foreground justify-start">
                        Features
                    </Button>
                    <Button variant="link" onClick={handleClick("pricing")} className="text-foreground justify-start">
                        Pricing
                    </Button>
                </div>
            </div>
            <div>
                <div className="hidden md:flex">
                    {!user ? (
                        <>
                            <Link href={routes.auth.login}>
                                <Button variant="link" className="text-foreground justify-start">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href={routes.auth.signup}>
                                <Button variant="link" className="text-foreground justify-start">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={routes.dashboard.overview}>
                                <Button variant="link" className="text-foreground justify-start">
                                    Dashboard
                                </Button>
                            </Link>
                        </>
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
                            <Button
                                variant="link"
                                onClick={handleClick("about")}
                                className="text-foreground justify-start"
                            >
                                About
                            </Button>
                            <Button
                                variant="link"
                                onClick={handleClick("features")}
                                className="text-foreground justify-start"
                            >
                                Features
                            </Button>
                            <Button
                                variant="link"
                                onClick={handleClick("pricing")}
                                className="text-foreground justify-start"
                            >
                                Pricing
                            </Button>
                            {!user ? (
                                <>
                                    <Separator />

                                    <Link href={routes.auth.login}>
                                        <Button variant="link" className="text-foreground justify-start">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href={routes.auth.signup}>
                                        <Button variant="link" className="text-foreground justify-start">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Separator />

                                    <Link href={routes.dashboard.overview}>
                                        <Button variant="link" className="text-foreground justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default LandingNav
