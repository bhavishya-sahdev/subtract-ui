import { TPayment } from "@/state/onboarding"
import PaymentCard from "./PaymentCard"

export type TPaymentsProps = {
    payments: TPayment[]
}

export default function Payments({ payments }: TPaymentsProps) {
    if (!payments || payments.length === 0) return null
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
