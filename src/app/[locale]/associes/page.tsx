import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  Car,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export default async function AssociatesDashboard() {
  const [
    publishedVehicles,
    totalLeads,
    scheduledAppointments,
    soldLeads,
    failedLeads,
    allLeads,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: "PUBLISHED" } }),
    prisma.leadRequest.count(),
    prisma.appointment.count(),
    prisma.leadRequest.findMany({
      where: { status: "SOLD" },
      select: { margin: true, createdAt: true, closedAt: true },
    }),
    prisma.leadRequest.count({ where: { status: "FAILED" } }),
    prisma.leadRequest.findMany({
      select: {
        status: true,
        createdAt: true,
        contactedAt: true,
        appointmentAt: true,
        closedAt: true,
      },
    }),
  ]);

  const totalRevenue = soldLeads.reduce(
    (sum, l) => sum + (l.margin || 0),
    0
  );
  const conversionRate =
    totalLeads > 0
      ? ((soldLeads.length / totalLeads) * 100).toFixed(1)
      : "0";

  // Average delays calculation
  const contactDelays: number[] = [];
  const appointmentDelays: number[] = [];
  const closureDelays: number[] = [];

  allLeads.forEach((lead) => {
    if (lead.contactedAt) {
      contactDelays.push(
        (new Date(lead.contactedAt).getTime() - new Date(lead.createdAt).getTime()) / 3600000
      );
    }
    if (lead.appointmentAt && lead.contactedAt) {
      appointmentDelays.push(
        (new Date(lead.appointmentAt).getTime() - new Date(lead.contactedAt).getTime()) / 3600000
      );
    }
    if (lead.closedAt && lead.appointmentAt) {
      closureDelays.push(
        (new Date(lead.closedAt).getTime() - new Date(lead.appointmentAt).getTime()) / 3600000
      );
    }
  });

  const avg = (arr: number[]) =>
    arr.length > 0 ? (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1) : "—";

  // Chart data - leads by month
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleDateString("fr-FR", { month: "short" });
    const year = d.getFullYear();
    const monthStart = new Date(year, d.getMonth(), 1);
    const monthEnd = new Date(year, d.getMonth() + 1, 0);

    const leads = allLeads.filter((l) => {
      const created = new Date(l.createdAt);
      return created >= monthStart && created <= monthEnd;
    });

    const sold = leads.filter((l) => l.status === "SOLD").length;
    const failed = leads.filter((l) => l.status === "FAILED").length;

    return {
      name: month,
      demandes: leads.length,
      ventes: sold,
      echecs: failed,
    };
  });

  const stats = [
    {
      label: "Véhicules publiés",
      value: publishedVehicles,
      icon: Car,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Demandes reçues",
      value: totalLeads,
      icon: ClipboardList,
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "RDV programmés",
      value: scheduledAppointments,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Ventes clôturées",
      value: soldLeads.length,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Échecs",
      value: failedLeads,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Taux de conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Marge totale",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Délai moyen contact",
      value: `${avg(contactDelays)}h`,
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div>
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8">
        <DashboardCharts data={monthlyData} />
      </div>

      {/* Delays */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Demande → Contact</p>
          <p className="text-2xl font-bold text-gray-900">
            {avg(contactDelays)}h
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Contact → RDV</p>
          <p className="text-2xl font-bold text-gray-900">
            {avg(appointmentDelays)}h
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">RDV → Clôture</p>
          <p className="text-2xl font-bold text-gray-900">
            {avg(closureDelays)}h
          </p>
        </div>
      </div>
    </div>
  );
}
