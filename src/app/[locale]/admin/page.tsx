import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Car, ClipboardList, CalendarDays, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const t = await getTranslations("admin");
  const session = await auth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    activeVehicles,
    newLeads,
    todayAppointments,
    totalSold,
    recentLeads,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: "PUBLISHED" } }),
    prisma.leadRequest.count({ where: { status: "NEW" } }),
    prisma.appointment.count({
      where: {
        scheduledAt: { gte: today, lt: tomorrow },
      },
    }),
    prisma.leadRequest.findMany({
      where: { status: "SOLD" },
      select: { margin: true },
    }),
    prisma.leadRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        vehicle: { select: { title: true, brand: true, model: true } },
      },
    }),
  ]);

  const totalMargin = totalSold.reduce((sum, l) => sum + (l.margin || 0), 0);

  const stats = [
    {
      label: t("activeVehicles"),
      value: activeVehicles,
      icon: Car,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: t("newLeads"),
      value: newLeads,
      icon: ClipboardList,
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: t("todayAppointments"),
      value: todayAppointments,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: t("margin"),
      value: formatPrice(totalMargin),
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
  ];

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    APPOINTMENT_SET: "bg-purple-100 text-purple-800",
    VISIT_DONE: "bg-indigo-100 text-indigo-800",
    SOLD: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELED: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      <p className="text-gray-500 mt-1">
        Bienvenue, {session?.user?.name}
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Demandes récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
                  Code A
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
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
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[lead.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">
                    {lead.codeA}
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
