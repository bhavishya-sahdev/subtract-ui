"use client"

import { handleLogout } from "@/lib/serverUtils"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
    return (
        <DropdownMenuItem onClick={() => handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
        </DropdownMenuItem>
    )
}
