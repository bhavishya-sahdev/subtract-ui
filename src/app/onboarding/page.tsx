"use client"
import AddDetails from "@/components/custom/onboarding/AddDetails.3"
import GetStarted from "@/components/custom/onboarding/GetStarted.1"
import PickSubscriptions from "@/components/custom/onboarding/PickSubscriptions.2"
import { useState } from "react"

const pages = [<GetStarted />, <PickSubscriptions />, <AddDetails />]

export default function Onboard() {
    const [activePage, setActivePage] = useState(0)

    return (
        <div className="h-full flex mx-auto justify-center -mt-10 flex-col gap-4 max-w-sm">
            {pages[activePage]}
        </div>
    )
}
