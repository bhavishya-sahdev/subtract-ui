import LandingNav from "@/components/custom/landing/Nav"

export default async function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-full h-max flex flex-col">
            <LandingNav />

            <div className="h-full grow w-full flex md:items-center justify-center bg-gradient-to-b from-[#19191C] to-[#24242B]">
                <div className="w-full max-w-sm p-4">
                    <div className="border rounded p-4 border-zinc-700 mb-3">
                        <p className="text-muted-foreground">
                            The connection to the backend is still under development.
                        </p>
                        <p className="text-bold">Please try again later.</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
