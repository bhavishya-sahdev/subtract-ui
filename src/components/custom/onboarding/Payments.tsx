import PaymentCard from "./PaymentCard"
import { PaymentObject } from "@/lib/utils"

export default function Payments({ payments }: { payments: PaymentObject[] }) {
    return (
        <>
            <p>Payments</p>
            <div className="flex gap-4 overflow-auto pr-10 scrollbar-hide">
                {payments.map((payment, idx) => (
                    <PaymentCard key={idx} {...payment} />
                ))}
            </div>
            <p className="text-sm text-muted-foreground">You can modify your payments later on</p>
        </>
    )
}
