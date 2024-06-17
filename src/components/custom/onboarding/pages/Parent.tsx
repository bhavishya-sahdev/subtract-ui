"use client"

import { useOnboardingStore } from "@/state/context/OnboardingContext"
import AddDetails from "./AddDetails.3"
import GetStarted from "./GetStarted.1"
import PickSubscriptions from "./PickSubscriptions.2"
import { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { TSubscription } from "@/state/onboarding"

export default function Parent() {
    const { activePage, setPrefabs } = useOnboardingStore((state) => state)

    const fieldArray = useFieldArray<{ subscriptions: TSubscription[] }>({
        name: "subscriptions",
    })

    useEffect(() => {
        setPrefabs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const pages = [
        <GetStarted key="page1" />,
        <PickSubscriptions key="page2" fieldArray={fieldArray} />,
        <AddDetails key="page3" fieldArray={fieldArray} />,
    ]

    return (
        <div className="gap-4 min-h-max h-full p-4 mx-auto w-full max-w-screen-lg overflow-auto">
            {pages[activePage]}
        </div>
    )
}
