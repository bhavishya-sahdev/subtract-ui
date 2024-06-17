"use client"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/state/context/UserContext"
import { Plus, RotateCw, Mail, X } from "lucide-react"
import { Separator } from "@/components/ui"

import { format } from "date-fns"

export default function Index() {
    const user = useUserStore((state) => state.user)

    if (!user) return

    return (
        <div>
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4 py-4">
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 space-y-2">
                        <p className="text-lg font-semibold">Your Spends This Month</p>
                        <div>
                            <p className="text-2xl font-semibold">$421.89</p>
                            <p className="text-xs text-muted-foreground">(+$320 over last month)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 space-y-2">
                        <p className="text-lg font-semibold">Your Spends This Year</p>
                        <div>
                            <p className="text-2xl font-semibold">$5421.89</p>
                            <p className="text-xs text-muted-foreground">(+$920 over last month)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="py-4 space-y-8 md:space-y-0 md:grid md:grid-cols-[minmax(200px,1fr)_1fr] lg:grid-cols-[minmax(200px,1fr)_1.5fr_minmax(200px,1fr)] sm:gap-x-4 lg:gap-x-6">
                <div className="space-y-6">
                    <p className="text-xl font-semibold">Your Subscriptions</p>
                    <div className="space-y-4">
                        {user.subscriptions
                            .filter((i, idx) => idx < 3)
                            .map((sub, index) => (
                                <Card className="bg-zinc-800" key={index}>
                                    <CardContent className="px-5 py-4 space-y-1">
                                        <p>{sub.name.toUpperCase()}</p>
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {sub.currencyId && sub.currencyId === "USD" ? "$" : "₹"}
                                                {sub.renewalAmount}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Renews on{" "}
                                                {typeof sub.upcomingPaymentDate === "string"
                                                    ? format(new Date(sub.upcomingPaymentDate), "MMMM dd, yyyy")
                                                    : format(sub.upcomingPaymentDate, "MMMM dd, yyyy")}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                    <div>
                        <button className="text-primary">View All</button>
                    </div>
                </div>
                <Separator className="md:hidden" />
                <div className="space-y-8">
                    {/* <p className="text-xl font-semibold"></p> */}

                    <div className="space-y-6">
                        <p className="text-xl font-semibold">Actions</p>

                        <div>
                            <div className="grid md:grid-cols-2 gap-2">
                                <Button className="h-[100px] w-full" variant="secondary">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Subscription
                                </Button>
                                {/* sync emails */}
                                <Button className="h-[100px] w-full" variant="secondary">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Sync Emails
                                </Button>
                                <Button className="h-[100px] w-full" variant="secondary">
                                    <RotateCw className="mr-2 h-5 w-5" />
                                    Refresh
                                </Button>
                                <Button className="h-[100px] w-full" variant="secondary">
                                    <X className="mr-2 h-5 w-5" />
                                    Remove Subscription
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="md:hidden" />
                <div className="space-y-6">
                    <p className="text-xl font-semibold">Your Transactions</p>

                    <div className="space-y-4">
                        <Card className="bg-zinc-800">
                            <CardContent className="px-5 py-4 space-y-2">
                                <p className="text-xl font-semibold">Netflix</p>
                                <div>
                                    <p className="text-2xl font-semibold">$21.89</p>
                                    <p className="text-xs text-muted-foreground">Renews on July 21, 2024</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-800">
                            <CardContent className="px-5 py-4 space-y-2">
                                <p className="text-xl font-semibold">Amazon Prime</p>
                                <div>
                                    <p className="text-2xl font-semibold">$90.89</p>
                                    <p className="text-xs text-muted-foreground">Renews on July 21, 2024</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-800">
                            <CardContent className="px-5 py-4 space-y-2">
                                <p className="text-xl font-semibold">Netflix</p>
                                <div>
                                    <p className="text-2xl font-semibold">$431.89</p>
                                    <p className="text-xs text-muted-foreground">Renews on July 21, 2024</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <button className="text-primary">View All</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
