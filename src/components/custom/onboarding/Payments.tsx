import { TRenewalPeriodEnum } from "@/state/onboarding"
import PaymentCard from "./PaymentCard"

export type TPaymentProps = {
    renewalPeriodDays: number | undefined
    renewalPeriodEnum: TRenewalPeriodEnum
    creationDate: Date
}

export default function Payments({ ...props }: TPaymentProps) {
    const renderCards = () => {}

    return (
        <>
            <p>Payments</p>
            <div className="flex gap-4 overflow-auto pr-10">
                <PaymentCard variant="upcoming" /> <PaymentCard variant="pending" /> <PaymentCard />
                <PaymentCard />
                <PaymentCard />
            </div>
        </>
    )
}
