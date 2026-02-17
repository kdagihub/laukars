"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Text, Group } from "@mantine/core";
import { ShieldCheck, BadgePercent, Headset, Ticket } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

const ADVANTAGES = [
  { icon: ShieldCheck, titleKey: "advantage1Title", descKey: "advantage1Desc" },
  { icon: BadgePercent, titleKey: "advantage2Title", descKey: "advantage2Desc" },
  { icon: Headset, titleKey: "advantage3Title", descKey: "advantage3Desc" },
  { icon: Ticket, titleKey: "advantage4Title", descKey: "advantage4Desc" },
];

export function WhyChooseUs() {
  const t = useTranslations("landing");
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      style={{
        background: "#FFFFFF",
        padding: "96px 0 104px",
        overflow: "hidden",
      }}
    >
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
        {/* ── Header ── */}
        <Box
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s ease",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEAL,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {t("whyUs")}
          </Text>
          <Text
            style={{
              fontSize: "clamp(26px, 3vw, 40px)",
              fontWeight: 900,
              color: "#1a2332",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              lineHeight: 1.15,
            }}
          >
            {t("whyUs")}
          </Text>
          <Box
            style={{
              width: 50,
              height: 3,
              background: TEAL,
              borderRadius: 2,
              margin: "18px auto 0",
            }}
          />
        </Box>

        {/* ── Cards grid ── */}
        <Group
          className="why-grid"
          justify="center"
          align="stretch"
          gap={24}
          wrap="wrap"
        >
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <Box
                key={adv.titleKey}
                className="why-card"
                style={{
                  flex: "1 1 240px",
                  maxWidth: 290,
                  background: "#f8fbfb",
                  borderRadius: 16,
                  padding: "40px 28px 36px",
                  textAlign: "center",
                  border: "1px solid #eaf1f0",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.6s ease ${0.15 + idx * 0.12}s`,
                  cursor: "default",
                }}
              >
                {/* Icon container */}
                <Box
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <Icon size={28} color="#FFFFFF" strokeWidth={1.8} />
                </Box>

                {/* Title */}
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#1a2332",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {t(adv.titleKey)}
                </Text>

                {/* Description */}
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6b7c8f",
                    lineHeight: 1.7,
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  {t(adv.descKey)}
                </Text>
              </Box>
            );
          })}
        </Group>
      </Box>

      {/* ── Styles ── */}
      <style>{`
        .why-card {
          transition-property: all;
        }
        .why-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 14px 36px rgba(79, 170, 163, 0.12);
          border-color: ${TEAL} !important;
        }
        @media (max-width: 768px) {
          .why-grid {
            flex-direction: column !important;
            align-items: center !important;
          }
          .why-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </Box>
  );
}
