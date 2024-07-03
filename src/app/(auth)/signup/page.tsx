"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { routes } from "@/lib/routes"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { client } from "@/lib/axiosClient"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/state/context/UserContext"
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Separator,
    useToast,
} from "@/components/ui"
import { useGoogleLogin } from "@react-oauth/google"
import { fetchUserDetails } from "@/lib/serverUtils"

const FormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, "Should be atleast 8 characters"),
})

export default function SignupForm() {
    const { toast } = useToast()
    const { push } = useRouter()
    const setUser = useUserStore((state) => state.setUser)
    const user = useUserStore((state) => state.user)

    useEffect(() => {
        // if user is already logged in, redirect to dashboard
        if (user) push(user.isOnboardingComplete ? routes.dashboard.overview : routes.dashboard.onboarding)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

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

            // set user data in context
            const user = await fetchUserDetails()

            // if fails show error and don't redirect
            if (user.data) setUser(user.data)
            else toast({ title: "Failed to get user details", description: "Please try again later" })
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
        <>
            <p className="text-3xl font-semibold mb-1">Sign up for Subtract</p>
            <p className="mb-8 text-muted-foreground">Get an account going in seconds!</p>
            <div className="space-y-2">
                <Button className="w-full" variant="secondary" onClick={handleGoogleSignup}>
                    Continue with Google
                </Button>
                <p className="text-muted-foreground text-xs text-center">
                    Required if you want to sync your subscriptions
                </p>
            </div>

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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Max Dwayne" {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button type="submit" className="w-full mt-4" disabled={inProgress}>
                            {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create an account
                        </Button>
                    </div>
                    <div className="mx-auto mt-2 text-center text-sm text-muted-foreground">
                        By signing up you agree to the{" "}
                        <Link href={routes.documents.privacyPolicy} className="underline">
                            Privacy Policy
                        </Link>
                    </div>
                    <div className="mx-auto mt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href={routes.auth.login} className="underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}
