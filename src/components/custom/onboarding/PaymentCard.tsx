import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { TPayment } from "@/state/onboarding"
import { format } from "date-fns"
import { CircleAlert, CircleCheck, Info, SquarePen, Trash2 } from "lucide-react"
import { useCallback, useMemo } from "react"

export default function PaymentCard({ date, amount, currencyId, status = "paid" }: TPayment) {
    const currencies = useOnboardingStore((state) => state.currencies)

    const renderCurrencySymbol = useCallback(
        (value: string) => {
            const c = currencies.find((c) => c.uuid === value)
            if (!c) return ""

            if (c.code === c.symbol) return c.code
            return c.symbol
        },
        [currencies]
    )

    const renderVariantText = useMemo(() => {
        if (status === "paid") {
            return (
                <>
                    <CircleCheck size="16" className="stroke-green-600" />
                    <p className="text-sm text-green-600">Paid</p>
                </>
            )
        } else if (status === "pending") {
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
    }, [status])

    return (
        <div className="flex rounded border w-max bg-zinc-900">
            <div className="p-3 w-[200px] bg-background rounded-[3px]">
                {amount !== undefined && currencyId && currencyId !== "" ? (
                    <p>
                        {renderCurrencySymbol(currencyId)}
                        {amount}
                    </p>
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
