import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <div className="h-full flex items-center justify-center">
      <Outlet />
    </div>
  );
}
