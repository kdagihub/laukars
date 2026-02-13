"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Box, Text, Group, Button } from "@mantine/core";
import { ArrowRight, Calendar, Gauge, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

type VehicleWithRelations = Vehicle & {
  photos: VehiclePhoto[];
  rentalPolicy: RentalPolicy | null;
};

type Props = {
  vehicles: VehicleWithRelations[];
};

/* ── Small card (grid items 2-5) ── */
function SmallCard({
  vehicle,
  index,
  isVisible,
}: {
  vehicle: VehicleWithRelations;
  index: number;
  isVisible: boolean;
}) {
  const t = useTranslations();
  const photo = vehicle.photos[0];
  const isRent = vehicle.type === "RENT";

  return (
    <Link href={`/vehicule/${vehicle.id}`} style={{ textDecoration: "none" }}>
      <Box
        className="catalogue-card"
        style={{
          borderRadius: 14,
          overflow: "hidden",
          background: "#FFFFFF",
          border: "1px solid #eaeef2",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.4s ease",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transitionDelay: `${0.15 + index * 0.1}s`,
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <Box
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            background: "#f2f5f5",
            overflow: "hidden",
          }}
        >
          {photo ? (
            <Image
              src={photo.url}
              alt={vehicle.title}
              fill
              className="card-img"
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <Box
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
                fontSize: 13,
              }}
            >
              Pas de photo
            </Box>
          )}
          {/* Badge */}
          <Box
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: isRent ? TEAL : TEAL_DARK,
            }}
          >
            {isRent ? t("catalogue.typeRent") : t("catalogue.typeSale")}
          </Box>
        </Box>

        {/* Info */}
        <Box style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a2332",
              lineHeight: 1.3,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {vehicle.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#8a9ab0",
              marginTop: 4,
            }}
          >
            {vehicle.year} &middot; {vehicle.mileage.toLocaleString()} km &middot; {vehicle.city}
          </Text>
          <Box style={{ flex: 1, minHeight: 8 }} />
          <Text
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: TEAL_DARK,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              marginTop: 8,
            }}
          >
            {isRent && vehicle.rentalPolicy?.pricePerDay
              ? `${formatPrice(vehicle.rentalPolicy.pricePerDay)}/j`
              : formatPrice(vehicle.pricePublic)}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}

/* ── Main component ── */
export function CataloguePreview({ vehicles }: Props) {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (vehicles.length === 0) return null;

  const featured = vehicles[0];
  const grid = vehicles.slice(1, 5);
  const featuredPhoto = featured.photos[0];
  const featuredIsRent = featured.type === "RENT";

  return (
    <Box
      ref={sectionRef}
      style={{
        background: "#f6fafa",
        padding: "80px 0 96px",
        overflow: "hidden",
      }}
    >
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Header ── */}
        <Box
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease",
          }}
        >
          <Group justify="space-between" align="flex-end" mb={40}>
            <Box>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: TEAL,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {t("landing.featuredVehicles")}
              </Text>
              <Text
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 900,
                  color: "#1a2332",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  lineHeight: 1.1,
                }}
              >
                {t("catalogue.title")}
              </Text>
              <Box
                style={{
                  width: 50,
                  height: 3,
                  background: TEAL,
                  borderRadius: 2,
                  marginTop: 14,
                }}
              />
            </Box>
            <Button
              component={Link}
              href="/catalogue"
              variant="subtle"
              rightSection={<ArrowRight size={16} />}
              style={{
                color: TEAL_DARK,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("common.viewAll")}
            </Button>
          </Group>
        </Box>

        {/* ── Bento Grid ── */}
        <Box
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 16,
            minHeight: 480,
          }}
        >
          {/* Featured card (large, spans 2 rows) */}
          <Link
            href={`/vehicule/${featured.id}`}
            style={{
              textDecoration: "none",
              gridColumn: "1",
              gridRow: "1 / 3",
            }}
          >
            <Box
              className="catalogue-card featured-card"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                height: "100%",
                minHeight: 480,
                cursor: "pointer",
                transition: "all 0.4s ease",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "0.1s",
              }}
            >
              {/* Background image */}
              {featuredPhoto ? (
                <Image
                  src={featuredPhoto.url}
                  alt={featured.title}
                  fill
                  className="card-img"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              ) : (
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#e8eeee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Pas de photo
                </Box>
              )}

              {/* Gradient overlay */}
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)",
                  zIndex: 1,
                }}
              />

              {/* Badge */}
              <Box
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 2,
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  background: featuredIsRent ? TEAL : TEAL_DARK,
                }}
              >
                {featuredIsRent
                  ? t("catalogue.typeRent")
                  : t("catalogue.typeSale")}
              </Box>

              {/* Info overlay (bottom) */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px 24px 28px",
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  {featured.title}
                </Text>

                {/* Mini specs */}
                <Group gap={16} mb={14}>
                  {[
                    { icon: Calendar, text: String(featured.year) },
                    {
                      icon: Gauge,
                      text: `${featured.mileage.toLocaleString()} km`,
                    },
                    { icon: MapPin, text: featured.city },
                  ].map((s, i) => (
                    <Group key={i} gap={5} wrap="nowrap">
                      <s.icon size={13} style={{ color: TEAL }} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {s.text}
                      </Text>
                    </Group>
                  ))}
                </Group>

                {/* Price */}
                <Group justify="space-between" align="flex-end">
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: TEAL,
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    {featuredIsRent && featured.rentalPolicy?.pricePerDay
                      ? formatPrice(featured.rentalPolicy.pricePerDay)
                      : formatPrice(featured.pricePublic)}
                    {featuredIsRent && (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.5)",
                          marginLeft: 4,
                        }}
                      >
                        /jour
                      </span>
                    )}
                  </Text>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {t("catalogue.viewVehicle")}
                    <ArrowRight size={14} />
                  </Box>
                </Group>
              </Box>
            </Box>
          </Link>

          {/* Grid cards (4 smaller cards) */}
          {grid.map((v, idx) => (
            <SmallCard
              key={v.id}
              vehicle={v}
              index={idx}
              isVisible={isVisible}
            />
          ))}
        </Box>

        {/* ── CTA Button ── */}
        <Box
          style={{
            textAlign: "center",
            marginTop: 48,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.6s",
          }}
        >
          <Button
            component={Link}
            href="/catalogue"
            size="xl"
            radius="xl"
            rightSection={<ArrowRight size={18} />}
            style={{
              background: TEAL_DARK,
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 40px",
              height: "auto",
              border: "none",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {t("landing.ctaCatalogue")}
          </Button>
        </Box>
      </Box>

      {/* ── Styles ── */}
      <style>{`
        .catalogue-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.10);
        }
        .catalogue-card:hover .card-img {
          transform: scale(1.05);
        }
        .featured-card:hover {
          box-shadow: 0 20px 50px rgba(0,0,0,0.20) !important;
        }
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto !important;
          }
          .bento-grid > a:first-child {
            grid-column: 1 / 3 !important;
            grid-row: auto !important;
          }
          .bento-grid > a:first-child > div {
            min-height: 300px !important;
          }
        }
        @media (max-width: 540px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-grid > a:first-child {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </Box>
  );
}
