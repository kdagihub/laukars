import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { VehicleGallery } from "@/components/catalogue/vehicle-gallery";
import { LeadRequestForm } from "@/components/catalogue/lead-request-form";
import { ShareButtons } from "@/components/catalogue/share-buttons";
import {
  Calendar,
  Gauge,
  Fuel,
  Cog,
  MapPin,
  Ticket,
  MessageCircle,
} from "lucide-react";
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

  // Increment view count
  await prisma.vehicle.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  const isRent = vehicle.type === "RENT";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par ${vehicle.title} (${vehicle.brand} ${vehicle.model} ${vehicle.year}) publié sur Laukars.`
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <VehicleGallery photos={vehicle.photos} title={vehicle.title} />

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isRent
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isRent
                        ? t("catalogue.typeRent")
                        : t("catalogue.typeSale")}
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {vehicle.title}
                  </h1>
                </div>
                <ShareButtons title={vehicle.title} />
              </div>

              {/* Specs Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Calendar,
                    label: t("vehicle.year"),
                    value: vehicle.year,
                  },
                  {
                    icon: Gauge,
                    label: t("vehicle.mileage"),
                    value: `${vehicle.mileage.toLocaleString()} ${t("vehicle.km")}`,
                  },
                  {
                    icon: Fuel,
                    label: t("vehicle.fuel"),
                    value: t(`vehicle.${vehicle.fuel.toLowerCase()}`),
                  },
                  {
                    icon: Cog,
                    label: t("vehicle.transmission"),
                    value: t(`vehicle.${vehicle.transmission.toLowerCase()}`),
                  },
                  {
                    icon: MapPin,
                    label: t("vehicle.city"),
                    value: vehicle.city,
                  },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <spec.icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">{spec.label}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("vehicle.description")}
                  </h2>
                  <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Rental Policy */}
              {isRent && vehicle.rentalPolicy && (
                <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-100">
                  <h2 className="text-lg font-semibold text-green-900">
                    {t("vehicle.rentalPolicy")}
                  </h2>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {vehicle.rentalPolicy.pricePerDay && (
                      <div>
                        <p className="text-xs text-green-600">{t("vehicle.pricePerDay")}</p>
                        <p className="text-lg font-bold text-green-800">
                          {formatPrice(vehicle.rentalPolicy.pricePerDay)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.pricePerWeek && (
                      <div>
                        <p className="text-xs text-green-600">{t("vehicle.pricePerWeek")}</p>
                        <p className="text-lg font-bold text-green-800">
                          {formatPrice(vehicle.rentalPolicy.pricePerWeek)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.pricePerMonth && (
                      <div>
                        <p className="text-xs text-green-600">{t("vehicle.pricePerMonth")}</p>
                        <p className="text-lg font-bold text-green-800">
                          {formatPrice(vehicle.rentalPolicy.pricePerMonth)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.deposit && (
                      <div>
                        <p className="text-xs text-green-600">{t("vehicle.depositAmount")}</p>
                        <p className="text-lg font-bold text-green-800">
                          {formatPrice(vehicle.rentalPolicy.deposit)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.kmIncluded && (
                      <div>
                        <p className="text-xs text-green-600">{t("vehicle.kmIncluded")}</p>
                        <p className="text-lg font-bold text-green-800">
                          {vehicle.rentalPolicy.kmIncluded} km
                        </p>
                      </div>
                    )}
                  </div>
                  {vehicle.rentalPolicy.conditions && (
                    <p className="mt-4 text-sm text-green-700">
                      {vehicle.rentalPolicy.conditions}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price + CTA + Form */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20">
              <div className="mb-6">
                {isRent ? (
                  <div>
                    <p className="text-sm text-gray-500">{t("vehicle.pricePerDay")}</p>
                    <p className="text-3xl font-bold text-green-700">
                      {formatPrice(
                        vehicle.rentalPolicy?.pricePerDay || vehicle.pricePublic
                      )}
                      <span className="text-base font-normal text-gray-500">
                        {t("catalogue.perDay")}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">{t("vehicle.price")}</p>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatPrice(vehicle.pricePublic)}
                    </p>
                  </div>
                )}
              </div>

              {/* Code Advantage */}
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800 text-sm">
                    {t("vehicle.codeAdvantage")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-700">
                  {t("vehicle.codeAdvantageDesc")}
                </p>
              </div>

              {/* Lead Form */}
              <LeadRequestForm
                vehicleId={vehicle.id}
                vehicleType={vehicle.type}
              />

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t("vehicle.contactWhatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
