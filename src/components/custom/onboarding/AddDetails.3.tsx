"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useState } from "react"
import { useOnboardingStore } from "@/state/onboarding"
import { streamingServices } from "@/state/staticData"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { client } from "@/lib/axiosClient"
import api from "@/lib/api"
import { routes } from "@/lib/routes"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"

import currencies from "@/lib/currencies.json"
import { Minus, Plus } from "lucide-react"

const renewalPeriodEnum = z.enum(["annually", "monthly", "weekly", "custom"])

const FormSchema = z.object({
    name: z.string(),
    subscribedOn: z.date().optional(),
    currencyId: z.string(),
    renewalAmount: z.number().nonnegative(),
    renewalPeriodEnum: renewalPeriodEnum.default("monthly"),
    renewalPeriodDays: z.number().gt(1).default(1).optional(),
})

export default function AddDetails() {
    const { setActivePage, selectedServices, createdSubscriptions } = useOnboardingStore()

    const { toast } = useToast()
    const { push } = useRouter()

    const { watch, ...form } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: createdSubscriptions[0].name,
            subscribedOn: createdSubscriptions[0].subscribedOn,
            renewalPeriodDays: 1,
        },
    })
    const watchRenewalPeriodEnum = watch("renewalPeriodEnum")

    const [inProgress, setInProgress] = useState(false)

    const renderCurrencyText = useCallback((value: string) => {
        const c = currencies.find((c) => c.code === value)
        if (!c) return ""

        if (c.code === c.symbol) return c.code
        return `${c.code} (${c.symbol})`
    }, [])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setInProgress(true)

            const res = await client.post(api.auth.signup, data)

            if (res.data.error !== null) {
                if (typeof res.data.error != "string")
                    for (const field in FormSchema.shape) {
                        if (res.data.error[field])
                            form.setError(field as keyof typeof FormSchema.shape, {
                                message: res.data.error[field][0],
                            })
                    }
                else
                    toast({
                        title: res.data.error,
                    })
                setInProgress(false)
                /** if error, handle errors and return */
                return
            }
            push(routes.dashboard.overview)
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
            <Card className="box-border my-4">
                <CardContent className="py-2 px-4 grid gap-4 grid-cols-[max-content_2px_1fr] items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="rounded-full border-dashed border-2">
                                <Plus />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuItem>Create New</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setActivePage(1)}>Pick from list</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator orientation="vertical" />
                    <div className="flex overflow-auto gap-6 pt-1 pb-3">
                        {selectedServices.map((serviceValue) => {
                            const service = streamingServices.find((service) => service.value === serviceValue)

                            return service ? (
                                <div className="flex flex-col items-center gap-2 w-16" key={service.label}>
                                    <Avatar>
                                        <AvatarImage src={service.logoUrl} alt={service.label} />
                                        <AvatarFallback>{service.initials}</AvatarFallback>
                                    </Avatar>
                                    <Label className="line-clamp-1 w-20 text-center">{service.label}</Label>
                                </div>
                            ) : null
                        })}
                    </div>
                </CardContent>
            </Card>
            <p className="text-2xl pt-4">Add details</p>
            <p className="pb-4">This is where the magic happens.</p>
            <Form watch={watch} {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="block">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <FormLabel htmlFor="service_name">Service Name</FormLabel>
                                        <FormControl>
                                            <Input id="service_name" type="text" placeholder="Netflix" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subscribedOn"
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
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

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
                                    name="currencyId"
                                    render={({ field }) => (
                                        <FormItem className="w-[300px]">
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a currency">
                                                        {renderCurrencyText(field.value)}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map((currency) => (
                                                        <SelectItem value={currency.code} key={currency.code}>
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
                                    name="renewalAmount"
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
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        {/* add day counter for renewal period, show next renewal on `date` */}

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="subscription_charges">Renewal Period</Label>
                            <div className="flex gap-2" id="subscription_charges">
                                <FormField
                                    control={form.control}
                                    name="renewalPeriodEnum"
                                    render={({ field }) => (
                                        <FormItem className="w-[280px]">
                                            <FormControl>
                                                <Select onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select renewal period" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="annually">Annually</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="custom">Custom (weeks)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {watchRenewalPeriodEnum === "custom" && (
                                    <FormField
                                        control={form.control}
                                        name="renewalPeriodDays"
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
                                                                "renewalPeriodDays",
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
                                                                "renewalPeriodDays",
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
                        </div>
                    </div>
                </form>
            </Form>
            {/* show auto generated previous payments */}
            <div className="space-x-2">
                <Button className="mt-4" variant="destructive">
                    Remove
                </Button>
                <Button className="mt-4">Add or Next or Finish</Button>
            </div>
        </div>
    )
}
