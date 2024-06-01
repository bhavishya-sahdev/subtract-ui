import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { fetchUserDetails } from "@/lib/serverUtils"
import { UserStoreProvider } from "@/state/context/UserContext"
import { headers } from "next/headers"
import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"
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

    const headersList = headers()
    const header_url = headersList.get("x-url") || ""

    if (user === null) {
        if (header_url.startsWith("/dashboard/") || header_url.startsWith("/onboarding")) redirect(routes.DEFAULT)
    } else {
        if (header_url.startsWith("/signin") || header_url.startsWith("/signup")) redirect(routes.dashboard.DEFAULT)
        if (header_url.startsWith("/dashboard") && user.isOnboardingComplete === false)
            redirect(routes.dashboard.onboarding)
        if (user.isOnboardingComplete && header_url.startsWith("/onboarding")) redirect(routes.dashboard.DEFAULT)
    }

    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <UserStoreProvider user={user ? user : null}>{children}</UserStoreProvider>
                <Toaster />
            </body>
        </html>
    )
}
