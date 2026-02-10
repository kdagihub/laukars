import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { BarChart3, ScrollText, ArrowLeft } from "lucide-react";

export default async function AssociatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/fr/login");
  }

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ASSOCIATE"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/fr");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-6">
          <Link href="/" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Espace Associés</h1>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/associes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/associes/audit-log"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ScrollText className="h-4 w-4" />
              Journal d&apos;audit
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
