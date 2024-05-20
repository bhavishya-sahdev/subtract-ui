import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useOnboardingStore } from "@/state/onboarding"
import { streamingServices } from "@/state/staticData"

export default function PickSubscriptions() {
    const { setActivePage, selectedServices, setSelectedServices } =
        useOnboardingStore()

    return (
        <div>
            <p className="text-2xl">Add subscriptions</p>
            <p>
                Pick from the list below to get you started. You can always skip
                this step.
            </p>
            <Card className="mt-4 max-h-[400px] overflow-auto">
                <CardContent className="p-4">
                    <ToggleGroup
                        type="multiple"
                        className="grid grid-cols-3 gap-4"
                        size="custom"
                        onValueChange={(v) => {
                            setSelectedServices(v)
                        }}
                        value={selectedServices}
                    >
                        {streamingServices.map((service) => (
                            <ToggleGroupItem
                                key={service.value}
                                value={service.value}
                                aria-label={`Select ${service.label}`}
                                className="flex flex-col items-center border-2 gap-2 p-2 rounded-md h-24"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src={service.logoUrl}
                                        alt={service.label}
                                    />
                                    <AvatarFallback>
                                        {service.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <Label
                                    className={`${
                                        service.label.length > 10
                                            ? "line-clamp-2 max-w-16"
                                            : "truncate max-w-[100px]"
                                    } text-center`}
                                >
                                    {service.label}
                                </Label>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </CardContent>
            </Card>
            <Button className="mt-4" onClick={() => setActivePage(2)}>
                {selectedServices.length > 0 ? "Next" : "Skip"}
            </Button>
        </div>
    )
}
