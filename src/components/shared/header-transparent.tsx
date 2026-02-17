"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Globe, User } from "lucide-react";
import { Box, Group, Burger, Stack, UnstyledButton } from "@mantine/core";
import { LaukarsLogo } from "./laukars-logo";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

export function HeaderTransparent() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const otherLocale = locale === "fr" ? "en" : "fr";

  /* Navigation items — routes internes vs liens simples */
  const navItems: Array<{
    label: string;
    href: string;
    isRoute: boolean;
  }> = [
    { label: t("home"), href: "/", isRoute: true },
    { label: t("catalogue"), href: "/catalogue", isRoute: true },
    { label: t("contact"), href: "/contact", isRoute: true },
    { label: t("about"), href: "/a-propos", isRoute: true },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  const navLinkStyle = (active: boolean) =>
    ({
      textDecoration: "none",
      fontSize: 14,
      fontWeight: active ? 600 : 500,
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      color: active ? TEAL : "#555555",
      borderBottom: active
        ? `2px solid ${TEAL}`
        : "2px solid transparent",
      paddingBottom: 4,
      transition: "color 0.2s, border-color 0.2s",
      cursor: "pointer",
    }) as const;

  const rightLinkStyle = {
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Inter Tight", system-ui, sans-serif',
    color: "#555555",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
  } as const;

  return (
    <Box
      component="header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#FFFFFF",
        padding: "0 48px",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <Group justify="space-between" align="center" style={{ height: 70 }}>
        {/* Logo */}
        <LaukarsLogo />

        {/* Desktop Navigation – centre */}
        <Group gap={36} visibleFrom="md">
          {navItems.map((item) => {
            const active = item.isRoute && isActiveRoute(item.href);
            const style = navLinkStyle(active);

            return item.isRoute ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <Link key={item.label} href={item.href as any} style={style}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} style={style}>
                {item.label}
              </a>
            );
          })}
        </Group>

        {/* Right side – langue, connexion, inscription */}
        <Group gap="lg" visibleFrom="md">
          <UnstyledButton
            component="a"
            href={`/${otherLocale}${pathname}`}
            style={rightLinkStyle}
          >
            <Globe size={15} />
            {otherLocale.toUpperCase()}
          </UnstyledButton>

          <Link href="/login" style={rightLinkStyle}>
            <User size={15} />
            {t("login")}
          </Link>

          <Link
            href="/login"
            style={{
              ...rightLinkStyle,
              fontWeight: 600,
              color: TEAL_DARK,
              padding: "7px 18px",
              borderRadius: 8,
              border: `1.5px solid ${TEAL_DARK}`,
              gap: 0,
            }}
          >
            {t("register")}
          </Link>
        </Group>

        {/* Mobile burger */}
        <Burger
          opened={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          color="#222"
          hiddenFrom="md"
        />
      </Group>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <Box
          hiddenFrom="md"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(12px)",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <Stack gap="xs">
            {navItems.map((item) => {
              const active = item.isRoute && isActiveRoute(item.href);
              const style = {
                textDecoration: "none",
                fontSize: 15,
                fontWeight: active ? 600 : 500,
                color: active ? TEAL : "#333",
                padding: "10px 0",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              } as const;

              return item.isRoute ? (
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  key={item.label}
                  href={item.href as any}
                  onClick={() => setMobileMenuOpen(false)}
                  style={style}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={style}
                >
                  {item.label}
                </a>
              );
            })}

            <UnstyledButton
              component="a"
              href={`/${otherLocale}${pathname}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 15,
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 0",
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              <Globe size={16} />
              {otherLocale === "fr" ? "Français" : "English"}
            </UnstyledButton>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "#fff",
                backgroundColor: TEAL_DARK,
                padding: "12px",
                borderRadius: 8,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: '"Inter Tight", system-ui, sans-serif',
              }}
            >
              {t("login")}
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
