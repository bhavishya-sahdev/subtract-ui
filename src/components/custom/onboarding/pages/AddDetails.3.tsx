"use client"

import { Button, Form, useToast } from "@/components/ui"
import { useEffect, useState } from "react"
import { TOnboardingForm } from "@/state/onboarding"
import { useFieldArray, useFormContext } from "react-hook-form"

import { ArrowLeft } from "lucide-react"
import AddNewTopBar from "../AddNewTopBar"
import DetailsForm from "../DetailsForm"
import { initiateNewSubscription } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { client } from "@/lib/axiosClient"
import api from "@/lib/api"

export type TAddDetailsProps = {
    fieldArray: ReturnType<typeof useFieldArray<TOnboardingForm>>
}

export default function AddDetails({ fieldArray }: TAddDetailsProps) {
    const { selectedServiceId, setActivePage } = useOnboardingStore((state) => state)
    const { toast } = useToast()
    const { fields, append } = fieldArray

    const { handleSubmit } = useFormContext<TOnboardingForm>()

    const [inProgress, setInProgress] = useState(false)

    async function onSubmit(data: TOnboardingForm) {
        try {
            setInProgress(true)
            const res = await client.post(api.subscription.create, data.subscriptions)
            if (res.data !== null) toast({ title: "Subscriptions created successfully" })
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "An unknown error occured.",
                description: "Please try again in a bit!",
            })
        }
        setInProgress(false)
    }

    // if no subscriptions
    useEffect(() => {
        if (fields.length === 0) {
            append(initiateNewSubscription())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields])

    return (
        <div>
            <Button variant="ghost" size="sm" className="space-x-2 mb-2" onClick={() => setActivePage(1)}>
                <ArrowLeft size="20" />
                <span>Go Back</span>
            </Button>

            <div className="grid grid-cols-[max-content_minmax(0,100%)] items-start gap-8">
                <div className="justify-self-end">
                    <AddNewTopBar fieldArray={fieldArray} />
                </div>

                <div>
                    <p className="text-2xl">Add details</p>
                    <p className="pb-4 text-muted-foreground">This is where the magic happens.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((item, idx) => {
                            return <DetailsForm key={item.id} active={item.uuid === selectedServiceId} index={idx} />
                        })}

                        {/* show auto generated previous payments */}
                        <Button className="mt-4">Add or Next or Finish</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
