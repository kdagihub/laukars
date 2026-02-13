"use client";

import { usePathname } from "@/i18n/routing";
import { Footer } from "./footer";

/** Affiche le footer uniquement sur les pages autres que la landing */
export function ConditionalFooter() {
  const pathname = usePathname();
  const isLanding = pathname === "/" || pathname === "";

  if (isLanding) return null;
  return <Footer />;
}
