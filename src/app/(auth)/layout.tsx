import LandingNav from "@/components/custom/landing/Nav"

export default async function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col">
            <LandingNav />

            <div className="h-full w-full flex md:items-center justify-center bg-gradient-to-b from-[#19191C] to-[#24242B]">
                {children}
            </div>
        </div>
    )
}
