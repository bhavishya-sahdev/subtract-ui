"use client"
import AddDetails from "@/components/custom/onboarding/AddDetails.3"
import GetStarted from "@/components/custom/onboarding/GetStarted.1"
import PickSubscriptions from "@/components/custom/onboarding/PickSubscriptions.2"
import { useOnboardingStore } from "@/state/onboarding"
import { useEffect } from "react"

const pages = [<GetStarted key="page1" />, <PickSubscriptions key="page2" />, <AddDetails key="page3" />]

export default function Onboard() {
    const { activePage, setCurrencies } = useOnboardingStore()

    useEffect(() => {
        setCurrencies()
    }, [])

    return (
        <div className="flex mx-auto justify-center items-center flex-col gap-4 max-w-sm h-full">
            {pages[activePage]}
        </div>
    )
}
