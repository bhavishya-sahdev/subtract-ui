"use client"

import Parent from "@/components/custom/onboarding/pages/Parent"
import { OnboardingStoreProvider } from "@/state/context/OnboardingContext"
import { SubscriptionFormSchema, TSubscription } from "@/state/onboarding"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

export default function Onboard() {
    const { watch, ...form } = useForm<{ subscriptions: TSubscription[] }>({
        resolver: zodResolver(z.object({ subscriptions: SubscriptionFormSchema.array() })),
        mode: "onBlur",
        shouldUnregister: false,
    })

    return (
        <FormProvider watch={watch} {...form}>
            <OnboardingStoreProvider>
                <Parent fieldArray={fieldArray} />
            </OnboardingStoreProvider>
        </FormProvider>
    )
}
