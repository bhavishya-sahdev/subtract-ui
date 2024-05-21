import { handleLogout } from "@/lib/serverUtils"

import React from "react"

type TLogoutButtonProps<
    T extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = {
    as?: T
} & (T extends React.ComponentType<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : never)

const LogoutButton = <
    T extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>({
    as: Component = "button",
    onClick,
    children,
    ...props
}: TLogoutButtonProps<T>) => {
    return (
        <Component {...props} onClick={() => handleLogout()}>
            {children ? children : "Logout"}
        </Component>
    )
}

export default LogoutButton
