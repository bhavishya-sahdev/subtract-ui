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
        <div className="h-full">
            <div className="h-[60px] flex items-center p-4 justify-between bg-[#19191C]">
                <Link href={routes.DEFAULT}>
                    <Button variant="ghost" className="text-lg font-bold px-0 hover:bg-transparent">
                        Subtract
                    </Button>
                </Link>
                <div>
                    <div className="hidden md:flex">
                        <Link href={routes.auth.login}>
                            <Button variant="link" className="text-foreground justify-start">
                                Sign in
                            </Button>
                        </Link>
                        <Link href={routes.auth.signup}>
                            <Button variant="link" className="text-foreground justify-start">
                                Sign up
                            </Button>
                        </Link>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild className="sm:hidden">
                            <Button size="icon" variant="ghost">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="flex flex-col py-2 space-y-2">
                                <Link href={routes.auth.login}>
                                    <Button variant="link" className="text-foreground justify-start">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href={routes.auth.signup}>
                                    <Button variant="link" className="text-foreground justify-start">
                                        Sign up
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            {children}
        </div>
    )
}
