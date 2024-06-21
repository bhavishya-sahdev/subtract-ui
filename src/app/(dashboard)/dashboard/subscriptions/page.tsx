"use client"

import PaymentsTable from "@/components/custom/dashboard/PaymentsTable"
import SimpleCard from "@/components/custom/dashboard/SimpleCard"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui"
import { cn, useRenderAmount } from "@/lib/utils"
import { useUserStore } from "@/state/context/UserContext"
import { TSubscription } from "@/state/onboarding"
import { format } from "date-fns"
import { ArrowRight, EllipsisVertical } from "lucide-react"
import { useCallback, useState } from "react"

export default function Subscriptions() {
    const user = useUserStore((state) => state.user)
    const payments = useUserStore((state) => state.payments)
    const currencies = useUserStore((state) => state.currencies)
    const [selectedSubscription, setSelectedSubscription] = useState(user?.subscriptions[0])

    const renderAmount = useRenderAmount(currencies)

    const getTotalAmountForYear = useCallback(
        (subscription: TSubscription) => {
            // get payments where year is the same as current year
            const total = payments.reduce((acc, payment) => {
                if (
                    payment.subscriptionId === subscription.uuid &&
                    new Date(payment.date).getFullYear() === new Date().getFullYear()
                ) {
                    acc += parseFloat(payment.amount as unknown as string)
                }
                return acc
            }, 0)

            return renderAmount(subscription.currencyId!, total)
        },
        [payments, renderAmount]
    )

    const getTotalAmount = useCallback(
        (subscription: TSubscription) => {
            const total = payments.reduce((acc, payment) => {
                if (payment.subscriptionId === subscription.uuid) {
                    acc += parseFloat(payment.amount as unknown as string)
                }
                return acc
            }, 0)

            return renderAmount(subscription.currencyId!, total)
        },
        [payments, renderAmount]
    )

    if (!user) return

    return (
        <div className="space-y-4 h-full py-4 md:space-y-0 md:grid md:grid-cols-[minmax(200px,0.25fr)_1fr] md:gap-4">
            {/* sidebar */}
            <div className="w-full h-max max-h-[320px] rounded-lg overflow-y-auto bg-zinc-800">
                {user.subscriptions.map((subscription) => (
                    <Button
                        key={subscription.uuid}
                        variant="ghost"
                        className={cn(
                            "rounded-none w-full justify-between capitalize",
                            selectedSubscription?.uuid === subscription.uuid && "bg-accent/60"
                        )}
                        onClick={() => setSelectedSubscription(subscription)}
                    >
                        {subscription.name} <ArrowRight size={20} className="stroke-blue-400" />
                    </Button>
                ))}
            </div>

            {/* content */}
            {selectedSubscription && (
                <div>
                    <div className="flex rounded-lg justify-between items-center bg-zinc-800 px-4 py-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 h-max bg-green-500 rounded-full"></div>
                            <p className="font-semibold text-xl">{selectedSubscription.name}</p>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <EllipsisVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="space-y-2" align="end">
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem>Pause Subscription</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        Cancel Subscription
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="mt-2 space-y-2 [&>div]:rounded-lg [&>div]:bg-zinc-800 [&>div]:p-4 md:grid md:grid-cols-3 md:gap-2 md:space-y-0">
                        <SimpleCard
                            title="Subscribed on"
                            description={format(new Date(selectedSubscription.creationDate), "MMMM dd, yyyy")}
                        />
                        <SimpleCard
                            title="Next Renewal on"
                            description={format(new Date(selectedSubscription.upcomingPaymentDate), "MMMM dd, yyyy")}
                        />
                        <SimpleCard title="Billing Cycle" description={selectedSubscription.renewalPeriodEnum} />
                        <SimpleCard
                            title="Renewal Amount"
                            description={renderAmount(
                                selectedSubscription.currencyId!,
                                selectedSubscription.renewalAmount
                            )}
                        />
                        <SimpleCard title="Total this year" description={getTotalAmountForYear(selectedSubscription)} />
                        <SimpleCard title="Lifetime spends" description={getTotalAmount(selectedSubscription)} />
                    </div>
                    <div className="mt-6 space-y-2">
                        <div className="flex rounded-lg justify-between items-center px-4 py-3 border border-zinc-800">
                            <p className="font-semibold text-lg">Payments</p>
                        </div>
                        <PaymentsTable
                            payments={payments.filter(
                                (payment) => payment.subscriptionId === selectedSubscription.uuid
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
