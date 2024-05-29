import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/state/context/OnboardingContext"

export default function GetStarted() {
    const setActivePage = useOnboardingStore((state) => state.setActivePage)

    return (
        <div>
            <p className="text-2xl">Congratulations!</p>
            <p>You made it through the first step, now let&apos;s get you started.</p>
            <Button className="mt-4" onClick={() => setActivePage(1)}>
                Let&apos;s get started
            </Button>
        </div>
    )
}
