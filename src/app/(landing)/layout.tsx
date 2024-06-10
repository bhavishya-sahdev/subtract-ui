import LandingNav from "@/components/custom/landing/Nav"
import { Menu } from "lucide-react"

export default async function LandingLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <div className="h-[60px] flex items-center p-4 justify-between bg-[#19191C]">
                <h2 className="text-lg font-bold">Subtract</h2>
                <div>
                    <Menu />
                </div>
            </div>
            {children}
        </div>
    )
}
