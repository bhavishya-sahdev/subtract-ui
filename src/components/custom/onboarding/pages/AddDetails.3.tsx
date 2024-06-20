"use client"

import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, useToast } from "@/components/ui"

import AddNewTopBar from "../AddNewSidebar"
import DetailsForm from "../DetailsForm"
import { createSubscriptionsWithPayments, generatePayments, updateUserOnboardingStatus } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { useUserStore } from "@/state/context/UserContext"
import { TOnboardingForm } from "@/state/onboarding"
import { routes } from "@/lib/routes"
import { TServerError } from "@/lib/types"
import { client } from "@/lib/axiosClient"
import api from "@/lib/api"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useGoogleLogin } from "@react-oauth/google"

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

    const { handleSubmit } = useFormContext<TOnboardingForm>()

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (res) => {
            await client.post(api.auth.google, {
                code: res.code,
            })
            proceedWithSync()
        },
        flow: "auth-code",
        scope: "email profile https://www.googleapis.com/auth/gmail.readonly",
    })

    const [inProgress, setInProgress] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

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

    const handleSyncWithEmail = async () => {
        try {
            const res = await client.get(api.user.mailAccess)
            if (res.data.error !== null) {
                if ("code" in res.data.error && res.data.error.code === "G-403") {
                    setOpenDialog(true)
                }
                return
            }
            proceedWithSync()
        } catch (e: any) {
            console.error(e)
        }
    }

    const proceedWithSync = async () => {
        try {
            const res = await client.get(api.user.readMails)
            console.log(res.data)
        } catch (e: any) {
            console.error(e)
        }
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
            <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,100%)] items-start gap-4 md:gap-8">
                <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-2 justify-start w-max"
                    onClick={() => setActivePage(1)}
                >
                    <ArrowLeft size="20" />
                    <span>Go Back</span>
                </Button>
                <div>
                    <p className="text-2xl">Add details</p>
                    <p className="text-muted-foreground">This is where the magic happens.</p>
                </div>

                <AddNewTopBar fieldArray={fieldArray} handleSyncWithEmail={handleSyncWithEmail} />

                <div>
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
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Additional permission required</DialogTitle>
                        <DialogDescription>
                            To sync your email with your subscriptions, we need additional permissions. Please click the
                            button below to proceed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button size="sm" variant="ghost" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                handleGoogleAuth()
                                setOpenDialog(false)
                            }}
                        >
                            Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
