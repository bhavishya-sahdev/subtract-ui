import { Button, Card, CardContent, Separator, Tooltip, TooltipContent, TooltipProvider } from "@/components/ui"
import { cn, initiateNewSubscription } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { TOnboardingForm, TSubscription } from "@/state/onboarding"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { PlusCircle, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

export type TAddNewTopBarProps = {
    fieldArray: ReturnType<typeof useFieldArray<{ subscriptions: TSubscription[] }>>
}

const AddNewTopBar = ({ fieldArray: { remove, prepend, fields } }: TAddNewTopBarProps) => {
    const { setSelectedServiceId, selectedServiceId, selectedPrefabs, setSelectedPrefabs } = useOnboardingStore(
        (state) => state
    )
    const {
        watch,
        formState: { errors },
    } = useFormContext<TOnboardingForm>()
    const fieldValues = watch("subscriptions")
    const removeItem = (idx: number, id: string) => {
        const lengthBeforeDeletion = fields.length
        setSelectedPrefabs(selectedPrefabs.filter((p) => p !== id))
        remove(idx)
        if (lengthBeforeDeletion <= 1) {
            const newSub = initiateNewSubscription()
            prepend(newSub)
            setSelectedServiceId(newSub.uuid)
        }
    }

    return (
        <Card className="box-border w-full bg-[#0F0F0F]">
            <CardContent className="p-3 space-y-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="space-x-2 w-full justify-start"
                    onClick={() => {
                        prepend(initiateNewSubscription())
                    }}
                >
                    <PlusCircle className="stroke-1 w-5 h-5" /> <p>Add new</p>
                </Button>

                <Separator />

                <div className="overflow-auto space-y-2 max-h-[200px]">
                    {fieldValues.map((service, idx) => {
                        return (
                            <div
                                key={service.uuid}
                                className="grid grid-cols-[minmax(60px,100%)_max-content] items-center gap-1"
                            >
                                <Button
                                    variant="ghost"
                                    disabled={selectedServiceId === service.uuid}
                                    className={cn(
                                        "w-full justify-start overflow-clip",
                                        selectedServiceId === service.uuid && "bg-stone-800",
                                        Object.keys(errors?.subscriptions?.[idx] || {}).length > 0 && "text-destructive"
                                    )}
                                    onClick={() => setSelectedServiceId(service.uuid)}
                                >
                                    {service.name || "Unnamed"}
                                </Button>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => removeItem(idx, service.uuid)}
                                            >
                                                <Trash2 size="20" className="stroke-destructive" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="start">
                                            <p>Delete subscription</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default AddNewTopBar
