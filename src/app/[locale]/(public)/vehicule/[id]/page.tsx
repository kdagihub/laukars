import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { VehicleDetailShowcase } from "@/components/catalogue/vehicle-detail-showcase";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id, status: "PUBLISHED" },
  });
  if (!vehicle) return { title: "Véhicule introuvable" };

  return {
    title: vehicle.title,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${formatPrice(vehicle.pricePublic)} - ${vehicle.city}`,
    openGraph: {
      title: vehicle.title,
      description: `${vehicle.brand} ${vehicle.model} ${vehicle.year} à ${vehicle.city}`,
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      rentalPolicy: true,
    },
  });

  if (!vehicle) notFound();

  await prisma.vehicle.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  const otherVehicles = await prisma.vehicle.findMany({
    where: { status: "PUBLISHED", id: { not: id } },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      rentalPolicy: true,
    },
  });

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <VehicleDetailShowcase
      vehicle={vehicle}
      otherVehicles={otherVehicles}
      whatsappNumber={whatsappNumber}
      fuelLabels={{
        gasoline: t("vehicle.gasoline"),
        diesel: t("vehicle.diesel"),
        electric: t("vehicle.electric"),
        hybrid: t("vehicle.hybrid"),
        lpg: t("vehicle.lpg"),
      }}
      transLabels={{
        manual: t("vehicle.manual"),
        automatic: t("vehicle.automatic"),
      }}
      translations={{
        perDay: t("catalogue.perDay"),
        priceLabel: t("vehicle.price"),
        pricePerDay: t("vehicle.pricePerDay"),
        pricePerWeek: t("vehicle.pricePerWeek"),
        pricePerMonth: t("vehicle.pricePerMonth"),
        depositAmount: t("vehicle.depositAmount"),
        kmIncluded: t("vehicle.kmIncluded"),
        otherVehicles: t("catalogue.otherVehicles"),
        typeSale: t("catalogue.typeSale"),
        typeRent: t("catalogue.typeRent"),
        year: t("vehicle.year"),
        mileage: t("vehicle.mileage"),
        fuel: t("vehicle.fuel"),
        transmission: t("vehicle.transmission"),
        city: t("vehicle.city"),
        km: t("vehicle.km"),
        specifications: t("vehicle.specifications"),
        description: t("vehicle.description"),
        rentalPolicy: t("vehicle.rentalPolicy"),
        codeAdvantage: t("vehicle.codeAdvantage"),
        codeAdvantageDesc: t("vehicle.codeAdvantageDesc"),
        contactWhatsapp: t("vehicle.contactWhatsapp"),
        orderBuy: t("vehicle.orderBuy"),
        orderRent: t("vehicle.orderRent"),
        share: t("common.share") || "Partager",
        backToCatalogue: t("catalogue.backToCatalogue"),
      }}
      leadLabels={{
        formTitle: t("lead.formTitle"),
        name: t("lead.name"),
        phone: t("lead.phone"),
        city: t("lead.city"),
        message: t("lead.message"),
        consent: t("lead.consent"),
      }}
    />
  );
}
