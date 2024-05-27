import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/state/onboarding"

export default function GetStarted() {
    const { setActivePage } = useOnboardingStore()

    return (
        <div>
            <p className="text-2xl">Congratulations!</p>
            <p>
                You made it through the first step, now let&apos;s get you
                started.
            </p>
            <Button className="mt-4" onClick={() => setActivePage(1)}>
                Let&apos;s get started
            </Button>
        </div>
    )
}
