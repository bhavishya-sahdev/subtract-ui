import DashboardNav from "@/components/custom/DashboardNav"

export default async function OnboardingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col">
            <DashboardNav />
            {children}
        </div>
    )
}
