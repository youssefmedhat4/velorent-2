import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B2540]">
      <AdminSidebar />
      {/* pt-14 on mobile to clear the fixed top bar; lg:pt-0 because sidebar is visible */}
      <main className="flex-1 overflow-y-auto min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
