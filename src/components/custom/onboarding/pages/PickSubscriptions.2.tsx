import { Button, Card, CardContent, Label, ToggleGroup, ToggleGroupItem } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initiateNewSubscription } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { TSubscription } from "@/state/onboarding"
import { xor, intersection, union } from "lodash"
import { useFieldArray } from "react-hook-form"

export type TPickSubscriptionsProps = {
    fieldArray: ReturnType<typeof useFieldArray<{ subscriptions: TSubscription[] }>>
}

export default function PickSubscriptions({ fieldArray: { fields, remove, append } }: TPickSubscriptionsProps) {
    const { setActivePage, setSelectedServiceId, prefabs, selectedPrefabs, setSelectedPrefabs } = useOnboardingStore(
        (state) => state
    )

    const handleToggleSelection = (v: string[]) => {
        let updated: string[] = []
        const diff = xor(v, selectedPrefabs)[0]
        const selectedPrefab = prefabs.filter((p) => p.id === diff)[0]

        if (v.length > selectedPrefabs.length) {
            updated = union(v, selectedPrefabs)
            append(initiateNewSubscription({ uuid: selectedPrefab.id, name: selectedPrefab.name }))
            setSelectedServiceId(selectedPrefab.id)
        } else {
            updated = intersection(v, selectedPrefabs)
            const getIndex = fields.findIndex((item) => item.id === diff)
            remove(getIndex)
        }
        setSelectedPrefabs(updated)
    }

    const handleSubmit = () => {
        // default the selected subscription to either a newly created empty object's id
        // the first selected service's id
        if (fields.length === 0) {
            const newSub = initiateNewSubscription()
            append(newSub)
            setSelectedServiceId(newSub.uuid)
        }
        setActivePage(2)
    }

    return (
        <div>
            <p className="text-2xl">Add subscriptions</p>
            <p>Pick from the list below to get you started. You can always skip this step.</p>
            <Card className="mt-4 max-h-[400px] overflow-auto">
                <CardContent className="p-4">
                    <ToggleGroup
                        type="multiple"
                        className="grid grid-cols-3 gap-4"
                        size="custom"
                        onValueChange={(v: string[]) => handleToggleSelection(v)}
                        value={selectedPrefabs}
                    >
                        {prefabs.map((prefab) => (
                            <ToggleGroupItem
                                key={prefab.id}
                                value={prefab.id}
                                aria-label={`Select ${prefab.name}`}
                                className="flex flex-col items-center gap-2 p-2 rounded-md w-24 h-24 box-border"
                            >
                                <Avatar>
                                    <AvatarImage src={prefab.image} alt={prefab.name} />
                                    <AvatarFallback>{prefab.name.replace(" ", "").slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <Label
                                    className={`${
                                        prefab.name.length > 10 ? "line-clamp-2 max-w-16" : "truncate max-w-[100px]"
                                    } text-center`}
                                >
                                    {prefab.name}
                                </Label>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </CardContent>
            </Card>
            <Button className="mt-4" onClick={handleSubmit}>
                {selectedPrefabs.length > 0 ? "Next" : "Skip"}
            </Button>
        </div>
    )
}
