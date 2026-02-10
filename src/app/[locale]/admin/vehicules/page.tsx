import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import { Plus, Eye, Edit, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default async function AdminVehiclesPage() {
  const t = await getTranslations("admin");

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      photos: { take: 1, orderBy: { sortOrder: "asc" } },
      _count: { select: { leadRequests: true } },
    },
  });

  const statusStyles: Record<string, { label: string; color: string }> = {
    DRAFT: { label: t("draft"), color: "bg-gray-100 text-gray-800" },
    PUBLISHED: { label: t("published"), color: "bg-green-100 text-green-800" },
    SUSPENDED: { label: t("suspended"), color: "bg-yellow-100 text-yellow-800" },
    UNAVAILABLE: {
      label: t("unavailable"),
      color: "bg-red-100 text-red-800",
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("vehicleList")}
        </h1>
        <Link
          href="/admin/vehicules/nouveau"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("newVehicle")}
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("publicPrice")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("supplierPrice")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("margin")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Demandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => {
                const status = statusStyles[vehicle.status];
                const margin = vehicle.pricePublic - vehicle.priceSupplier;
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {vehicle.photos[0] && (
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={vehicle.photos[0].url}
                              alt={vehicle.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {vehicle.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {vehicle.brand} {vehicle.model} {vehicle.year}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.type === "SALE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {vehicle.type === "SALE" ? "Vente" : "Location"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(vehicle.pricePublic)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatPrice(vehicle.priceSupplier)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-700">
                      {formatPrice(margin)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}
                      >
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle._count.leadRequests}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vehicule/${vehicle.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/vehicules/${vehicle.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
