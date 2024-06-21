import { useState } from "react"
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    toast,
} from "../ui"
import { useUserStore } from "@/state/context/UserContext"
import { removeSubscription } from "@/lib/utils"

type TRemoveSubscriptionModalProps = {
    children: React.ReactNode
}

export default function RemoveSubscriptionModal({ children }: TRemoveSubscriptionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const subscriptions = useUserStore((state) => state.subscriptions)
    const setSubscriptions = useUserStore((state) => state.setSubscriptions)
    const [selectedSubscription, setSelectedSubscription] = useState(
        subscriptions.length > 0 ? subscriptions[0].uuid : undefined
    )

    const handleRemoveSubscription = async () => {
        if (!selectedSubscription) return
        const res = await removeSubscription(selectedSubscription)
        if (res.error !== null)
            return toast({ title: "Failed to remove subscription", description: "Please try again in a while" })

        setSubscriptions(subscriptions.filter((sub) => sub.uuid !== selectedSubscription))
        setSelectedSubscription(undefined)
        toast({ title: "Subscription removed successfully" })
        setIsOpen(false)
    }

    return (
        <Dialog modal open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Remove Subscription</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Select the subscription you want to remove from the dashboard.
                    </p>
                    <Select
                        value={selectedSubscription}
                        onValueChange={(v) => {
                            setSelectedSubscription(v)
                        }}
                    >
                        {/* <FormControl> */}
                        <SelectTrigger>
                            <SelectValue placeholder="Select a subscription" />
                        </SelectTrigger>
                        {/* </FormControl> */}

                        <SelectContent>
                            {subscriptions.map((subscription) => (
                                <SelectItem key={subscription.uuid} value={subscription.uuid}>
                                    {subscription.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleRemoveSubscription} disabled={!selectedSubscription}>
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
