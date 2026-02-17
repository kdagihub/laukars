"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Box, Text, Group, Stack, Button } from "@mantine/core";
import { ArrowRight, Eye, Shield, Heart, Zap, Target, Lightbulb } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

const VALUES = [
  { icon: Eye, titleKey: "value1Title", descKey: "value1Desc" },
  { icon: Shield, titleKey: "value2Title", descKey: "value2Desc" },
  { icon: Heart, titleKey: "value3Title", descKey: "value3Desc" },
  { icon: Zap, titleKey: "value4Title", descKey: "value4Desc" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <Box style={{ background: "#FFFFFF", paddingTop: 70 }}>
      {/* ══════════════════════════════════════
          HERO BANNER
         ══════════════════════════════════════ */}
      <Box
        style={{
          background: `linear-gradient(135deg, ${TEAL_DARK} 0%, #0f2e2b 100%)`,
          padding: "80px 48px 64px",
          textAlign: "center",
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
          {t("title")}
        </Text>
        <Text
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: '"Inter Tight", system-ui, sans-serif',
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          {t("title")}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
        >
          {t("subtitle")}
        </Text>
      </Box>

      {/* ══════════════════════════════════════
          MISSION + VISION
         ══════════════════════════════════════ */}
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 48px" }}>
        <Box
          className="mission-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
        >
          {/* Mission */}
          <Box
            style={{
              background: "#f8fbfb",
              borderRadius: 20,
              padding: "44px 36px",
              border: "1px solid #eaf1f0",
            }}
          >
            <Group gap={12} mb={20}>
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Target size={22} color="#FFFFFF" />
              </Box>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1a2332",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                }}
              >
                {t("missionTitle")}
              </Text>
            </Group>
            <Text
              style={{
                fontSize: 15,
                color: "#5a6a7a",
                lineHeight: 1.8,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("missionText")}
            </Text>
          </Box>

          {/* Vision */}
          <Box
            style={{
              background: "#f8fbfb",
              borderRadius: 20,
              padding: "44px 36px",
              border: "1px solid #eaf1f0",
            }}
          >
            <Group gap={12} mb={20}>
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lightbulb size={22} color="#FFFFFF" />
              </Box>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1a2332",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                }}
              >
                {t("visionTitle")}
              </Text>
            </Group>
            <Text
              style={{
                fontSize: 15,
                color: "#5a6a7a",
                lineHeight: 1.8,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("visionText")}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          NOS VALEURS
         ══════════════════════════════════════ */}
      <Box style={{ background: "#f6fafa", padding: "80px 0" }}>
        <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <Box style={{ textAlign: "center", marginBottom: 56 }}>
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
              {t("valuesTitle")}
            </Text>
            <Text
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 900,
                color: "#1a2332",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                lineHeight: 1.15,
              }}
            >
              {t("valuesTitle")}
            </Text>
            <Box
              style={{
                width: 50,
                height: 3,
                background: TEAL,
                borderRadius: 2,
                margin: "16px auto 0",
              }}
            />
          </Box>

          <Group
            className="values-grid"
            justify="center"
            align="stretch"
            gap={24}
            wrap="wrap"
          >
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <Box
                  key={val.titleKey}
                  className="value-card"
                  style={{
                    flex: "1 1 240px",
                    maxWidth: 290,
                    background: "#FFFFFF",
                    borderRadius: 16,
                    padding: "40px 28px 36px",
                    textAlign: "center",
                    border: "1px solid #eaf1f0",
                    transition: "all 0.3s ease",
                  }}
                >
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
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#1a2332",
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      marginBottom: 10,
                    }}
                  >
                    {t(val.titleKey)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6b7c8f",
                      lineHeight: 1.7,
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                    }}
                  >
                    {t(val.descKey)}
                  </Text>
                </Box>
              );
            })}
          </Group>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          STATS
         ══════════════════════════════════════ */}
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 48px" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 11,
            fontWeight: 700,
            color: TEAL,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 40,
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
        >
          {t("statsTitle")}
        </Text>
        <Group justify="center" gap={48} wrap="wrap">
          {stats.map((stat, i) => (
            <Stack key={i} align="center" gap={4} style={{ minWidth: 140 }}>
              <Text
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: TEAL_DARK,
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7c8f",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </Text>
            </Stack>
          ))}
        </Group>
      </Box>

      {/* ══════════════════════════════════════
          CTA FINAL
         ══════════════════════════════════════ */}
      <Box
        style={{
          background: `linear-gradient(135deg, ${TEAL_DARK} 0%, #0f2e2b 100%)`,
          padding: "64px 48px",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: '"Inter Tight", system-ui, sans-serif',
            marginBottom: 12,
          }}
        >
          {t("ctaTitle")}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 32,
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
        >
          {t("ctaText")}
        </Text>
        <Group justify="center" gap={16}>
          <Button
            component={Link}
            href="/catalogue"
            size="xl"
            radius="xl"
            rightSection={<ArrowRight size={18} />}
            style={{
              background: TEAL,
              border: "none",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 36px",
              height: "auto",
              color: "#FFFFFF",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {t("ctaCatalogue")}
          </Button>
          <Button
            component={Link}
            href="/contact"
            size="xl"
            radius="xl"
            variant="outline"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 36px",
              height: "auto",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            {t("ctaContact")}
          </Button>
        </Group>
      </Box>

      {/* ── Responsive ── */}
      <style>{`
        .value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 36px rgba(79, 170, 163, 0.12);
          border-color: ${TEAL} !important;
        }
        @media (max-width: 768px) {
          .mission-grid {
            grid-template-columns: 1fr !important;
          }
          .values-grid {
            flex-direction: column !important;
            align-items: center !important;
          }
          .value-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </Box>
  );
}
