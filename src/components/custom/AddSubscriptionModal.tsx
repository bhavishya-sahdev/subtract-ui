"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, ReactNode, useEffect } from "react"
import { addDays } from "date-fns"
import { createSubscriptionsWithPayments, generatePayments, updateUserOnboardingStatus } from "@/lib/utils"

import AddSubscriptionForm from "./AddSubscriptionForm"
import { Form, useToast } from "../ui"
import { SubscriptionFormSchema, TPayment, TSubscription } from "@/state/onboarding"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useUserStore } from "@/state/context/UserContext"
import { TServerError } from "@/lib/types"
import { fetchUserDetails, fetchUserPayments } from "@/lib/serverUtils"

type TAddSubscriptionModalProps = {
    children: ReactNode
}

const formDefaultValues: Omit<TSubscription, "uuid"> = {
    name: "",
    upcomingPaymentDate: addDays(new Date(), 30),
    creationDate: new Date(),
    renewalAmount: 0,
    currencyId: "",
    renewalPeriodEnum: "monthly",
    renewalPeriodDays: 1,
}

export default function AddSubscriptionModal({ children }: TAddSubscriptionModalProps) {
    const { setUser, setPayments, setSubscriptions } = useUserStore((state) => state)
    const { toast } = useToast()

    const [inProgress, setInProgress] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const form = useForm<Omit<TSubscription, "uuid">>({
        resolver: zodResolver(SubscriptionFormSchema.omit({ uuid: true })),
        defaultValues: formDefaultValues,
        mode: "onBlur",
        shouldUnregister: false,
    })
    const [formPayments, setFormPayments] = useState<TPayment[]>([])

    const watchRenewalPeriodEnum = form.watch(`renewalPeriodEnum`)
    const watchRenewalPeriodDays = form.watch(`renewalPeriodDays`)
    const watchCreationDate = form.watch(`creationDate`)
    const watchCurrencyId = form.watch(`currencyId`)
    const watchRenewalAmount = form.watch(`renewalAmount`)

    useEffect(() => {
        if (watchCreationDate && watchRenewalPeriodEnum) {
            const createdPayments = generatePayments({
                creationDate: watchCreationDate,
                renewalPeriodEnum: watchRenewalPeriodEnum,
                amount: watchRenewalAmount,
                currencyId: watchCurrencyId,
                renewalPeriodDays: watchRenewalPeriodDays,
            })
            setFormPayments(createdPayments)
            form.setValue(`upcomingPaymentDate`, createdPayments[0].date)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchRenewalPeriodDays, watchRenewalPeriodEnum, watchCreationDate, watchRenewalAmount, watchCurrencyId])

    useEffect(() => {
        console.log(form.formState.errors)
    }, [form.formState.errors])

    async function onSubmit(data: Omit<TSubscription, "uuid">) {
        try {
            setInProgress(true)
            const res = await createSubscriptionsWithPayments({
                subscriptions: [data],
                payments: [formPayments],
            })

            if (res.data !== null) {
                const onboardingStatusRes = await updateUserOnboardingStatus()
                const updatedUser = await fetchUserDetails()
                const payments = await fetchUserPayments()
                if (updatedUser.data === null || payments.data === null)
                    return toast({
                        title: "An error occured while fetching user details. Please try refreshing the page",
                    })

                toast({ title: "Subscription added" })
                if (onboardingStatusRes.data !== null) {
                    setUser(updatedUser.data)
                    setSubscriptions(updatedUser.data.subscriptions)
                    setPayments(payments.data)
                    form.reset(formDefaultValues)
                    setOpenDialog(false)
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
        <Dialog modal open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto overflow-x-hidden">
                <DialogHeader className="mb-4">
                    <DialogTitle>Add Subscription</DialogTitle>
                </DialogHeader>
                <div className="w-full">
                    <Form {...form}>
                        <form>
                            <AddSubscriptionForm />
                        </form>
                    </Form>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button onClick={form.handleSubmit(onSubmit)}>Add Subscription</Button>
                    <Button variant="secondary" onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
