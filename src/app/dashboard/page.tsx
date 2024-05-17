import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

export default function Dashboard() {
    redirect(routes.dashboard.overview)
}
