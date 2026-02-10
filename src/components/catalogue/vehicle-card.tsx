"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { MapPin, Calendar, Gauge, Fuel } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

type VehicleWithRelations = Vehicle & {
  photos: VehiclePhoto[];
  rentalPolicy: RentalPolicy | null;
};

export function VehicleCard({ vehicle }: { vehicle: VehicleWithRelations }) {
  const t = useTranslations();
  const photo = vehicle.photos[0];
  const isRent = vehicle.type === "RENT";

  return (
    <Link
      href={`/vehicule/${vehicle.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {photo ? (
          <Image
            src={photo.url}
            alt={vehicle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Pas de photo
          </div>
        )}
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isRent
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isRent ? t("catalogue.typeRent") : t("catalogue.typeSale")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">
          {vehicle.title}
        </h3>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {vehicle.mileage.toLocaleString()} {t("vehicle.km")}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {t(`vehicle.${vehicle.fuel.toLowerCase()}`)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {vehicle.city}
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            {isRent && vehicle.rentalPolicy ? (
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {formatPrice(vehicle.rentalPolicy.pricePerDay || vehicle.pricePublic)}
                  <span className="text-sm font-normal text-gray-500">
                    {t("catalogue.perDay")}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-blue-900">
                {formatPrice(vehicle.pricePublic)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
