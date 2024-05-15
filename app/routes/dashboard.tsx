import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import MainNav from "~/components/custom/MainNav";
import { routes } from "~/lib/routes";

const Dashboard = () => {
  return (
    <>
      <MainNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Outlet />
      </div>
    </>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  if (
    url.pathname === routes.dashboard.DEFAULT ||
    url.pathname === `${routes.dashboard.DEFAULT}/`
  ) {
    return redirect(routes.dashboard.overview);
  }
  return null;
}

export default Dashboard;
