import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { formatDateTime } from "@/lib/utils";
import { Eye } from "lucide-react";

export default async function AdminLeadsPage() {
  const t = await getTranslations("admin");

  const leads = await prisma.leadRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: { select: { title: true, brand: true, model: true } },
    },
  });

  const statusStyles: Record<string, { label: string; color: string }> = {
    NEW: { label: "Nouveau", color: "bg-blue-100 text-blue-800" },
    CONTACTED: { label: "Contacté", color: "bg-yellow-100 text-yellow-800" },
    APPOINTMENT_SET: { label: "RDV programmé", color: "bg-purple-100 text-purple-800" },
    VISIT_DONE: { label: "Visite faite", color: "bg-indigo-100 text-indigo-800" },
    SOLD: { label: "Vendu", color: "bg-green-100 text-green-800" },
    FAILED: { label: "Échec", color: "bg-red-100 text-red-800" },
    CANCELED: { label: "Annulé", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{t("leadList")}</h1>

      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code A
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => {
                const status = statusStyles[lead.status];
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-blue-700">
                      {lead.codeA}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.clientName}
                      </p>
                      <p className="text-xs text-gray-500">{lead.clientPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.vehicle.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.requestType === "BUY"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {lead.requestType === "BUY" ? "Achat" : "Location"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}
                      >
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDateTime(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/demandes/${lead.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 inline-flex"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune demande
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
