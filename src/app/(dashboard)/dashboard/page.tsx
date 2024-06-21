"use client"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/state/context/UserContext"
import { Plus, RotateCw, Mail, X } from "lucide-react"
import { Separator } from "@/components/ui"

import { format } from "date-fns"
import { useRenderAmount } from "@/lib/utils"
import Link from "next/link"
import { routes } from "@/lib/routes"
import AddSubscriptionModal from "@/components/custom/AddSubscriptionModal"
import RemoveSubscriptionModal from "@/components/custom/RemoveSubscriptionModal"

export default function Dashboard() {
    const subscriptions = useUserStore((state) => state.subscriptions)
    const payments = useUserStore((state) => state.payments)

    const currencies = useUserStore((state) => state.currencies)

    const renderAmount = useRenderAmount(currencies)

    return (
        <div>
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4 py-4">
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Your Spends This Month</p>
                        <div>
                            <p className="text-xl font-semibold">$421.89</p>
                            <p className="text-xs text-muted-foreground">(+$320 over last month)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Your Spends This Year</p>
                        <div>
                            <p className="text-xl font-semibold">$5421.89</p>
                            <p className="text-xs text-muted-foreground">(+$920 over last month)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="py-4 space-y-8 md:space-y-4 md:grid md:grid-cols-[minmax(200px,1fr)_1fr] lg:space-y-0 lg:grid-cols-[minmax(200px,1fr)_1.5fr_minmax(200px,1fr)] sm:gap-x-4 lg:gap-x-6">
                <div className="space-y-3">
                    <p className="text-xl font-semibold">Your Subscriptions</p>
                    <div className="space-y-2">
                        {subscriptions.length > 0 ? (
                            subscriptions
                                .filter((_i, idx) => idx < 3)
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
                                ))
                        ) : (
                            <p className="text-muted-foreground">No subscriptions found</p>
                        )}
                    </div>
                    <div>
                        <Link href={routes.dashboard.subscriptions}>
                            <button className="text-primary">View All</button>
                        </Link>
                    </div>
                </div>
                <Separator className="md:hidden" />
                <div className="space-y-8">
                    {/* <p className="text-xl font-semibold"></p> */}

                    <div className="space-y-3">
                        <p className="text-xl font-semibold">Actions</p>

                        <div>
                            <div className="grid md:grid-cols-2 gap-2 [&>button]:w-full [&>button]:h-[100px] [&>button]:flex-col [&>button]:gap-1">
                                <AddSubscriptionModal>
                                    <Button variant="secondary">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add Subscription
                                    </Button>
                                </AddSubscriptionModal>

                                {/* sync emails */}
                                <Button variant="secondary">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Sync Emails
                                </Button>
                                <Button variant="secondary">
                                    <RotateCw className="mr-2 h-5 w-5" />
                                    Refresh
                                </Button>
                                <RemoveSubscriptionModal>
                                    <Button variant="secondary">
                                        <X className="mr-2 h-5 w-5" />
                                        <p>Remove Subscription</p>
                                    </Button>
                                </RemoveSubscriptionModal>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="md:hidden" />
                <div className="space-y-3">
                    <p className="text-xl font-semibold">Your Transactions</p>

                    <div className="space-y-4">
                        <Card className="bg-zinc-800">
                            <CardContent className="px-5 py-4 space-y-5">
                                {/* sort payments in descending order and display */}
                                {payments.length > 0 ? (
                                    payments
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .filter((i) => i.paymentStatusEnum === "paid")
                                        .filter((_i, idx) => idx < 6)
                                        .map((payment, index) => (
                                            <div key={index}>
                                                {/* get subscription name */}
                                                <p className="capitalize font-semibold">
                                                    {subscriptions.find((sub) => sub.uuid === payment.subscriptionId)
                                                        ?.name || "Unknown"}
                                                </p>
                                                <p className="text-sm ">
                                                    {renderAmount(payment.currencyId, payment.amount)}{" "}
                                                    <span className="text-muted-foreground">
                                                        {format(new Date(payment.date), "MMMM dd, yyyy")}
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-muted-foreground">No transactions found</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Link href={routes.dashboard.payments}>
                            <button className="text-primary">View All</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
