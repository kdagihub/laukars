"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Box, Group, Text, Stack } from "@mantine/core";
import { Mail, Phone, MapPin } from "lucide-react";

const TEAL = "#4FAAA3";
const BG_DARK = "#0f2e2b";
const BG_DARKER = "#0a1f1d";
const TEXT_MUTED = "rgba(255,255,255,0.45)";
const TEXT_LIGHT = "rgba(255,255,255,0.75)";

const HEADING_STYLE = {
  fontSize: 12,
  fontWeight: 700,
  color: TEAL,
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 16,
  fontFamily: '"Inter Tight", system-ui, sans-serif',
} as const;

const LINK_STYLE = {
  textDecoration: "none",
  fontSize: 14,
  color: TEXT_LIGHT,
  fontFamily: '"Inter Tight", system-ui, sans-serif',
  transition: "color 0.2s ease",
  cursor: "pointer",
  lineHeight: 2.1,
} as const;

export function LandingFooter() {
  const t = useTranslations();

  return (
    <Box
      component="footer"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG_DARKER} 100%)`,
      }}
    >
      <Box
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* ── Grid 4 colonnes ── */}
        <Box
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
            gap: "40px 48px",
            alignItems: "start",
          }}
        >
          {/* Col 1 — Logo + description */}
          <Box>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              LAU
              <Text
                component="span"
                inherit
                style={{ color: TEAL }}
              >
                KARS
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: TEXT_MUTED,
                lineHeight: 1.75,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                maxWidth: 280,
              }}
            >
              {t("footer.description")}
            </Text>
          </Box>

          {/* Col 2 — Navigation */}
          <Box>
            <Text style={HEADING_STYLE}>
              {t("footer.quickLinks")}
            </Text>
            <Stack gap={0}>
              <Link href="/" style={LINK_STYLE}>
                {t("common.home")}
              </Link>
              <Link href="/catalogue" style={LINK_STYLE}>
                {t("common.catalogue")}
              </Link>
              <Link href="/contact" style={LINK_STYLE}>
                {t("common.contact")}
              </Link>
              <Link href="/a-propos" style={LINK_STYLE}>
                {t("common.about")}
              </Link>
            </Stack>
          </Box>

          {/* Col 3 — Légal */}
          <Box>
            <Text style={HEADING_STYLE}>
              {t("footer.legal")}
            </Text>
            <Stack gap={0}>
              <Text style={LINK_STYLE}>{t("footer.privacy")}</Text>
              <Text style={LINK_STYLE}>{t("footer.terms")}</Text>
            </Stack>
          </Box>

          {/* Col 4 — Contact */}
          <Box>
            <Text style={HEADING_STYLE}>
              {t("footer.contactUs")}
            </Text>
            <Stack gap={14}>
              <Group gap={10} wrap="nowrap">
                <Mail size={15} style={{ color: TEAL, flexShrink: 0 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: TEXT_LIGHT,
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  contact@laukars.com
                </Text>
              </Group>
              <Group gap={10} wrap="nowrap">
                <Phone size={15} style={{ color: TEAL, flexShrink: 0 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: TEXT_LIGHT,
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  +225 07 97 96 93 94
                </Text>
              </Group>
              <Group gap={10} wrap="nowrap">
                <MapPin size={15} style={{ color: TEAL, flexShrink: 0 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: TEXT_LIGHT,
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                  }}
                >
                  Abidjan, Côte d&apos;Ivoire
                </Text>
              </Group>
            </Stack>
          </Box>
        </Box>

        {/* ── Separator ── */}
        <Box
          style={{
            marginTop: 48,
            borderTop: "1px solid rgba(79, 170, 163, 0.15)",
          }}
        />

        {/* ── Copyright ── */}
        <Box style={{ padding: "24px 0" }}>
          <Text
            style={{
              fontSize: 13,
              color: TEXT_MUTED,
              textAlign: "center",
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            &copy; {new Date().getFullYear()} {t("common.appName")}. {t("footer.rights")}.
          </Text>
        </Box>
      </Box>

      {/* ── Responsive + hover ── */}
      <style>{`
        .footer-grid a:hover,
        .footer-grid span:hover {
          color: ${TEAL} !important;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Box>
  );
}
