import DashboardNav from "@/components/custom/DashboardNav"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#19191C] to-[#24242B]">
            <DashboardNav />
            <main className="px-8 flex flex-col justify-between h-full  overflow-y-auto">{children}</main>
            <footer className="p-2">
                <p className="text-center text-muted-foreground text-xs">&copy; 2024 Subtract. All Rights Reserved</p>
            </footer>
        </div>
    )
}
