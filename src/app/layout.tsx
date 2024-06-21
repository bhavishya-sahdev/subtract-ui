import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { fetchAllCurrencies } from "@/lib/serverUtils"
import { UserStoreProvider } from "@/state/context/UserContext"
import { headers } from "next/headers"
import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { fetchUserDetails, fetchUserPayments } from "@/lib/utils"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Subtract - Tracking your subscriptions made easy",
    description: "Subtract the headache of manually tracking your subscriptions.",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // fetch user details once in the root layout
    const { data: user } = await fetchUserDetails()
    const { data: payments } = await fetchUserPayments()
    const { data: currencies } = await fetchAllCurrencies()

    const headersList = headers()
    const header_url = headersList.get("x-url") || ""

    if (user === null) {
        // redirect to homepage when trying to access protected pages when not logged in
        if (header_url.startsWith("/dashboard") || header_url.startsWith("/onboarding")) redirect(routes.DEFAULT)
    } else {
        // redirect to dashboard while accessing auth pages when logged in
        if (header_url.startsWith("/signin") || header_url.startsWith("/signup")) redirect(routes.dashboard.DEFAULT)

        // redirect to onboarding from dashboard if onboarding hasn't been completed
        if (header_url.startsWith("/dashboard") && user.isOnboardingComplete === false)
            redirect(routes.dashboard.onboarding)

        // redirect to dashboard from onboarding if the onboarding process is complete
        if (user.isOnboardingComplete && header_url.startsWith("/onboarding")) redirect(routes.dashboard.DEFAULT)
    }

    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <SpeedInsights />
                <GoogleOAuthProvider clientId="1072052271469-1bhh7lq5vla9atblmpe5kir8l9j4kc8o.apps.googleusercontent.com">
                    <UserStoreProvider
                        user={user ? user : null}
                        subscriptions={user ? user.subscriptions : []}
                        payments={payments || []}
                        currencies={currencies || []}
                    >
                        {children}
                    </UserStoreProvider>
                </GoogleOAuthProvider>
                <Toaster />
            </body>
        </html>
    )
}
