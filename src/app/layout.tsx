import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laukars",
  description: "Votre courtier automobile de confiance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
