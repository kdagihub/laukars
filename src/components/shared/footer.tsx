"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Box, Stack, Group, Text } from "@mantine/core";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: "#222222",
        color: "#9ca3af",
      }}
    >
      <Box style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <Group align="flex-start" justify="space-between" wrap="wrap" gap="xl">
          {/* Brand */}
          <Stack gap="md" style={{ flex: 1, minWidth: 200 }}>
            <Group gap="xs">
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: "#FFDB01",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Car size={20} color="#222" />
              </Box>
              <Text fw={700} size="xl" c="white">
                {t("common.appName")}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {t("footer.description")}
            </Text>
          </Stack>

          {/* Quick Links */}
          <Stack gap="xs">
            <Text size="sm" fw={600} c="white">
              {t("footer.quickLinks")}
            </Text>
            <Link href="/" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>
              {t("common.home")}
            </Link>
            <Link href="/catalogue" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>
              {t("common.catalogue")}
            </Link>
          </Stack>

          {/* Legal */}
          <Stack gap="xs">
            <Text size="sm" fw={600} c="white">
              {t("footer.legal")}
            </Text>
            <Text size="sm" c="dimmed">
              {t("footer.privacy")}
            </Text>
            <Text size="sm" c="dimmed">
              {t("footer.terms")}
            </Text>
          </Stack>

          {/* Contact */}
          <Stack gap="xs">
            <Text size="sm" fw={600} c="white">
              {t("footer.contactUs")}
            </Text>
            <Group gap="xs">
              <Mail size={16} />
              <Text size="sm" c="dimmed">
                contact@laukars.com
              </Text>
            </Group>
            <Group gap="xs">
              <Phone size={16} />
              <Text size="sm" c="dimmed">
                +237 6XX XXX XXX
              </Text>
            </Group>
            <Group gap="xs">
              <MapPin size={16} />
              <Text size="sm" c="dimmed">
                Douala, Cameroun
              </Text>
            </Group>
          </Stack>
        </Group>

        <Box
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid #374151",
          }}
        >
          <Text size="sm" c="dimmed" ta="center">
            &copy; {new Date().getFullYear()} {t("common.appName")}. {t("footer.rights")}.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
