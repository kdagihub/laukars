import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { formatDateTime } from "@/lib/utils";
import { MapPin, Calendar, Eye } from "lucide-react";

export default async function AdminAppointmentsPage() {
  const t = await getTranslations("admin");

  const appointments = await prisma.appointment.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      leadRequest: {
        include: {
          vehicle: { select: { title: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{t("appointments")}</h1>

      <div className="mt-6 space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {apt.leadRequest.clientName}
                </p>
                <p className="text-sm text-gray-500">
                  {apt.leadRequest.vehicle.title}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Code A: {apt.leadRequest.codeA}
                </p>
              </div>
              <Link
                href={`/admin/demandes/${apt.leadRequestId}`}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {formatDateTime(apt.scheduledAt)}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                {apt.locationText}
              </div>
            </div>
            {apt.notes && (
              <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                {apt.notes}
              </p>
            )}
            <div className="mt-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  apt.leadRequest.status === "SOLD"
                    ? "bg-green-100 text-green-800"
                    : apt.leadRequest.status === "FAILED"
                    ? "bg-red-100 text-red-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {apt.leadRequest.status}
              </span>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucun rendez-vous</p>
        )}
      </div>
    </div>
  );
}
