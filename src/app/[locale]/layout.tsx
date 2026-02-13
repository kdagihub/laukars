import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter_Tight } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { routing } from "@/i18n/routing";
import { HeaderTransparent } from "@/components/shared/header-transparent";
import { ConditionalFooter } from "@/components/shared/conditional-footer";
import { laukarsTheme } from "@/lib/theme";
import "../globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: {
    default: "Laukars - Votre courtier automobile de confiance",
    template: "%s | Laukars",
  },
  description:
    "Plateforme de vente et location de véhicules. Service personnalisé, prix transparents, suivi complet.",
  keywords: [
    "voiture",
    "véhicule",
    "achat",
    "location",
    "courtier",
    "automobile",
  ],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body
        className={interTight.variable}
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          margin: 0,
          minHeight: "100vh",
        }}
        suppressHydrationWarning
      >
        <MantineProvider theme={laukarsTheme}>
          <NextIntlClientProvider messages={messages}>
            <HeaderTransparent />
            <main style={{ flex: 1 }}>{children}</main>
            <ConditionalFooter />
          </NextIntlClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
