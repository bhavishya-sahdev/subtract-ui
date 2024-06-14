"use client"

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui"
import { useUserStore } from "@/state/context/UserContext"
import { format } from "date-fns"
import { ArrowRight, EllipsisVertical } from "lucide-react"
import { useState } from "react"

export default function Subscriptions() {
    const user = useUserStore((state) => state.user)
    const [selectedSubscription, setSelectedSubscription] = useState(user?.subscriptions[0])

    if (!user) return

    return (
        <div className="space-y-4 py-4 md:space-y-0 md:grid md:grid-cols-[minmax(200px,0.25fr)_1fr] md:gap-4">
            {/* sidebar */}
            <div className="w-full h-max rounded-lg overflow-hidden bg-zinc-800">
                {user.subscriptions.map((subscription) => (
                    <Button
                        key={subscription.uuid}
                        variant="ghost"
                        className="rounded-none w-full justify-between"
                        onClick={() => setSelectedSubscription(subscription)}
                    >
                        {subscription.name} <ArrowRight size={20} />
                    </Button>
                ))}
            </div>

            {/* content */}
            {selectedSubscription && (
                <div className="space-y-2">
                    <div className="flex rounded-lg justify-between items-center bg-zinc-800 px-4 py-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 h-max bg-green-500 rounded-full"></div>
                            <p className="font-semibold text-xl">{selectedSubscription.name}</p>
                        </div>
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <EllipsisVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="space-y-2" align="end">
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        Cancel Subscription
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <Button variant="ghost" className="w-full" size="sm">
                                Edit Details
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-destructive hover:text-destructive"
                                size="sm"
                            >
                                Cancel Subscription
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2 [&>div]:rounded-lg [&>div]:bg-zinc-700 [&>div]:p-4 md:grid md:grid-cols-3 md:gap-2 md:space-y-0">
                        <div>
                            <p className="text-muted-foreground">Subscribed on</p>
                            <p className="text-lg font-semibold">
                                {typeof selectedSubscription.creationDate === "string"
                                    ? format(new Date(selectedSubscription.creationDate), "MMMM dd, yyyy")
                                    : format(selectedSubscription.creationDate, "MMMM dd, yyyy")}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Next Renewal on</p>
                            <p className="text-lg font-semibold">
                                {typeof selectedSubscription.upcomingPaymentDate === "string"
                                    ? format(new Date(selectedSubscription.upcomingPaymentDate), "MMMM dd, yyyy")
                                    : format(selectedSubscription.upcomingPaymentDate, "MMMM dd, yyyy")}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Billing Cycle</p>
                            <p className="text-lg font-semibold">
                                {selectedSubscription.renewalPeriodEnum}
                                {selectedSubscription.renewalPeriodEnum === "custom" &&
                                    `, every ${selectedSubscription.renewalPeriodDays} weeks`}
                            </p>
                        </div>
                    </div>
                    <p>Payments</p>
                </div>
            )}
        </div>
    )
}
