import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useOnboardingStore } from "@/state/onboarding"
import { xor, intersection, union } from "lodash"

export default function PickSubscriptions() {
    const {
        setActivePage,
        createdSubscriptions,
        addCreatedSubscription,
        removeCreatedSubscription,
        prefabs,
        selectedPrefabs,
        setSelectedPrefabs,
    } = useOnboardingStore()

    const initiateNewSubscription = (id: string, name: string) => {
        addCreatedSubscription({
            id,
            name,
            currencyId: "",
            renewalAmount: 0,
            subscribedOn: new Date(),
        })
    }

    const handleToggleSelection = (v: string[]) => {
        let updated: string[] = []
        const diff = xor(v, selectedPrefabs)[0]
        const selectedPrefab = prefabs.filter((p) => p.id === diff)[0]

        if (v.length > selectedPrefabs.length) {
            updated = union(v, selectedPrefabs)
            initiateNewSubscription(selectedPrefab.id, selectedPrefab.name)
        } else {
            updated = intersection(v, selectedPrefabs)
            removeCreatedSubscription(selectedPrefab.id)
        }
        setSelectedPrefabs(updated)
    }

    const handleSubmit = () => {
        if (createdSubscriptions.length == 0) {
            addCreatedSubscription({
                id: "",
                currencyId: "",
                name: "",
                renewalAmount: 0,
                subscribedOn: new Date(),
            })
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
