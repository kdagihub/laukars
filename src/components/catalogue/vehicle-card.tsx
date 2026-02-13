"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Box, Text, Group, Badge } from "@mantine/core";
import { MapPin, Calendar, Gauge, Fuel, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

type VehicleWithRelations = Vehicle & {
  photos: VehiclePhoto[];
  rentalPolicy: RentalPolicy | null;
  leadRequests?: { id: string }[];
};

export function VehicleCard({ vehicle }: { vehicle: VehicleWithRelations }) {
  const t = useTranslations();
  const photo = vehicle.photos[0];
  const isRent = vehicle.type === "RENT";
  const hasActiveLeads =
    vehicle.leadRequests && vehicle.leadRequests.length > 0;

  return (
    <Link href={`/vehicule/${vehicle.id}`} style={{ textDecoration: "none" }}>
      <Box
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e8eeee",
          transition: "all 0.3s ease",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        className="vehicle-card"
      >
        {/* Image */}
        <Box
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            background: "#f4f8f8",
          }}
        >
          {photo ? (
            <Image
              src={photo.url}
              alt={vehicle.title}
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#aaa",
                fontSize: 14,
              }}
            >
              Pas de photo
            </Box>
          )}

          {/* Badges overlay */}
          <Group
            gap={8}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              flexWrap: "wrap",
            }}
          >
            <Badge
              size="md"
              radius="xl"
              style={{
                backgroundColor: isRent ? "#e6f7f5" : "#e8f0fe",
                color: isRent ? TEAL_DARK : "#1a3a6b",
                fontWeight: 600,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                border: "none",
              }}
            >
              {isRent ? t("catalogue.typeRent") : t("catalogue.typeSale")}
            </Badge>

            {hasActiveLeads && (
              <Badge
                size="md"
                radius="xl"
                style={{
                  backgroundColor: "#fff3e0",
                  color: "#e65100",
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: "none",
                  border: "none",
                }}
              >
                {t("catalogue.negotiating")}
              </Badge>
            )}
          </Group>
        </Box>

        {/* Content */}
        <Box style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
          <Text
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#1a2332",
              lineHeight: 1.3,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {vehicle.title}
          </Text>

          {/* Quick specs */}
          <Group gap={12} mt={12} wrap="wrap">
            {[
              { icon: Calendar, value: String(vehicle.year) },
              {
                icon: Gauge,
                value: `${vehicle.mileage.toLocaleString()} ${t("vehicle.km")}`,
              },
              {
                icon: Fuel,
                value: t(`vehicle.${vehicle.fuel.toLowerCase()}`),
              },
              { icon: MapPin, value: vehicle.city },
            ].map((spec, idx) => (
              <Group key={idx} gap={4} wrap="nowrap">
                <spec.icon
                  size={14}
                  style={{ color: TEAL, flexShrink: 0 }}
                />
                <Text style={{ fontSize: 12, color: "#7a8a9e", whiteSpace: "nowrap" }}>
                  {spec.value}
                </Text>
              </Group>
            ))}
          </Group>

          {/* Spacer */}
          <Box style={{ flex: 1, minHeight: 16 }} />

          {/* Price + CTA */}
          <Group justify="space-between" align="flex-end" mt={8}>
            <Box>
              {isRent && vehicle.rentalPolicy ? (
                <>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: TEAL_DARK,
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      lineHeight: 1.1,
                    }}
                  >
                    {formatPrice(
                      vehicle.rentalPolicy.pricePerDay || vehicle.pricePublic
                    )}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                    {t("catalogue.perDay")}
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: TEAL_DARK,
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                    lineHeight: 1.1,
                  }}
                >
                  {formatPrice(vehicle.pricePublic)}
                </Text>
              )}
            </Box>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: TEAL,
                fontSize: 13,
                fontWeight: 600,
                transition: "gap 0.2s ease",
              }}
            >
              {t("catalogue.viewVehicle")}
              <ArrowRight size={14} />
            </Box>
          </Group>
        </Box>

        {/* Hover styles */}
        <style>{`
          .vehicle-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(79, 170, 163, 0.15);
            border-color: ${TEAL} !important;
          }
          .vehicle-card:hover img {
            transform: scale(1.05);
          }
        `}</style>
      </Box>
    </Link>
  );
}
