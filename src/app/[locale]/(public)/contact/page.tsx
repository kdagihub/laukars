"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Text, Group, Stack, TextInput, Textarea, Button } from "@mantine/core";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2250797969394";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Box style={{ background: "#FFFFFF", paddingTop: 70 }}>
      {/* ── Hero banner ── */}
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

      {/* ── Content ── */}
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 48px 96px" }}>
        <Box
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* ── Left: Form ── */}
          <Box>
            {sent ? (
              <Box
                style={{
                  background: "#f0faf9",
                  borderRadius: 16,
                  padding: "48px 32px",
                  textAlign: "center",
                  border: `1px solid ${TEAL}`,
                }}
              >
                <Box
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: TEAL,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Send size={28} color="#FFFFFF" />
                </Box>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1a2332",
                    fontFamily: '"Inter Tight", system-ui, sans-serif',
                    marginBottom: 8,
                  }}
                >
                  {t("formSuccess")}
                </Text>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack gap={20}>
                  <Group grow gap={16}>
                    <TextInput
                      label={t("formName")}
                      placeholder="Jean Kouassi"
                      required
                      radius="md"
                      size="md"
                      styles={{
                        label: { fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#1a2332" },
                        input: { borderColor: "#e0e6ea", fontSize: 14 },
                      }}
                    />
                    <TextInput
                      label={t("formEmail")}
                      placeholder="jean@example.com"
                      type="email"
                      required
                      radius="md"
                      size="md"
                      styles={{
                        label: { fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#1a2332" },
                        input: { borderColor: "#e0e6ea", fontSize: 14 },
                      }}
                    />
                  </Group>
                  <Group grow gap={16}>
                    <TextInput
                      label={t("formPhone")}
                      placeholder="+225 07 XX XX XX XX"
                      radius="md"
                      size="md"
                      styles={{
                        label: { fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#1a2332" },
                        input: { borderColor: "#e0e6ea", fontSize: 14 },
                      }}
                    />
                    <TextInput
                      label={t("formSubject")}
                      placeholder="Achat véhicule"
                      required
                      radius="md"
                      size="md"
                      styles={{
                        label: { fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#1a2332" },
                        input: { borderColor: "#e0e6ea", fontSize: 14 },
                      }}
                    />
                  </Group>
                  <Textarea
                    label={t("formMessage")}
                    placeholder="Décrivez votre demande..."
                    required
                    radius="md"
                    size="md"
                    minRows={5}
                    styles={{
                      label: { fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#1a2332" },
                      input: { borderColor: "#e0e6ea", fontSize: 14 },
                    }}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    radius="xl"
                    rightSection={<Send size={16} />}
                    style={{
                      background: TEAL_DARK,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      padding: "14px 36px",
                      height: "auto",
                      alignSelf: "flex-start",
                    }}
                  >
                    {t("formSubmit")}
                  </Button>
                </Stack>
              </form>
            )}
          </Box>

          {/* ── Right: Contact info ── */}
          <Box>
            <Stack gap={32}>
              {/* Info title */}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: TEAL,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                }}
              >
                {t("infoTitle")}
              </Text>

              {/* Info cards */}
              {[
                { icon: MapPin, label: t("infoAddress") },
                { icon: Phone, label: t("infoPhone") },
                { icon: Mail, label: t("infoEmail") },
                { icon: Clock, label: t("infoHours") },
              ].map((item, i) => (
                <Group key={i} gap={16} wrap="nowrap" align="flex-start">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#f0faf9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={20} color={TEAL_DARK} />
                  </Box>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#1a2332",
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      fontWeight: 500,
                      lineHeight: 1.6,
                      paddingTop: 12,
                    }}
                  >
                    {item.label}
                  </Text>
                </Group>
              ))}

              {/* WhatsApp CTA */}
              <Button
                component="a"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius="xl"
                leftSection={<MessageCircle size={18} />}
                style={{
                  background: "#25D366",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                  padding: "14px 32px",
                  height: "auto",
                  alignSelf: "flex-start",
                  color: "#FFFFFF",
                }}
              >
                {t("whatsappCta")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </Box>
  );
}
