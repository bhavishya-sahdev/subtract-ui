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
import { useEffect, useState } from "react"
import { client } from "@/lib/axiosClient"
import api from "@/lib/api"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"

export default function Dashboard() {
    const subscriptions = useUserStore((state) => state.subscriptions)
    const payments = useUserStore((state) => state.payments)
    const [openDialog, setOpenDialog] = useState(false)

    const [stats, setStats] = useState<{
        year: Record<
            string,
            {
                payments: []
                total: 0
                preferredCurrencyCode: ""
            }
        >
        month: Record<
            `${string}-${string}`,
            {
                payments: []
                total: 0
                preferredCurrencyCode: ""
            }
        >
    }>({ year: {}, month: {} })

    useEffect(() => {
        async function fetchData() {
            try {
                const stats = await client.get(api.payment.stats, {
                    params: {
                        period: "month",
                    },
                })
                setStats(stats.data.data)
            } catch (err: any) {
                console.error(err)
            }
        }
        fetchData()
    }, [])

    const currencies = useUserStore((state) => state.currencies)

    const renderAmount = useRenderAmount(currencies)

    return (
        <div>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 py-4">
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Your Spends This Month</p>
                        <div>
                            <p className="text-xl font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency:
                                        stats.month[`${new Date().getFullYear()}-${new Date().getMonth() + 1}`]
                                            ?.preferredCurrencyCode || "USD",
                                }).format(
                                    stats.month[`${new Date().getFullYear()}-${new Date().getMonth() + 1}`]?.total || 0
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency:
                                        stats.month[`${new Date().getFullYear()}-${new Date().getMonth()}`]
                                            ?.preferredCurrencyCode || "USD",
                                }).format(
                                    (stats.month[`${new Date().getFullYear()}-${new Date().getMonth() + 1}`]?.total ||
                                        0) -
                                        (stats.month[`${new Date().getFullYear()}-${new Date().getMonth()}`]?.total ||
                                            0)
                                )}{" "}
                                over last month)
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Your Spends This Year</p>
                        <div>
                            <p className="text-xl font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: stats.year[`${new Date().getFullYear()}`]?.preferredCurrencyCode || "USD",
                                }).format(stats.year[`${new Date().getFullYear()}`]?.total || 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: stats.year[`${new Date().getFullYear()}`]?.preferredCurrencyCode || "USD",
                                }).format(
                                    (stats.year[`${new Date().getFullYear()}}`]?.total || 0) -
                                        (stats.year[`${new Date().getFullYear() - 1}`]?.total || 0)
                                )}{" "}
                                over last year)
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Payments Made This Month</p>
                        <div>
                            <p className="text-xl font-semibold">
                                {stats.month[`${new Date().getFullYear()}-${new Date().getMonth()}`]?.payments.length ||
                                    0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (
                                {(stats.month[`${new Date().getFullYear()}-${new Date().getMonth()}`]?.payments
                                    .length || 0) -
                                    (stats.month[`${new Date().getFullYear()}-${new Date().getMonth() - 1}`]?.payments
                                        .length || 0)}{" "}
                                over last month)
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-800">
                    <CardContent className="px-5 py-4 spacy-y-2">
                        <p className="text-muted-foreground">Payments Made This Year</p>
                        <div>
                            <p className="text-xl font-semibold">
                                {stats.year[`${new Date().getFullYear()}`]?.payments.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (
                                {(stats.year[`${new Date().getFullYear()}`]?.payments.length || 0) -
                                    (stats.year[`${new Date().getFullYear() - 1}`]?.payments.length || 0)}{" "}
                                over last year)
                            </p>
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
                                <Dialog modal open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Add Subscription
                                        </Button>
                                    </DialogTrigger>
                                    <AddSubscriptionModal handleClose={() => setOpenDialog(false)} details={{}} />
                                </Dialog>

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
