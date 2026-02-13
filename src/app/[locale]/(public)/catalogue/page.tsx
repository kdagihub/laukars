import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CatalogueShowcase } from "@/components/catalogue/catalogue-showcase";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("catalogue");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function CataloguePage() {
  const [vehicles, brands] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        photos: { orderBy: { sortOrder: "asc" }, take: 1 },
        rentalPolicy: true,
        leadRequests: {
          where: {
            status: {
              in: ["NEW", "CONTACTED", "APPOINTMENT_SET", "VISIT_DONE"],
            },
          },
          select: { id: true },
          take: 1,
        },
      },
    }),
    prisma.vehicle.findMany({
      where: { status: "PUBLISHED" },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

  return (
    <CatalogueShowcase
      vehicles={vehicles}
      brands={brands.map((b) => b.brand)}
    />
  );
}
