"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Box, Text, Group, Button, UnstyledButton, Badge } from "@mantine/core";
import {
  Calendar,
  Gauge,
  Fuel,
  Cog,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";
const BG_DARK = "#0c1220";
const BG_CARD = "rgba(255,255,255,0.04)";
const GLASS = "rgba(12,18,32,0.75)";

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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter vehicles
  const filtered = vehicles.filter((v) => {
    if (activeType !== "all" && v.type !== activeType) return false;
    if (activeBrand !== "all" && v.brand !== activeBrand) return false;
    return true;
  });

  const selected = filtered[selectedIdx] || filtered[0];

  // Reset selection on filter change
  useEffect(() => {
    setSelectedIdx(0);
    setFadeIn(true);
  }, [activeType, activeBrand]);

  const selectVehicle = useCallback(
    (idx: number) => {
      if (idx === selectedIdx) return;
      setFadeIn(false);
      setTimeout(() => {
        setSelectedIdx(idx);
        setFadeIn(true);
      }, 250);
    },
    [selectedIdx]
  );

  const scrollThumbs = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  // Scroll active thumb into view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeThumb = container.children[selectedIdx] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIdx]);

  const photo = selected?.photos[0];
  const isRent = selected?.type === "RENT";
  const hasActiveLeads =
    selected?.leadRequests && selected.leadRequests.length > 0;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237600000000";
  const whatsappMsg = selected
    ? encodeURIComponent(
        `Bonjour, je suis intéressé par ${selected.title} (${selected.brand} ${selected.model} ${selected.year}) sur Laukars.`
      )
    : "";

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BG_DARK} 0%, #111b2e 50%, #0e1a28 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient teal glow */}
      <Box
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse, ${TEAL}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "40%",
          height: "40%",
          background: `radial-gradient(ellipse, ${TEAL}0a 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── HEADER: Title + Filters ── */}
      <Box
        style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "100px 32px 0",
        position: "relative",
        zIndex: 2,
        }}
      >
        {/* Title */}
        <Group justify="space-between" align="flex-end" mb={28}>
          <Box>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: TEAL,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {t("common.appName")}
            </Text>
            <Text
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 900,
                color: "#FFFFFF",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              CATALOGUE
            </Text>
          </Box>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
            }}
          >
            {filtered.length} {t("catalogue.vehicleCount", { count: filtered.length })}
          </Text>
        </Group>

        {/* Type tabs + Brand tabs */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Type tabs */}
          <Group gap={8}>
            {(
              [
                { key: "all", label: t("catalogue.allTypes") },
                { key: "SALE", label: t("catalogue.typeSale") },
                { key: "RENT", label: t("catalogue.typeRent") },
              ] as const
            ).map((tab) => (
              <UnstyledButton
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  transition: "all 0.25s ease",
                  ...(activeType === tab.key
                    ? {
                        background: TEAL,
                        color: "#FFFFFF",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.5)",
                      }),
                }}
              >
                {tab.label}
              </UnstyledButton>
            ))}
          </Group>

          {/* Brand tabs (horizontal scroll) */}
          <Box
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
            className="hide-scrollbar"
          >
            <UnstyledButton
              onClick={() => setActiveBrand("all")}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.25s ease",
                ...(activeBrand === "all"
                  ? {
                      background: "rgba(255,255,255,0.12)",
                      color: TEAL,
                      border: `1px solid ${TEAL}40`,
                    }
                  : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.35)",
                      border: "1px solid transparent",
                    }),
              }}
            >
              {t("catalogue.allBrands")}
            </UnstyledButton>
            {brands.map((brand) => (
              <UnstyledButton
                key={brand}
                onClick={() => setActiveBrand(brand)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                  ...(activeBrand === brand
                    ? {
                        background: "rgba(255,255,255,0.12)",
                        color: TEAL,
                        border: `1px solid ${TEAL}40`,
                      }
                    : {
                        background: "transparent",
                        color: "rgba(255,255,255,0.35)",
                        border: "1px solid transparent",
                      }),
                }}
              >
                {brand}
              </UnstyledButton>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── MAIN SHOWCASE ── */}
      {selected ? (
        <Box
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "32px 32px 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            className="showcase-main"
            style={{
              display: "flex",
              gap: 0,
              minHeight: 420,
              position: "relative",
            }}
          >
            {/* ── Left: Specs Panel (Glass) ── */}
            <Box
              className="specs-panel"
              style={{
                width: 340,
                flexShrink: 0,
                background: GLASS,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "16px 0 0 16px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRight: "none",
                zIndex: 3,
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? "translateX(0)" : "translateX(-20px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <Box>
                {/* Badges */}
                <Group gap={8} mb={16}>
                  <Badge
                    size="md"
                    radius="sm"
                    style={{
                      background: isRent
                        ? `${TEAL}30`
                        : "rgba(79,130,255,0.2)",
                      color: isRent ? TEAL : "#7aa2ff",
                      border: "none",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {isRent
                      ? t("catalogue.typeRent")
                      : t("catalogue.typeSale")}
                  </Badge>
                  {hasActiveLeads && (
                    <Badge
                      size="md"
                      radius="sm"
                      style={{
                        background: "rgba(255,160,0,0.2)",
                        color: "#ffb74d",
                        border: "none",
                        fontWeight: 700,
                        fontSize: 10,
                        letterSpacing: 0.5,
                      }}
                    >
                      {t("catalogue.negotiating")}
                    </Badge>
                  )}
                </Group>

                {/* Title */}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                    lineHeight: 1.15,
                    marginBottom: 4,
                  }}
                >
                  {selected.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 500,
                    marginBottom: 20,
                  }}
                >
                  {selected.brand} &middot; {selected.model}
                </Text>

                {/* Separator */}
                <Box
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                    marginBottom: 18,
                  }}
                />

                {/* Specs */}
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      icon: Calendar,
                      label: t("vehicle.year"),
                      value: String(selected.year),
                    },
                    {
                      icon: Gauge,
                      label: t("vehicle.mileage"),
                      value: `${selected.mileage.toLocaleString()} km`,
                    },
                    {
                      icon: Fuel,
                      label: t("vehicle.fuel"),
                      value: t(
                        `vehicle.${selected.fuel.toLowerCase()}`
                      ),
                    },
                    {
                      icon: Cog,
                      label: t("vehicle.transmission"),
                      value: t(
                        `vehicle.${selected.transmission.toLowerCase()}`
                      ),
                    },
                    {
                      icon: MapPin,
                      label: t("vehicle.city"),
                      value: selected.city,
                    },
                  ].map((spec) => (
                    <Group key={spec.label} gap={12} wrap="nowrap">
                      <Box
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <spec.icon size={15} style={{ color: TEAL }} />
                      </Box>
                      <Box>
                        <Text
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.3)",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            lineHeight: 1,
                          }}
                        >
                          {spec.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#FFFFFF",
                            lineHeight: 1.3,
                          }}
                        >
                          {spec.value}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Box>

                {/* Separator */}
                <Box
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                    margin: "18px 0",
                  }}
                />

                {/* Price */}
                <Box>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    {t("vehicle.price")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: TEAL,
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    {isRent && selected.rentalPolicy?.pricePerDay
                      ? formatPrice(selected.rentalPolicy.pricePerDay)
                      : formatPrice(selected.pricePublic)}
                    {isRent && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.35)",
                          marginLeft: 4,
                        }}
                      >
                        {t("catalogue.perDay")}
                      </span>
                    )}
                  </Text>
                </Box>
              </Box>

              {/* Buttons */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <Button
                  component={Link}
                  href={`/vehicule/${selected.id}`}
                  radius="md"
                  size="md"
                  rightSection={<ArrowRight size={16} />}
                  style={{
                    background: TEAL,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 14,
                    height: 44,
                    border: "none",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  {t("catalogue.viewVehicle")}
                </Button>
                <Button
                  component="a"
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                  size="md"
                  leftSection={<MessageCircle size={16} />}
                  style={{
                    background: "rgba(37,211,102,0.15)",
                    color: "#25d366",
                    fontWeight: 600,
                    fontSize: 13,
                    height: 40,
                    border: "1px solid rgba(37,211,102,0.2)",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>

            {/* ── Right: Large Vehicle Image ── */}
            <Box
              style={{
                flex: 1,
                position: "relative",
                borderRadius: "0 16px 16px 0",
                overflow: "hidden",
                background: BG_CARD,
                border: "1px solid rgba(255,255,255,0.04)",
                borderLeft: "none",
                minHeight: 420,
              }}
            >
              {photo ? (
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: fadeIn ? 1 : 0,
                    transform: fadeIn ? "scale(1)" : "scale(1.03)",
                    transition:
                      "opacity 0.4s ease, transform 0.5s ease",
                  }}
                >
                  <Image
                    src={photo.url}
                    alt={selected.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  {/* Gradient overlay for readability */}
                  <Box
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(12,18,32,0.5) 0%, transparent 40%), linear-gradient(0deg, rgba(12,18,32,0.4) 0%, transparent 30%)",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: 15,
                  }}
                >
                  Pas de photo
                </Box>
              )}

              {/* Index badge */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  padding: "6px 14px",
                  borderRadius: 8,
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <span style={{ color: TEAL, fontSize: 14 }}>
                    {selectedIdx + 1}
                  </span>{" "}
                  / {filtered.length}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* ── HORIZONTAL THUMBNAIL SCROLL ── */}
          <Box
            style={{
              position: "relative",
              marginTop: 24,
              paddingBottom: 32,
            }}
          >
            {/* Nav arrows */}
            <UnstyledButton
              onClick={() => scrollThumbs("left")}
              className="thumb-nav-btn"
              style={{
                position: "absolute",
                left: -4,
                top: "50%",
                transform: "translateY(-70%)",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5,
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.2s",
              }}
            >
              <ChevronLeft size={20} color="rgba(255,255,255,0.6)" />
            </UnstyledButton>
            <UnstyledButton
              onClick={() => scrollThumbs("right")}
              className="thumb-nav-btn"
              style={{
                position: "absolute",
                right: -4,
                top: "50%",
                transform: "translateY(-70%)",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5,
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.2s",
              }}
            >
              <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
            </UnstyledButton>

            {/* Scrollable thumbnails */}
            <Box
              ref={scrollRef}
              style={{
                display: "flex",
                gap: 14,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                padding: "4px 48px",
                scrollbarWidth: "none",
              }}
              className="hide-scrollbar"
            >
              {filtered.map((v, idx) => {
                const thumb = v.photos[0];
                const isActive = idx === selectedIdx;
                return (
                  <UnstyledButton
                    key={v.id}
                    onClick={() => selectVehicle(idx)}
                    style={{
                      flexShrink: 0,
                      width: 200,
                      scrollSnapAlign: "center",
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      border: isActive
                        ? `2px solid ${TEAL}`
                        : "2px solid rgba(255,255,255,0.06)",
                      transition: "all 0.3s ease",
                      boxShadow: isActive
                        ? `0 0 20px ${TEAL}30`
                        : "none",
                      transform: isActive
                        ? "scale(1.02)"
                        : "scale(1)",
                    }}
                  >
                    {/* Image */}
                    <Box
                      style={{
                        position: "relative",
                        width: 200,
                        height: 130,
                        background: "#111827",
                      }}
                    >
                      {thumb ? (
                        <Image
                          src={thumb.url}
                          alt={v.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="200px"
                        />
                      ) : (
                        <Box
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.15)",
                            fontSize: 11,
                          }}
                        >
                          N/A
                        </Box>
                      )}
                      {/* Overlay */}
                      <Box
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)",
                        }}
                      />
                      {/* Info overlay */}
                      <Box
                        style={{
                          position: "absolute",
                          bottom: 8,
                          left: 10,
                          right: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.brand} {v.model}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isActive ? TEAL : "rgba(255,255,255,0.5)",
                            marginTop: 2,
                          }}
                        >
                          {formatPrice(v.pricePublic)}
                        </Text>
                      </Box>

                      {/* Active indicator bar */}
                      {isActive && (
                        <Box
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: TEAL,
                          }}
                        />
                      )}
                    </Box>
                  </UnstyledButton>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        /* ── Empty state ── */
        <Box
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "80px 32px",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {t("catalogue.noVehicles")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.3)",
              marginTop: 8,
            }}
          >
            {t("catalogue.noVehiclesDesc")}
          </Text>
        </Box>
      )}

      {/* ── Global styles ── */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .thumb-nav-btn:hover {
          background: rgba(255,255,255,0.14) !important;
        }
        @media (max-width: 900px) {
          .showcase-main {
            flex-direction: column !important;
          }
          .specs-panel {
            width: 100% !important;
            border-radius: 16px 16px 0 0 !important;
            border-right: 1px solid rgba(255,255,255,0.06) !important;
            border-bottom: none !important;
            order: 2 !important;
          }
          .showcase-main > div:last-child {
            border-radius: 16px 16px 0 0 !important;
            border-left: 1px solid rgba(255,255,255,0.04) !important;
            min-height: 260px !important;
            order: 1 !important;
          }
        }
      `}</style>
    </Box>
  );
}
