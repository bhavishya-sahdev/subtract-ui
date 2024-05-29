import { handleLogout } from "@/lib/serverUtils"
import { useUserStore } from "@/state/context/UserContext"

import React from "react"

type TLogoutButtonProps<T extends keyof JSX.IntrinsicElements | React.ComponentType<any>> = {
    as?: T
} & (T extends React.ComponentType<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : never)

const LogoutButton = <T extends keyof JSX.IntrinsicElements | React.ComponentType<any>>({
    as: Component = "button",
    onClick,
    children,
    ...props
}: TLogoutButtonProps<T>) => {
    const setUser = useUserStore((store) => store.setUser)
    return (
        <Component
            {...props}
            onClick={() => {
                setUser(null)
                handleLogout()
            }}
        >
            {children ? children : "Logout"}
        </Component>
    )
}

export default LogoutButton
