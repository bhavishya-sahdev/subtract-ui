import { Outlet } from "@remix-run/react";
import MainNav from "~/components/custom/MainNav";

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

export default Dashboard;
