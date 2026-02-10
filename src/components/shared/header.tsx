"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("home"), href: "/" as const },
    { name: t("catalogue"), href: "/catalogue" as const },
  ];

  const otherLocale = locale === "fr" ? "en" : "fr";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {t("appName")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {/* Language Switcher */}
            <a
              href={`/${otherLocale}${pathname}`}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {otherLocale.toUpperCase()}
            </a>

            {/* Login */}
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {t("login")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden -m-2.5 p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={`/${otherLocale}${pathname}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Globe className="h-4 w-4" />
                {otherLocale === "fr" ? "Français" : "English"}
              </a>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                {t("login")}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
