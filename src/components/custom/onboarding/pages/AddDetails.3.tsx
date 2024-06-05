"use client"

import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button, useToast } from "@/components/ui"

import AddNewTopBar from "../AddNewTopBar"
import DetailsForm from "../DetailsForm"
import { createSubscriptionsWithPayments, generatePayments, updateUserOnboardingStatus } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { useUserStore } from "@/state/context/UserContext"
import { TOnboardingForm } from "@/state/onboarding"
import { routes } from "@/lib/routes"
import { TServerError } from "@/lib/types"

export type TAddDetailsProps = {
    fieldArray: ReturnType<typeof useFieldArray<TOnboardingForm>>
}

export default function AddDetails({ fieldArray }: TAddDetailsProps) {
    const { selectedServiceId, setActivePage } = useOnboardingStore((state) => state)
    const { setUser, user } = useUserStore((state) => state)
    const { toast } = useToast()
    const { getValues } = useFormContext<TOnboardingForm>()
    const { fields } = fieldArray
    const { push } = useRouter()

    const {
        handleSubmit,
        formState: { errors },
    } = useFormContext<TOnboardingForm>()

    const [inProgress, setInProgress] = useState(false)

    const collectPayments = () => {
        const { subscriptions } = getValues()
        return subscriptions.map((subscription) => {
            return generatePayments({
                creationDate: subscription.creationDate,
                renewalPeriodEnum: subscription.renewalPeriodEnum,
                amount: subscription.renewalAmount,
                currencyId: subscription.currencyId,
                renewalPeriodDays: subscription.renewalPeriodDays,
            })
        })
    }

    async function onSubmit(data: TOnboardingForm) {
        try {
            setInProgress(true)
            const res = await createSubscriptionsWithPayments({
                subscriptions: data.subscriptions,
                payments: collectPayments(),
            })

            if (res.data !== null) {
                toast({ title: "Subscriptions created successfully" })
                const onboardingStatusRes = await updateUserOnboardingStatus()
                if (onboardingStatusRes.data !== null) {
                    if (user) setUser({ ...user, isOnboardingComplete: true })
                    push(routes.dashboard.overview)
                }
            } else {
                // handle backend zod errors on fields
                const zodErrors = res.error
                if ("message" in res.error) {
                    toast({
                        variant: "destructive",
                        title: (zodErrors as TServerError).message,
                    })
                } else {
                    // (zodErrors as z.ZodIssue[]).forEach((error) => {
                    //     setError(error.path[0], { message: error.message })
                    // })
                    // console.log(res.data)
                }
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "An unknown error occured.",
                description: "Please try again in a bit!",
            })
        }
        setInProgress(false)
    }

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
                        <Button className="mt-4" disabled={inProgress}>
                            {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save all and proceed
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
