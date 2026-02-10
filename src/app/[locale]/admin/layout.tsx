import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/fr/login");
  }

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "AGENT"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/fr");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <AdminSidebar user={session.user} />
      <div className="flex-1 bg-gray-50 p-6 lg:p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
