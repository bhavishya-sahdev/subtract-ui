"use client"

import { Button } from "@/components/ui/button"
import { handleLogout } from "@/lib/serverUtils"

export default function LogoutButton() {
    return (
        <Button
            variant="ghost"
            onClick={() => handleLogout()}
            className="text-sm font-medium transition-colors hover:text-primary hover:bg-orange-400/30"
        >
            Log out
        </Button>
    )
}
