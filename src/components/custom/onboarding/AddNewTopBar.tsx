import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useOnboardingStore } from "@/state/onboarding"
import { Plus } from "lucide-react"
import { v4 as uuid } from "uuid"

const AddNewTopBar = () => {
    const { createdSubscriptions, setActivePage, setSelectedServiceId, selectedServiceId, addCreatedSubscription } =
        useOnboardingStore()

    return (
        <Card className="box-border my-4">
            <CardContent className="py-1 px-4 grid gap-3 grid-cols-[max-content_2px_1fr] items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="rounded-full border-dashed border-2">
                            <Plus />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuItem
                            onSelect={() =>
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
                            Create New
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setActivePage(1)}>Pick from list</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator orientation="vertical" />
                <div className="flex overflow-auto gap-6 pt-1 pb-3">
                    {createdSubscriptions.map((service, idx) => {
                        return (
                            <button
                                disabled={selectedServiceId === service.id}
                                className={cn(
                                    "flex flex-col items-center gap-2 w-16 p-2 border rounded-md border-transparent",
                                    selectedServiceId === service.id && "border-stone-800"
                                )}
                                key={service.name}
                                onClick={() => setSelectedServiceId(service.id)}
                            >
                                <Avatar>
                                    {/* <AvatarImage src={service.logoUrl} alt={service.label} /> */}
                                    <AvatarFallback>{service.name.replace(" ", "").slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <Label className="line-clamp-1 w-20 text-center">{service.name}</Label>
                            </button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default AddNewTopBar
