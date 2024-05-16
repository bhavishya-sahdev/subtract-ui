import DashboardNav from "@/components/custom/DashboardNav";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </>
  );
}
