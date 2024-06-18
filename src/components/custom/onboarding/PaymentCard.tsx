"use client"

import { useRenderAmount } from "@/lib/utils"
import { useUserStore } from "@/state/context/UserContext"
import { TPayment } from "@/state/onboarding"
import { format } from "date-fns"
import { CircleAlert, CircleCheck, Info } from "lucide-react"
import { useMemo } from "react"

export default function PaymentCard({ date, amount, currencyId, paymentStatusEnum = "paid" }: TPayment) {
    const currencies = useUserStore((state) => state.currencies)
    const renderAmount = useRenderAmount(currencies)

    const renderVariantText = useMemo(() => {
        if (paymentStatusEnum === "paid") {
            return (
                <>
                    <CircleCheck size="16" className="stroke-green-600" />
                    <p className="text-sm text-green-600">Paid</p>
                </>
            )
        } else if (paymentStatusEnum === "pending") {
            return (
                <>
                    <CircleAlert size="16" className="stroke-red-600" />
                    <p className="text-sm text-red-600">Pending</p>
                </>
            )
        } else {
            return (
                <>
                    <Info size="16" className="stroke-yellow-600" />
                    <p className="text-sm text-yellow-600">Upcoming</p>
                </>
            )
        }
    }, [paymentStatusEnum])

    return (
        <div className="flex rounded border w-max bg-zinc-900">
            <div className="p-3 w-[200px] bg-background rounded-[3px]">
                {amount !== undefined && currencyId && currencyId !== "" ? (
                    <p>{renderAmount(currencyId, amount)}</p>
                ) : null}
                <p className="text-sm text-muted-foreground mb-3">{format(date, "PPP")}</p>
                <div className="flex gap-1 items-center">{renderVariantText}</div>
            </div>

            {/* <div className="flex flex-col p-1 gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button status="ghost" size="icon" className="w-max h-max p-1.5">
                                <SquarePen size="16" className="stroke-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                            <p>Edit payment</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button status="ghost" size="icon" className="w-max h-max p-1.5">
                                <Trash2 size="16" className="stroke-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                            <p>Delete payment</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div> */}
        </div>
    )
}
