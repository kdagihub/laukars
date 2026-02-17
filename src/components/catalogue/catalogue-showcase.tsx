"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  Box,
  Text,
  Group,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";
const PAGE_SIZE = 12;

type VehicleWithRelations = Vehicle & {
  photos: VehiclePhoto[];
  rentalPolicy: RentalPolicy | null;
  leadRequests?: { id: string }[];
};

type Props = {
  vehicles: VehicleWithRelations[];
  brands: string[];
};

export function CatalogueShowcase({ vehicles, brands }: Props) {
  const t = useTranslations();
  const [activeType, setActiveType] = useState<"all" | "SALE" | "RENT">("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [page, setPage] = useState(0);

  const ignitionAudioRef = useRef<HTMLAudioElement | null>(null);

  const playIgnitionSound = useCallback(() => {
    try {
      if (!ignitionAudioRef.current) {
        ignitionAudioRef.current = new Audio("/sounds/car-ignition-fail.mp3");
        ignitionAudioRef.current.volume = 0.5;
      }
      ignitionAudioRef.current.currentTime = 0;
      ignitionAudioRef.current.play().catch(() => {});
    } catch {
      // Silently ignore audio errors
    }
  }, []);

  const filtered = vehicles.filter((v) => {
    if (activeType !== "all" && v.type !== activeType) return false;
    if (activeBrand !== "all" && v.brand !== activeBrand) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goPage = (dir: "prev" | "next") => {
    setPage((p) => {
      if (dir === "prev") return Math.max(0, p - 1);
      return Math.min(totalPages - 1, p + 1);
    });
  };

  const resetFilters = () => {
    setActiveType("all");
    setActiveBrand("all");
    setPage(0);
  };

  return (
    <Box style={{ minHeight: "100vh", background: "#f6fafa" }}>
      <Box
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "100px 32px 64px",
        }}
      >
        {/* ── Title ── */}
        <Text
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 900,
            color: "#1a2332",
            fontFamily: '"Inter Tight", system-ui, sans-serif',
            letterSpacing: -1,
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          CATALOGUE
        </Text>

        {/* ── Filters ── */}
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 36,
          }}
        >
          {(
            [
              { key: "all", label: t("catalogue.allTypes") },
              { key: "SALE", label: t("catalogue.typeSale") },
              { key: "RENT", label: t("catalogue.typeRent") },
            ] as const
          ).map((tab) => (
            <UnstyledButton
              key={tab.key}
              onClick={() => {
                setActiveType(tab.key);
                setPage(0);
              }}
              style={{
                padding: "9px 22px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                transition: "all 0.2s ease",
                ...(activeType === tab.key
                  ? {
                      background: TEAL_DARK,
                      color: "#FFFFFF",
                      border: `1.5px solid ${TEAL_DARK}`,
                    }
                  : {
                      background: "#FFFFFF",
                      color: "#5a6a7e",
                      border: "1.5px solid #d4dede",
                    }),
              }}
            >
              {tab.label}
            </UnstyledButton>
          ))}

          <Box
            style={{
              height: 20,
              width: 1,
              background: "#d4dede",
              alignSelf: "center",
              margin: "0 4px",
            }}
            className="filter-divider"
          />

          <UnstyledButton
            onClick={() => {
              setActiveBrand("all");
              setPage(0);
            }}
            style={{
              padding: "9px 22px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              transition: "all 0.2s ease",
              ...(activeBrand === "all"
                ? {
                    background: TEAL_DARK,
                    color: "#FFFFFF",
                    border: `1.5px solid ${TEAL_DARK}`,
                  }
                : {
                    background: "#FFFFFF",
                    color: "#5a6a7e",
                    border: "1.5px solid #d4dede",
                  }),
            }}
          >
            {t("catalogue.allBrands")}
          </UnstyledButton>

          {brands.map((brand) => (
            <UnstyledButton
              key={brand}
              onClick={() => {
                setActiveBrand(brand);
                setPage(0);
              }}
              style={{
                padding: "9px 22px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                transition: "all 0.2s ease",
                ...(activeBrand === brand
                  ? {
                      background: TEAL_DARK,
                      color: "#FFFFFF",
                      border: `1.5px solid ${TEAL_DARK}`,
                    }
                  : {
                      background: "#FFFFFF",
                      color: "#5a6a7e",
                      border: "1.5px solid #d4dede",
                    }),
              }}
            >
              {brand}
            </UnstyledButton>
          ))}
        </Box>

        {/* ── Vehicle count ── */}
        <Text
          style={{
            fontSize: 14,
            color: "#7a8a9e",
            fontWeight: 500,
            marginBottom: 20,
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
        >
          {filtered.length}{" "}
          {t("catalogue.vehicleCount", { count: filtered.length })}
        </Text>

        {/* ── Grid with side arrows ── */}
        {paged.length > 0 ? (
          <Box style={{ position: "relative" }}>
            {page > 0 && (
              <UnstyledButton
                onClick={() => goPage("prev")}
                className="grid-nav-btn"
                style={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  border: "1px solid #d4dede",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.2s",
                }}
              >
                <ChevronLeft size={22} color={TEAL_DARK} />
              </UnstyledButton>
            )}

            {page < totalPages - 1 && (
              <UnstyledButton
                onClick={() => goPage("next")}
                className="grid-nav-btn"
                style={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  border: "1px solid #d4dede",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.2s",
                }}
              >
                <ChevronRight size={22} color={TEAL_DARK} />
              </UnstyledButton>
            )}

            <Box
              className="catalogue-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              {paged.map((v) => {
                const photo = v.photos[0];
                const isRent = v.type === "RENT";
                return (
                  <Link
                    key={v.id}
                    href={`/vehicule/${v.id}`}
                    style={{ textDecoration: "none" }}
                    onClick={playIgnitionSound}
                  >
                    <Box
                      className="catalogue-card"
                      style={{
                        background: "#FFFFFF",
                        borderRadius: 14,
                        overflow: "hidden",
                        border: "1.5px solid #e4ecec",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Image */}
                      <Box
                        className="card-img"
                        style={{
                          position: "relative",
                          aspectRatio: "4/3",
                          overflow: "hidden",
                          background: "#f0f5f5",
                        }}
                      >
                        {photo ? (
                          <Image
                            src={photo.url}
                            alt={v.title}
                            fill
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                          />
                        ) : (
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: "#b0bec5",
                              fontSize: 13,
                            }}
                          >
                            Pas de photo
                          </Box>
                        )}

                        <Badge
                          size="sm"
                          radius="sm"
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            background: isRent ? "#e6f7f5" : TEAL_DARK,
                            color: isRent ? TEAL_DARK : "#FFFFFF",
                            fontWeight: 700,
                            fontSize: 10,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            border: "none",
                          }}
                        >
                          {isRent
                            ? t("catalogue.typeRent")
                            : t("catalogue.typeSale")}
                        </Badge>
                      </Box>

                      {/* Content */}
                      <Box
                        style={{
                          padding: "16px 16px 18px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 800,
                            fontSize: 15,
                            color: "#1a2332",
                            lineHeight: 1.25,
                            fontFamily:
                              '"Inter Tight", system-ui, sans-serif',
                            textTransform: "uppercase",
                          }}
                        >
                          {v.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#7a8a9e",
                            marginTop: 2,
                            fontFamily:
                              '"Inter Tight", system-ui, sans-serif',
                          }}
                        >
                          {v.brand}
                        </Text>

                        <Box style={{ flex: 1, minHeight: 12 }} />

                        <Group justify="space-between" align="center" mt={8}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#1a2332",
                              fontFamily:
                                '"Inter Tight", system-ui, sans-serif',
                            }}
                          >
                            {isRent && v.rentalPolicy?.pricePerDay
                              ? formatPrice(v.rentalPolicy.pricePerDay)
                              : formatPrice(v.pricePublic)}
                            {isRent && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 400,
                                  color: "#7a8a9e",
                                }}
                              >
                                {" "}
                                / {t("catalogue.perDay")}
                              </span>
                            )}
                          </Text>

                          <Box
                            className="card-detail-btn"
                            style={{
                              padding: "5px 12px",
                              borderRadius: 6,
                              background: TEAL,
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily:
                                '"Inter Tight", system-ui, sans-serif',
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t("catalogue.viewVehicle")}
                          </Box>
                        </Group>
                      </Box>
                    </Box>
                  </Link>
                );
              })}
            </Box>

            {totalPages > 1 && (
              <Group justify="center" mt={32} gap={8}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <UnstyledButton
                    key={i}
                    onClick={() => setPage(i)}
                    style={{
                      width: page === i ? 28 : 10,
                      height: 10,
                      borderRadius: 5,
                      background: page === i ? TEAL : "#d4dede",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Group>
            )}
          </Box>
        ) : (
          <Box style={{ textAlign: "center", padding: "60px 0" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1a2332",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("catalogue.noVehicles")}
            </Text>
            <Text
              style={{ fontSize: 14, color: "#7a8a9e", marginTop: 8 }}
            >
              {t("catalogue.noVehiclesDesc")}
            </Text>
            <UnstyledButton
              onClick={resetFilters}
              style={{
                marginTop: 20,
                padding: "10px 24px",
                borderRadius: 8,
                background: TEAL,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {t("catalogue.resetFilters")}
            </UnstyledButton>
          </Box>
        )}
      </Box>

      <style>{`
        @media (max-width: 1100px) {
          .catalogue-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .catalogue-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
          .filter-divider {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .catalogue-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .grid-nav-btn:hover {
          background: #f0faf9 !important;
          border-color: ${TEAL} !important;
        }
        .catalogue-card:hover {
          border-color: ${TEAL} !important;
          box-shadow: 0 8px 24px rgba(79, 170, 163, 0.14) !important;
          transform: translateY(-3px);
        }
        .catalogue-card:hover .card-img img {
          transform: scale(1.04);
        }
        .catalogue-card .card-detail-btn {
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s ease;
        }
        .catalogue-card:hover .card-detail-btn {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </Box>
  );
}
