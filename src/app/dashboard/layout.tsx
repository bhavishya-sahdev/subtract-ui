import DashboardNav from "@/components/custom/DashboardNav";
import { fetchUserDetails } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = await fetchUserDetails();

  if (user.error !== null) redirect("/");

  return (
    <>
      <DashboardNav user={user.data} />
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </>
  );
}
