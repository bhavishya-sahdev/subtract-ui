"use client"

import {
    Button,
    Calendar,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn, generatePayments } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { renewalPeriodEnum, TOnboardingForm, TPayment } from "@/state/onboarding"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { Minus, Plus } from "lucide-react"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import Payments from "./Payments"

export type TDetailsFormProps = {
    active: boolean
    index: number
}

export default function DetailsForm({ active = false, index }: TDetailsFormProps) {
    const { currencies, selectedServiceId } = useOnboardingStore((state) => state)

    const { watch, ...form } = useFormContext<TOnboardingForm>()

    const [payments, setPayments] = useState<TPayment[]>([])

    const watchRenewalPeriodEnum = watch(`subscriptions.${index}.renewalPeriodEnum`)
    const watchRenewalPeriodDays = watch(`subscriptions.${index}.renewalPeriodDays`)
    const watchCreationDate = watch(`subscriptions.${index}.creationDate`)
    const watchCurrencyId = watch(`subscriptions.${index}.currencyId`)
    const watchRenewalAmount = watch(`subscriptions.${index}.renewalAmount`)

    const renderCurrencyText = useCallback(
        (value: string) => {
            const c = currencies.find((c) => c.uuid === value)
            if (!c) return ""

            if (c.code === c.symbol) return c.code
            return `${c.code} (${c.symbol})`
        },
        [currencies]
    )

    useEffect(() => {
        if (watchCreationDate && watchRenewalPeriodEnum) {
            const createdPayments = generatePayments({
                creationDate: watchCreationDate,
                renewalPeriodEnum: watchRenewalPeriodEnum,
                amount: watchRenewalAmount,
                currencyId: watchCurrencyId,
                renewalPeriodDays: watchRenewalPeriodDays,
            })
            setPayments(createdPayments)

            const totalCost = createdPayments
                .map((p) => parseFloat(p.amount as unknown as string) || 0)
                .reduce((acc = 0, v) => acc + v)

            form.setValue(`subscriptions.${index}.totalCost`, totalCost)
            form.setValue(`subscriptions.${index}.upcomingPaymentDate`, createdPayments[0].date)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchRenewalPeriodDays, watchRenewalPeriodEnum, watchCreationDate, watchRenewalAmount, watchCurrencyId])

    if (selectedServiceId === null) return
    if (!active) return

    return (
        <div>
            <div className="space-y-4">
                {/* name */}
                <FormField
                    control={form.control}
                    name={`subscriptions.${index}.name`}
                    render={({ field }) => (
                        <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                            <FormLabel htmlFor="service_name">Service Name</FormLabel>
                            <FormControl>
                                <Input id="service_name" type="text" placeholder="Netflix" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* subscribed on */}
                <FormField
                    control={form.control}
                    name={`subscriptions.${index}.creationDate`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <FormLabel htmlFor="subscription_created_date">Subscribed On</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                id="subscription_created_date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(v) => {
                                                field.onChange(v)
                                            }}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {/* <FormDescription>Your next payment is on {getNextPaymentDate()}</FormDescription> */}
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="currency">Subscription Charges</Label>
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name={`subscriptions.${index}.currencyId`}
                            render={({ field }) => (
                                <FormItem className="w-[300px]">
                                    <Select
                                        value={field.value}
                                        onValueChange={(v) => {
                                            field.onChange(v)
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a currency">
                                                    {renderCurrencyText(field.value!)}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currencies.map((currency) => (
                                                <SelectItem value={currency.uuid} key={currency.code}>
                                                    {currency.name} ({currency.symbol})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`subscriptions.${index}.renewalAmount`}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            id="renewalAmount"
                                            placeholder="120.00"
                                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormDescription>How much do you pay per billing cycle?</FormDescription>
                </div>
                {/* add day counter for renewal period, show next renewal on `date` */}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="subscription_charges">Renewal Period</Label>
                    <div className="flex gap-2" id="subscription_charges">
                        <FormField
                            control={form.control}
                            name={`subscriptions.${index}.renewalPeriodEnum`}
                            render={({ field }) => (
                                <FormItem className="w-[280px]">
                                    <Select
                                        value={field.value}
                                        onValueChange={(v: z.infer<typeof renewalPeriodEnum>) => {
                                            field.onChange(v)
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select renewal period" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="annually">Annually</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="custom">Custom (weeks)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchRenewalPeriodEnum === "custom" && (
                            <FormField
                                control={form.control}
                                name={`subscriptions.${index}.renewalPeriodDays`}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="shrink-0"
                                                disabled={field.value != undefined && field.value <= 1}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    form.setValue(
                                                        `subscriptions.${index}.renewalPeriodDays`,
                                                        field.value ? field.value - 1 : 0
                                                    )
                                                }}
                                            >
                                                <Minus />
                                            </Button>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="30"
                                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    form.setValue(
                                                        `subscriptions.${index}.renewalPeriodDays`,
                                                        field.value ? field.value + 1 : 0
                                                    )
                                                }}
                                            >
                                                <Plus />
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <FormDescription>How long is the billing cycle?</FormDescription>
                </div>
            </div>
            <div className="my-4 space-y-2">
                <Payments payments={payments} />
            </div>
        </div>
    )
}
