import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/catalogue/vehicle-card";
import { CatalogueFilters } from "@/components/catalogue/catalogue-filters";
import type { VehicleType, FuelType, TransmissionType } from "@prisma/client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("catalogue");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

type SearchParams = Promise<{
  type?: string;
  brand?: string;
  city?: string;
  fuel?: string;
  transmission?: string;
  priceMin?: string;
  priceMax?: string;
  year?: string;
  sort?: string;
  page?: string;
}>;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("catalogue");
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const perPage = 12;

  // Build Prisma where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "PUBLISHED",
  };

  if (params.type && params.type !== "all") {
    where.type = params.type as VehicleType;
  }
  if (params.brand && params.brand !== "all") {
    where.brand = params.brand;
  }
  if (params.city && params.city !== "all") {
    where.city = params.city;
  }
  if (params.fuel && params.fuel !== "all") {
    where.fuel = params.fuel as FuelType;
  }
  if (params.transmission && params.transmission !== "all") {
    where.transmission = params.transmission as TransmissionType;
  }
  if (params.priceMin) {
    where.pricePublic = { ...where.pricePublic, gte: parseInt(params.priceMin) };
  }
  if (params.priceMax) {
    where.pricePublic = { ...where.pricePublic, lte: parseInt(params.priceMax) };
  }
  if (params.year) {
    where.year = { gte: parseInt(params.year) };
  }

  // Build order by
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (params.sort === "price_asc") orderBy = { pricePublic: "asc" };
  if (params.sort === "price_desc") orderBy = { pricePublic: "desc" };
  if (params.sort === "popular") orderBy = { viewCount: "desc" };

  const [vehicles, totalCount, brands, cities] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        photos: { orderBy: { sortOrder: "asc" }, take: 1 },
        rentalPolicy: true,
      },
    }),
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where: { status: "PUBLISHED" },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { status: "PUBLISHED" },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-2 text-gray-600">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <CatalogueFilters
              brands={brands.map((b) => b.brand)}
              cities={cities.map((c) => c.city)}
              currentFilters={params}
            />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Count & Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {t("vehicleCount", { count: totalCount })}
              </p>
            </div>

            {/* Grid */}
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">{t("vehicleCount", { count: 0 })}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <a
                      key={p}
                      href={`?${new URLSearchParams({ ...params, page: p.toString() }).toString()}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        p === page
                          ? "bg-blue-900 text-white"
                          : "bg-white text-gray-700 border hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
