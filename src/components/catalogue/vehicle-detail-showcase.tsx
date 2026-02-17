"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Box, Text, Group, UnstyledButton, Badge } from "@mantine/core";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  MapPin,
  Ticket,
  MessageCircle,
  Loader2,
  Send,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createLeadRequest } from "@/app/actions/lead";
import type { Vehicle, VehiclePhoto, RentalPolicy } from "@prisma/client";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

const ICON_COMPS = { Calendar, Gauge, Fuel, Cog, MapPin };

const GLASS: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: 18,
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(79,170,163,0.06)",
};

type FullVehicle = Vehicle & {
  photos: VehiclePhoto[];
  rentalPolicy: RentalPolicy | null;
};

type Props = {
  vehicle: FullVehicle;
  otherVehicles: FullVehicle[];
  whatsappNumber: string;
  fuelLabels: Record<string, string>;
  transLabels: Record<string, string>;
  translations: Record<string, string>;
  leadLabels: Record<string, string>;
};

export function VehicleDetailShowcase({
  vehicle,
  otherVehicles,
  whatsappNumber,
  fuelLabels,
  transLabels,
  translations: tr,
  leadLabels,
}: Props) {
  const allVehicles = [vehicle, ...otherVehicles];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = useCallback(() => {
    try {
      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio("/sounds/son_click_next_preview.mp3");
        clickAudioRef.current.volume = 0.6;
      }
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    } catch {
      // Silently ignore audio errors
    }
  }, []);

  const current = allVehicles[currentIdx];
  const isRent = current.type === "RENT";
  const photo = current.photos[photoIdx] || current.photos[0];

  const navigateVehicle = useCallback(
    (dir: "prev" | "next") => {
      playClickSound();
      setFade(false);
      setTimeout(() => {
        setCurrentIdx((idx) => {
          if (dir === "prev") return idx === 0 ? allVehicles.length - 1 : idx - 1;
          return idx === allVehicles.length - 1 ? 0 : idx + 1;
        });
        setPhotoIdx(0);
        setFade(true);
      }, 200);
    },
    [allVehicles.length, playClickSound]
  );

  const navigatePhoto = (dir: "prev" | "next") => {
    if (current.photos.length <= 1) return;
    setPhotoIdx((idx) => {
      if (dir === "prev") return idx === 0 ? current.photos.length - 1 : idx - 1;
      return idx === current.photos.length - 1 ? 0 : idx + 1;
    });
  };

  const scrollOther = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const price = isRent && current.rentalPolicy?.pricePerDay
    ? formatPrice(current.rentalPolicy.pricePerDay)
    : formatPrice(current.pricePublic);

  const specs = [
    { key: "Calendar", label: tr.year, value: String(current.year) },
    { key: "Gauge", label: tr.mileage, value: `${current.mileage.toLocaleString()} ${tr.km}` },
    { key: "Fuel", label: tr.fuel, value: fuelLabels[current.fuel.toLowerCase()] || current.fuel },
    { key: "Cog", label: tr.transmission, value: transLabels[current.transmission.toLowerCase()] || current.transmission },
    { key: "MapPin", label: tr.city, value: current.city },
  ];

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par ${current.title} (${current.brand} ${current.model} ${current.year}) sur Laukars.`
  );

  return (
    <div style={{ background: "#f6fafa", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "100px 32px 0" }}>
        {/* ── Back to catalogue ── */}
        <Link
          href="/catalogue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: TEAL_DARK,
            textDecoration: "none",
            marginBottom: 20,
            padding: "8px 16px 8px 10px",
            borderRadius: 10,
            background: "#FFFFFF",
            border: "1px solid #e0e8e8",
            transition: "all 0.2s ease",
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
          className="back-catalogue-btn"
        >
          <ChevronLeft size={18} />
          {tr.backToCatalogue || "Catalogue"}
        </Link>

        {/* ── Title row (reactive) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            opacity: fade ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "5px 14px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                background: isRent ? "#e6f7f5" : TEAL_DARK,
                color: isRent ? TEAL_DARK : "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 10,
              }}
            >
              {isRent ? tr.typeRent : tr.typeSale}
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 900,
                color: "#1a2332",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                lineHeight: 1.15,
              }}
            >
              {current.title}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7a8a9e", fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
              {current.brand} &middot; {current.model} &middot; {current.year}
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            3-PANEL SHOWCASE
            ════════════════════════════════════════════ */}
        <Box style={{ position: "relative" }}>
          {/* Large vehicle navigation arrows */}
          <UnstyledButton
            onClick={() => navigateVehicle("prev")}
            className="big-arrow-btn"
            style={{ position: "absolute", left: -60, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, background: "none", border: "none" }}
          >
            <ChevronLeft size={72} color={TEAL} strokeWidth={2.5} />
          </UnstyledButton>
          <UnstyledButton
            onClick={() => navigateVehicle("next")}
            className="big-arrow-btn"
            style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, background: "none", border: "none" }}
          >
            <ChevronRight size={72} color={TEAL} strokeWidth={2.5} />
          </UnstyledButton>

          <Box
            className="showcase-3panel"
            style={{
              display: "grid",
              gridTemplateColumns: "270px 1fr 270px",
              gap: 20,
              minHeight: 460,
              alignItems: "stretch",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {/* ── LEFT PANEL: Specs ── */}
            <Box className="showcase-left" style={{ ...GLASS, padding: "26px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Badge size="sm" radius="sm" style={{ background: isRent ? "rgba(230,247,245,0.8)" : TEAL_DARK, color: isRent ? TEAL_DARK : "#FFFFFF", fontWeight: 700, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", border: "none", marginBottom: 14 }}>
                  {isRent ? tr.typeRent : tr.typeSale}
                </Badge>
                <Text style={{ fontSize: 18, fontWeight: 800, color: "#1a2332", fontFamily: '"Inter Tight", system-ui, sans-serif', lineHeight: 1.2, marginBottom: 4 }}>
                  {current.title}
                </Text>
                <Text style={{ fontSize: 12, color: "#7a8a9e", marginBottom: 18 }}>
                  {current.brand} &middot; {current.model}
                </Text>
                <Box style={{ height: 1, background: "rgba(228,236,236,0.6)", marginBottom: 14 }} />
                <Box style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {specs.map((spec) => {
                    const Icon = ICON_COMPS[spec.key as keyof typeof ICON_COMPS];
                    return (
                      <Group key={spec.key} gap={10} wrap="nowrap">
                        <Box style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(240,250,249,0.8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color: TEAL }} />
                        </Box>
                        <Box>
                          <Text style={{ fontSize: 9, color: "#99a8b8", textTransform: "uppercase", letterSpacing: 0.8, lineHeight: 1 }}>{spec.label}</Text>
                          <Text style={{ fontSize: 13, fontWeight: 600, color: "#1a2332", lineHeight: 1.3 }}>{spec.value}</Text>
                        </Box>
                      </Group>
                    );
                  })}
                </Box>
              </Box>
              <Box style={{ marginTop: 16 }}>
                <Box style={{ height: 1, background: "rgba(228,236,236,0.6)", marginBottom: 12 }} />
                <Text style={{ fontSize: 9, color: "#99a8b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  {isRent ? tr.pricePerDay : tr.priceLabel}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: 900, color: "#1a2332", fontFamily: '"Inter Tight", system-ui, sans-serif', lineHeight: 1 }}>
                  {price}
                  {isRent && <span style={{ fontSize: 11, fontWeight: 400, color: "#99a8b8", marginLeft: 4 }}>{tr.perDay}</span>}
                </Text>
              </Box>
            </Box>

            {/* ── CENTER: Main Image with floating thumbnails ── */}
            <Box style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#eaf0f0", minHeight: 460, boxShadow: "0 0 60px rgba(79,170,163,0.12), 0 0 120px rgba(79,170,163,0.06)", border: "1px solid rgba(79,170,163,0.15)" }}>
              {photo ? (
                <Image src={photo.url} alt={current.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <Box style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#99a8b8", fontSize: 15 }}>
                  Pas de photo
                </Box>
              )}

              {/* Small photo navigation arrows inside image */}
              {current.photos.length > 1 && (
                <>
                  <UnstyledButton onClick={() => navigatePhoto("prev")} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 3 }}>
                    <ChevronLeft size={18} color="#1a2332" />
                  </UnstyledButton>
                  <UnstyledButton onClick={() => navigatePhoto("next")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 3 }}>
                    <ChevronRight size={18} color="#1a2332" />
                  </UnstyledButton>
                </>
              )}

              {/* Photo counter */}
              {current.photos.length > 1 && (
                <Box style={{ position: "absolute", top: 14, right: 14, background: "rgba(79,170,163,0.85)", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#FFFFFF", zIndex: 2 }}>
                  {photoIdx + 1} / {current.photos.length}
                </Box>
              )}

              {/* Floating photo thumbnails inside the image */}
              {current.photos.length > 1 && (
                <Box style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 4, padding: "6px 10px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", borderRadius: 12 }}>
                  {current.photos.slice(0, 8).map((p, i) => (
                    <UnstyledButton
                      key={p.id}
                      onClick={() => setPhotoIdx(i)}
                      style={{
                        width: 52,
                        height: 38,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: `2.5px solid ${i === photoIdx ? TEAL : "rgba(255,255,255,0.7)"}`,
                        position: "relative",
                        flexShrink: 0,
                        boxShadow: i === photoIdx ? `0 0 8px ${TEAL}40` : "0 1px 4px rgba(0,0,0,0.12)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Image src={p.url} alt={`Photo ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="52px" />
                    </UnstyledButton>
                  ))}
                </Box>
              )}

              {/* Dot indicators */}
              {current.photos.length > 1 && (
                <Box style={{ position: "absolute", bottom: 62, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 4 }}>
                  {current.photos.slice(0, 8).map((_, i) => (
                    <Box
                      key={i}
                      style={{
                        width: i === photoIdx ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === photoIdx ? TEAL : "rgba(255,255,255,0.6)",
                        transition: "all 0.3s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* ── RIGHT PANEL: Price only ── */}
            <Box className="showcase-right" style={{ ...GLASS, padding: "26px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Badge size="sm" radius="sm" style={{ background: isRent ? "rgba(230,247,245,0.8)" : TEAL_DARK, color: isRent ? TEAL_DARK : "#FFFFFF", fontWeight: 700, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", border: "none", marginBottom: 24 }}>
                  {isRent ? tr.typeRent : tr.typeSale}
                </Badge>

                <Text style={{ fontSize: 10, color: "#99a8b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {isRent ? tr.pricePerDay : tr.priceLabel}
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 900, color: "#1a2332", fontFamily: '"Inter Tight", system-ui, sans-serif', lineHeight: 1 }}>
                  {price}
                  {isRent && <span style={{ fontSize: 12, fontWeight: 400, color: "#99a8b8", marginLeft: 4 }}>{tr.perDay}</span>}
                </Text>

                {isRent && current.rentalPolicy && (
                  <Box style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {current.rentalPolicy.pricePerWeek && (
                      <Box>
                        <Text style={{ fontSize: 9, color: "#99a8b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{tr.pricePerWeek}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: "#1a2332" }}>{formatPrice(current.rentalPolicy.pricePerWeek)}</Text>
                      </Box>
                    )}
                    {current.rentalPolicy.pricePerMonth && (
                      <Box>
                        <Text style={{ fontSize: 9, color: "#99a8b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{tr.pricePerMonth}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: "#1a2332" }}>{formatPrice(current.rentalPolicy.pricePerMonth)}</Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {/* WhatsApp quick CTA */}
              <Box style={{ marginTop: 20 }}>
                <Box style={{ height: 1, background: "rgba(228,236,236,0.6)", marginBottom: 16 }} />
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "11px 0", borderRadius: 10, background: "#25d366", color: "#FFFFFF", fontWeight: 700, fontSize: 13, fontFamily: '"Inter Tight", system-ui, sans-serif', textDecoration: "none", transition: "background 0.2s" }}
                >
                  <MessageCircle size={16} />
                  {tr.contactWhatsapp}
                </a>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>

      {/* ════════════════════════════════════════════
          BOTTOM DETAILS (reactive to selected vehicle)
          ════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "36px 32px 64px", opacity: fade ? 1 : 0, transition: "opacity 0.2s ease" }}>
        <div className="vehicle-bottom-grid" style={{ display: "grid", gap: 32 }}>
          {/* Left: Specs + Description */}
          <div className="vehicle-bottom-left" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 28, border: "1px solid #e8eeee" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2332", margin: "0 0 20px", fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                {tr.specifications}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {specs.map((spec) => {
                  const Icon = ICON_COMPS[spec.key as keyof typeof ICON_COMPS];
                  return (
                    <div key={spec.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, background: "#f6fafa" }}>
                      <Icon size={20} style={{ color: TEAL, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>{spec.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a2332", margin: 0 }}>{spec.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {current.description && (
                <div style={{ marginTop: 28 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2332", margin: "0 0 14px", fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                    {tr.description}
                  </h2>
                  <p style={{ fontSize: 15, color: "#5a6a7e", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                    {current.description}
                  </p>
                </div>
              )}

              {isRent && current.rentalPolicy && (
                <div style={{ marginTop: 28, padding: 24, background: "#e6f7f5", borderRadius: 14, border: `1px solid ${TEAL}33` }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: TEAL_DARK, margin: "0 0 16px", fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                    {tr.rentalPolicy}
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                    {current.rentalPolicy.pricePerDay && (
                      <div>
                        <p style={{ fontSize: 11, color: TEAL, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{tr.pricePerDay}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>{formatPrice(current.rentalPolicy.pricePerDay)}</p>
                      </div>
                    )}
                    {current.rentalPolicy.pricePerWeek && (
                      <div>
                        <p style={{ fontSize: 11, color: TEAL, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{tr.pricePerWeek}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>{formatPrice(current.rentalPolicy.pricePerWeek)}</p>
                      </div>
                    )}
                    {current.rentalPolicy.pricePerMonth && (
                      <div>
                        <p style={{ fontSize: 11, color: TEAL, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{tr.pricePerMonth}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>{formatPrice(current.rentalPolicy.pricePerMonth)}</p>
                      </div>
                    )}
                    {current.rentalPolicy.deposit && (
                      <div>
                        <p style={{ fontSize: 11, color: TEAL, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{tr.depositAmount}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>{formatPrice(current.rentalPolicy.deposit)}</p>
                      </div>
                    )}
                    {current.rentalPolicy.kmIncluded && (
                      <div>
                        <p style={{ fontSize: 11, color: TEAL, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{tr.kmIncluded}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>{current.rentalPolicy.kmIncluded} km</p>
                      </div>
                    )}
                  </div>
                  {current.rentalPolicy.conditions && (
                    <p style={{ marginTop: 16, fontSize: 13, color: TEAL_DARK, lineHeight: 1.5 }}>{current.rentalPolicy.conditions}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Price + Form */}
          <div className="vehicle-bottom-right" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 28, border: "1px solid #e8eeee", position: "sticky", top: 90 }}>
              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: "#7a8a9e", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {isRent ? tr.pricePerDay : tr.priceLabel}
                </p>
                <p style={{ fontSize: 32, fontWeight: 800, color: TEAL_DARK, margin: 0, fontFamily: '"Inter Tight", system-ui, sans-serif', lineHeight: 1 }}>
                  {price}
                  {isRent && <span style={{ fontSize: 14, fontWeight: 400, color: "#7a8a9e", marginLeft: 4 }}>{tr.perDay}</span>}
                </p>
              </div>

              {/* Code Advantage */}
              <div style={{ marginBottom: 24, padding: 16, background: "#fff8e1", borderRadius: 12, border: "1px solid #ffe082" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ticket size={18} color="#f59e0b" />
                  <span style={{ fontWeight: 700, color: "#92400e", fontSize: 13 }}>{tr.codeAdvantage}</span>
                </div>
                <p style={{ marginTop: 6, fontSize: 12, color: "#a16207", lineHeight: 1.4 }}>{tr.codeAdvantageDesc}</p>
              </div>

              <div style={{ height: 1, background: "#e8eeee", margin: "0 0 24px" }} />

              {/* Inline Lead Form (reactive to current vehicle) */}
              <InlineLeadForm
                vehicleId={current.id}
                vehicleType={current.type}
                labels={leadLabels}
                orderLabel={isRent ? tr.orderRent : tr.orderBuy}
              />

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 0", borderRadius: 12, background: "#25d366", color: "#FFFFFF", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "background 0.2s ease", fontFamily: '"Inter Tight", system-ui, sans-serif' }}
              >
                <MessageCircle size={18} />
                {tr.contactWhatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Other vehicles ── */}
      {otherVehicles.length > 0 && (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 48px" }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#1a2332", fontFamily: '"Inter Tight", system-ui, sans-serif', textAlign: "center", marginBottom: 20, fontStyle: "italic" }}>
            {tr.otherVehicles}
          </Text>
          <Box style={{ position: "relative" }}>
            <UnstyledButton onClick={() => scrollOther("left")} className="other-nav-btn" style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: 8, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, border: "1px solid #d4dede", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <ChevronLeft size={18} color={TEAL_DARK} />
            </UnstyledButton>
            <UnstyledButton onClick={() => scrollOther("right")} className="other-nav-btn" style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: 8, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, border: "1px solid #d4dede", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <ChevronRight size={18} color={TEAL_DARK} />
            </UnstyledButton>
            <Box ref={scrollRef} className="hide-scrollbar" style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", padding: "4px 32px", scrollbarWidth: "none" }}>
              {otherVehicles.map((ov) => {
                const ovPhoto = ov.photos[0];
                const ovRent = ov.type === "RENT";
                return (
                  <Link key={ov.id} href={`/vehicule/${ov.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                    <Box className="other-card" style={{ width: 200, scrollSnapAlign: "start", borderRadius: 12, overflow: "hidden", background: "#FFFFFF", border: "1.5px solid #e4ecec", transition: "all 0.3s ease", cursor: "pointer" }}>
                      <Box style={{ position: "relative", height: 120, background: "#f0f5f5", overflow: "hidden" }}>
                        {ovPhoto ? (
                          <Image src={ovPhoto.url} alt={ov.title} fill style={{ objectFit: "cover" }} sizes="200px" />
                        ) : (
                          <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#b0bec5", fontSize: 11 }}>N/A</Box>
                        )}
                        <Badge size="xs" radius="sm" style={{ position: "absolute", top: 8, left: 8, background: ovRent ? "#e6f7f5" : TEAL_DARK, color: ovRent ? TEAL_DARK : "#FFFFFF", fontWeight: 700, fontSize: 9, border: "none" }}>
                          {ovRent ? tr.typeRent : tr.typeSale}
                        </Badge>
                      </Box>
                      <Box style={{ padding: "10px 12px 14px" }}>
                        <Text style={{ fontSize: 13, fontWeight: 700, color: "#1a2332", lineHeight: 1.2, fontFamily: '"Inter Tight", system-ui, sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ov.title}</Text>
                        <Text style={{ fontSize: 11, color: "#7a8a9e", marginTop: 2 }}>{ov.brand}</Text>
                        <Text style={{ fontSize: 13, fontWeight: 800, color: TEAL_DARK, marginTop: 6, fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                          {ovRent && ov.rentalPolicy?.pricePerDay ? formatPrice(ov.rentalPolicy.pricePerDay) : formatPrice(ov.pricePublic)}
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                );
              })}
            </Box>
          </Box>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .back-catalogue-btn:hover { background: #f0faf9 !important; border-color: ${TEAL} !important; color: ${TEAL} !important; }
        .big-arrow-btn { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0.7; cursor: pointer; }
        .big-arrow-btn:hover { opacity: 1; transform: translateY(-50%) scale(1.1); }
        .other-nav-btn:hover { background: #f0faf9 !important; border-color: ${TEAL} !important; }
        .other-card:hover { border-color: ${TEAL} !important; box-shadow: 0 4px 16px rgba(79,170,163,0.12) !important; transform: translateY(-2px); }
        .vehicle-bottom-grid { display: grid !important; grid-template-columns: 1fr 380px !important; gap: 32px !important; }
        .vehicle-bottom-left { grid-column: 1 / 2 !important; }
        .vehicle-bottom-right { grid-column: 2 / 3 !important; }
        @media (max-width: 1060px) {
          .showcase-3panel { grid-template-columns: 240px 1fr 240px !important; gap: 14px !important; }
          .big-arrow-btn { display: none !important; }
        }
        @media (max-width: 1024px) {
          .vehicle-bottom-grid { grid-template-columns: 1fr !important; }
          .vehicle-bottom-left, .vehicle-bottom-right { grid-column: 1 !important; }
        }
        @media (max-width: 900px) {
          .showcase-3panel { grid-template-columns: 1fr !important; gap: 14px !important; }
          .showcase-left { order: 2 !important; }
          .showcase-right { order: 3 !important; }
        }
        input:focus, textarea:focus { border-color: ${TEAL} !important; box-shadow: 0 0 0 3px rgba(79, 170, 163, 0.12); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ── Inline Lead Form (embedded, reactive to vehicleId) ── */
function InlineLeadForm({
  vehicleId,
  vehicleType,
  labels,
  orderLabel,
}: {
  vehicleId: string;
  vehicleType: "SALE" | "RENT";
  labels: Record<string, string>;
  orderLabel: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createLeadRequest(formData);
    if (result.success && result.codeA) {
      router.push(`/confirmation/${result.codeA}`);
    } else {
      setError(result.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1.5px solid #e0e8e8",
    padding: "12px 16px",
    fontSize: 14,
    color: "#1a2332",
    background: "#fafcfc",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "inherit",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a2332", margin: "0 0 4px", fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
        {labels.formTitle}
      </h3>
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <input type="hidden" name="requestType" value={vehicleType === "SALE" ? "BUY" : "RENT"} />
      <input name="clientName" type="text" required placeholder={labels.name} style={fieldStyle} />
      <input name="clientPhone" type="tel" required placeholder={labels.phone} style={fieldStyle} />
      <input name="clientCity" type="text" required placeholder={labels.city} style={fieldStyle} />
      <textarea name="message" rows={3} placeholder={labels.message} style={{ ...fieldStyle, resize: "none" }} />
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" name="consent" required style={{ marginTop: 3, width: 16, height: 16, accentColor: TEAL, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#7a8a9e", lineHeight: 1.4 }}>{labels.consent}</span>
      </label>
      {error && (
        <p style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", padding: "10px 14px", borderRadius: 10, margin: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 0",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 15,
          color: "#FFFFFF",
          background: TEAL_DARK,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "background 0.2s ease, opacity 0.2s ease",
          fontFamily: '"Inter Tight", system-ui, sans-serif',
        }}
      >
        {loading ? (
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <>
            <Send size={16} />
            {orderLabel}
          </>
        )}
      </button>
    </form>
  );
}
