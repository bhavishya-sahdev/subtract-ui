import DashboardNav from "@/components/custom/DashboardNav"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-full h-max flex flex-col bg-gradient-to-b from-[#19191C] to-[#24242B]">
            <DashboardNav />
            <div className="px-8 flex flex-col justify-between w-full max-w-screen-lg mx-auto overflow-y-auto">
                {children}
                <footer className="p-2">
                    <p className="text-center text-muted-foreground text-xs">
                        &copy; 2024 Subtract. All Rights Reserved
                    </p>
                </footer>
            </div>
        </div>
    )
}
