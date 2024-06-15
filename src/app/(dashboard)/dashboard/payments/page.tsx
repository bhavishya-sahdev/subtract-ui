"use client"

import PaymentsTable from "@/components/custom/dashboard/PaymentsTable"
import { useUserStore } from "@/state/context/UserContext"

export default function Payments() {
    const payments = useUserStore((state) => state.payments)

    return (
        <div className="py-4">
            <PaymentsTable payments={payments} />
        </div>
    )
}
