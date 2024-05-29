"use client"

import { useOnboardingStore } from "@/state/context/OnboardingContext"
import AddDetails from "./AddDetails.3"
import GetStarted from "./GetStarted.1"
import PickSubscriptions from "./PickSubscriptions.2"
import { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { TSubscription } from "@/state/onboarding"

export type TParentProps = {
    fieldArray: ReturnType<typeof useFieldArray<{ subscriptions: TSubscription[] }>>
}

export default function Parent({ fieldArray }: TParentProps) {
    const { activePage, setCurrencies, setPrefabs } = useOnboardingStore((state) => state)

    useEffect(() => {
        setCurrencies()
        setPrefabs()
    }, [])

    const pages = [
        <GetStarted key="page1" />,
        <PickSubscriptions key="page2" fieldArray={fieldArray} />,
        <AddDetails key="page3" fieldArray={fieldArray} />,
    ]

    return <div className="gap-4 h-full p-10">{pages[activePage]}</div>
}
