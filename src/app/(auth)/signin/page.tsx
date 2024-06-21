"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { client } from "@/lib/axiosClient"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/lib/api"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchUserDetails, fetchUserPayments } from "@/lib/utils"
import { useUserStore } from "@/state/context/UserContext"
import { Separator } from "@/components/ui"
import { useGoogleLogin } from "@react-oauth/google"

const FormSchema = z.object({
    email: z.string(),
    password: z.string(),
})
export default function LoginForm() {
    const { toast } = useToast()
    const { push } = useRouter()
    const setUser = useUserStore((state) => state.setUser)
    const setSubsciptions = useUserStore((state) => state.setSubscriptions)
    const setPayments = useUserStore((state) => state.setPayments)
    const user = useUserStore((state) => state.user)

    useEffect(() => {
        // if user is already logged in, redirect to dashboard
        if (user) {
            // eslint-disable-next-line no-extra-semi
            ;(async () => {
                const { data: payments } = await fetchUserPayments()
                if (payments) setPayments(payments)
                if (user.subscriptions) setSubsciptions(user.subscriptions)
                push(user.isOnboardingComplete ? routes.dashboard.overview : routes.dashboard.onboarding)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    // initialize form
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })

    const [inProgress, setInProgress] = useState(false)

    const handleGoogleSignup = useGoogleLogin({
        onSuccess: async (res) => {
            const { data } = await client.post(api.auth.google, {
                code: res.code,
            })

            if (data.error !== null) return push(routes.DEFAULT)

            const user = await fetchUserDetails()
            setUser(user.data)
        },
        flow: "auth-code",
        scope: "email profile",
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setInProgress(true)

            const res = await client.post(api.auth.signin, data)

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

            // set user data in context
            const user = await fetchUserDetails()

            // if fails show error and don't redirect
            if (user.data) setUser(user.data)
            else return toast({ title: "Failed to get user details", description: "Please try again later" })
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
        <div className="w-full max-w-sm p-4">
            <p className="text-3xl font-semibold mb-1">Login</p>
            <p className="mb-8 text-muted-foreground">Enter your email below to login to your account.</p>

            <Button className="w-full mb-4" variant="secondary" onClick={handleGoogleSignup}>
                Continue with Google
            </Button>

            <div className="text-center text-muted-foreground flex items-center gap-2 my-4">
                <Separator className="bg-muted-foreground shrink" />
                <span>OR</span>
                <Separator className="bg-muted-foreground shrink" />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="block">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={inProgress}>
                        {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign in
                    </Button>
                </form>
            </Form>
            <div className="mx-auto mt-2 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href={routes.auth.signup} className="underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
