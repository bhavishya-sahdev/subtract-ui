"use client"

import Parent from "@/components/custom/onboarding/pages/Parent"
import { Form } from "@/components/ui"
import { OnboardingStoreProvider } from "@/state/context/OnboardingContext"
import { SubscriptionFormSchema, TSubscription } from "@/state/onboarding"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Onboard() {
    const { watch, ...form } = useForm<{ subscriptions: TSubscription[] }>({
        resolver: zodResolver(z.object({ subscriptions: SubscriptionFormSchema.array() })),
        mode: "onBlur",
        shouldUnregister: false,
    })

    return (
        <Form watch={watch} {...form}>
            <OnboardingStoreProvider>
                <Parent />
            </OnboardingStoreProvider>
        </Form>
    )
}
