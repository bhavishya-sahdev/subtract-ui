"use client"

import PaymentsTable from "@/components/custom/dashboard/PaymentsTableForPaymentsPage"
import { Button, Input } from "@/components/ui"

export default function Payments() {
    return (
        <div className="py-4 space-y-4">
            <div className="flex gap-1 justify-end w-1/2">
                <Button variant="outline">Add New</Button>
            </div>
            <PaymentsTable />
        </div>
    )
}
