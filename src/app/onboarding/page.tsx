"use client"
import AddDetails from "@/components/custom/onboarding/pages/AddDetails.3"
import GetStarted from "@/components/custom/onboarding/pages/GetStarted.1"
import PickSubscriptions from "@/components/custom/onboarding/pages/PickSubscriptions.2"
import { useOnboardingStore } from "@/state/onboarding"
import { useEffect } from "react"

const pages = [<GetStarted key="page1" />, <PickSubscriptions key="page2" />, <AddDetails key="page3" />]

export default function Onboard() {
    const { activePage, setCurrencies, setPrefabs } = useOnboardingStore()

    useEffect(() => {
        setCurrencies()
        setPrefabs()
    }, [])

    return <div className="mx-auto gap-4 max-w-md h-full">{pages[activePage]}</div>
}
