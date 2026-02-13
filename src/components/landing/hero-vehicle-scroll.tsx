"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Box, Title, Text, Button, Group } from "@mantine/core";
import { ArrowRight, Instagram, Share2, Phone } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";
const PADDING_X = 48;
const SLIDE_DURATION = 5000;

/* ── Données des slides ── */
const SLIDES = [
  {
    image: "/kia.png",
    alt: "Kia Sportage",
    specs: {
      topSpeed: "180 Km/h",
      accel: "0-100 Km/h 8.0 Sec",
      fuel: "Essence",
      fuelRatio: "1:15 /L",
      engine: "2.000 CC",
      hp: "166 Hp",
    },
  },
  {
    image: "/slide4-removebg-preview.png",
    alt: "SUV Premium",
    specs: {
      topSpeed: "210 Km/h",
      accel: "0-100 Km/h 6.9 Sec",
      fuel: "Essence",
      fuelRatio: "1:8 /L",
      engine: "5.600 CC",
      hp: "400 Hp",
    },
  },
  {
    image: "/slide2-removebg-preview.png",
    alt: "Berline Compacte",
    specs: {
      topSpeed: "195 Km/h",
      accel: "0-100 Km/h 9.2 Sec",
      fuel: "Diesel",
      fuelRatio: "1:18 /L",
      engine: "1.600 CC",
      hp: "130 Hp",
    },
  },
];

export function HeroVehicleScroll() {
  const t = useTranslations();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [next]);

  const specs = SLIDES[current].specs;

  return (
    <Box component="section" style={{ background: "#FFFFFF" }}>
      <Box
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          padding: `140px ${PADDING_X}px 40px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ══════════════════════════════════════════
            FORMES TEAL — z-index 1 (DERRIÈRE la voiture)
           ══════════════════════════════════════════ */}
        <Box
          className="teal-shape-main"
          style={{
            position: "absolute",
            top: -300,
            right: 40,
            width: 650,
            height: 1100,
            background: TEAL,
            transform: "rotate(-22deg)",
            borderRadius: 60,
            zIndex: 1,
          }}
        />
        <Box
          className="teal-shape-accent"
          style={{
            position: "absolute",
            top: 10,
            right: 560,
            width: 70,
            height: 560,
            background: TEAL,
            transform: "rotate(-22deg)",
            borderRadius: 24,
            zIndex: 1,
          }}
        />

        {/* ── Barre latérale décorative ── */}
        <Box
          className="side-decor"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            zIndex: 10,
          }}
        >
          <Box style={{ width: 1, height: 36, background: "#d0d0d0" }} />
          <Box
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#bbb",
            }}
          />
          <Box style={{ width: 1, height: 36, background: "#d0d0d0" }} />
          <Instagram size={14} color="#999" style={{ cursor: "pointer" }} />
          <Share2 size={14} color="#999" style={{ cursor: "pointer" }} />
        </Box>

        {/* ══════════════════════════════════════════
            HERO CONTENT — z-index 2+ (AU-DESSUS des formes)
           ══════════════════════════════════════════ */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flex: 1,
            position: "relative",
            zIndex: 2,
            maxWidth: 1400,
            width: "100%",
            marginLeft: 32,
          }}
          className="hero-flex"
        >
          {/* ── Gauche : Texte ── */}
          <Box
            style={{ flex: "0 0 35%", maxWidth: 540, zIndex: 5 }}
            className="hero-text"
          >
            <Title
              order={1}
              style={{
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                whiteSpace: "nowrap",
              }}
            >
              {t("landing.heroTitleLine1")}
              <br />
              <Text component="span" inherit style={{ color: TEAL }}>
                {t("landing.heroTitleLine2")}
              </Text>
            </Title>

            <Text
              style={{
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.75,
                color: "#888888",
                marginTop: 24,
                maxWidth: 440,
              }}
            >
              {t("landing.heroSubtitle")}
            </Text>

            <Group gap={16} mt={36} wrap="wrap">
              <Button
                component={Link}
                href="/catalogue"
                size="xl"
                radius="xl"
                rightSection={<ArrowRight size={18} />}
                className="cta-btn"
                style={{
                  backgroundColor: TEAL_DARK,
                  color: "#FFFFFF",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "14px 36px",
                  height: "auto",
                  border: "none",
                }}
              >
                {t("landing.discover")}
              </Button>

              <Button
                component="a"
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237600000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                size="xl"
                radius="xl"
                leftSection={<Phone size={18} />}
                className="cta-btn"
                style={{
                  backgroundColor: "transparent",
                  color: TEAL_DARK,
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "14px 36px",
                  height: "auto",
                  border: `2px solid ${TEAL_DARK}`,
                }}
              >
                {t("landing.ctaAppointment")}
              </Button>
            </Group>
          </Box>

          {/* ── Droite : Slider voitures (z-index 4, AU-DESSUS des bandes teal) ── */}
          <Box
            style={{
              flex: 1,
              position: "relative",
              zIndex: 4,
              height: 480,
            }}
            className="hero-image-container"
          >
            {SLIDES.map((slide, index) => (
              <Box
                key={slide.image}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  opacity: current === index ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  pointerEvents: current === index ? "auto" : "none",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1000}
                  height={660}
                  priority={index === 0}
                  style={{
                    width: 780,
                    height: "auto",
                    objectFit: "contain",
                    transform: "translateX(140px)",
                    flexShrink: 0,
                  }}
                />
              </Box>
            ))}

            {/* Dots de pagination (cliquables) */}
            <Group
              gap={8}
              style={{
                position: "absolute",
                bottom: 10,
                right: 60,
                zIndex: 6,
              }}
            >
              {SLIDES.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor:
                      current === i ? TEAL : "transparent",
                    border: `2px solid ${current === i ? TEAL : "rgba(79,170,163,0.4)"}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Group>
          </Box>
        </Box>

        {/* ══════════════════════════════════════════
            SPECS — changent avec le slide actif
           ══════════════════════════════════════════ */}
        <Box
          style={{
            position: "relative",
            zIndex: 5,
            marginTop: 44,
            marginLeft: 32,
            borderTop: "1px solid #e5e5e5",
            paddingTop: 28,
            display: "flex",
            gap: 64,
          }}
          className="specs-section"
        >
          {/* PERFORMANCE */}
          <Box key={`perf-${current}`} className="spec-fade">
            <Text
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#1a1a1a",
                letterSpacing: "0.08em",
                marginBottom: 12,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("landing.specPerformance")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#aaa",
                marginBottom: 4,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("landing.specTopSpeed")}
            </Text>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.topSpeed}
            </Text>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.accel}
            </Text>
          </Box>

          {/* SPECIFICATION */}
          <Box key={`spec-${current}`} className="spec-fade">
            <Text
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#1a1a1a",
                letterSpacing: "0.08em",
                marginBottom: 12,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("landing.specSpecification")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#aaa",
                marginBottom: 4,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.fuel}
            </Text>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.fuelRatio}
            </Text>
          </Box>

          {/* INTERIOR */}
          <Box key={`int-${current}`} className="spec-fade">
            <Text
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#1a1a1a",
                letterSpacing: "0.08em",
                marginBottom: 12,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("landing.specInterior")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#aaa",
                marginBottom: 4,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("landing.specPower")}
            </Text>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.engine}
            </Text>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#1a1a1a",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {specs.hp}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════
          STYLES
         ══════════════════════════════════════════ */}
      <style>{`
        .cta-btn:hover {
          background-color: #1a4e4a !important;
        }

        @keyframes specFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spec-fade {
          animation: specFadeIn 0.5s ease-out;
        }

        @media (max-width: 900px) {
          .hero-flex {
            flex-direction: column !important;
            margin-left: 0 !important;
            text-align: center;
          }
          .hero-text {
            flex: 1 1 auto !important;
            max-width: 100% !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-image-container {
            max-width: 420px;
            margin: 0 auto;
          }
          .teal-shape-main {
            width: 350px !important;
            height: 650px !important;
            right: -80px !important;
            top: 40px !important;
          }
          .teal-shape-accent {
            display: none !important;
          }
          .side-decor {
            display: none !important;
          }
          .specs-section {
            margin-left: 0 !important;
            justify-content: center;
            flex-wrap: wrap !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </Box>
  );
}
