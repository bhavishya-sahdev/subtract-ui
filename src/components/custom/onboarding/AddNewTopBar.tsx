import { Button, Card, CardContent, Separator } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useOnboardingStore } from "@/state/onboarding"
import { PlusCircle, Trash2 } from "lucide-react"
import { v4 as uuid } from "uuid"

const AddNewTopBar = () => {
    const {
        createdSubscriptions,
        setSelectedServiceId,
        selectedServiceId,
        addCreatedSubscription,
        setCreatedSubscriptions,
        selectedPrefabs,
        setSelectedPrefabs,
    } = useOnboardingStore()

    const handleRemove = () => {
        // check if the item being removed is a prefab
        setSelectedPrefabs(selectedPrefabs.filter((p) => p !== selectedServiceId))

        if (createdSubscriptions.length > 1) {
            const updatedList = createdSubscriptions.filter((s) => s.id !== selectedServiceId)
            setSelectedServiceId(updatedList[0].id)
            setCreatedSubscriptions(updatedList)
        } else {
            const id = uuid()
            setCreatedSubscriptions([
                {
                    id: id,
                    currencyId: "",
                    name: "",
                    renewalAmount: 0,
                    subscribedOn: new Date(),
                    renewalPeriodEnum: "monthly",
                    renewalPeriodDays: 1,
                },
            ])
            setSelectedServiceId(id)
        }
    }

    return (
        <Card className="box-border w-[300px] bg-[#0F0F0F]">
            <CardContent className="p-3 space-y-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="space-x-2 w-full justify-start"
                    onClick={() =>
                        addCreatedSubscription({
                            id: uuid(),
                            name: "",
                            currencyId: "",
                            renewalAmount: 0,
                            subscribedOn: new Date(),
                            renewalPeriodEnum: "monthly",
                            renewalPeriodDays: 1,
                        })
                    }
                >
                    <PlusCircle className="stroke-1 w-5 h-5" /> <p>Add new</p>
                </Button>
                <Separator />
                <div className="overflow-auto space-y-2">
                    {createdSubscriptions.map((service, idx) => {
                        return (
                            <div
                                key={service.name}
                                className="grid grid-cols-[minmax(60px,100%)_max-content] items-center gap-1"
                            >
                                <Button
                                    variant="ghost"
                                    disabled={selectedServiceId === service.id}
                                    className={cn(
                                        "w-full justify-start overflow-clip",
                                        selectedServiceId === service.id && "bg-stone-800"
                                    )}
                                    onClick={() => setSelectedServiceId(service.id)}
                                >
                                    {service.name || "Unnamed"}
                                </Button>
                                <Button variant="ghost" size="icon" className="shrink-0" onClick={handleRemove}>
                                    <Trash2 size="20" className="stroke-destructive" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default AddNewTopBar
