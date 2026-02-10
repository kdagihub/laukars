"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">
                {t("common.appName")}
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("common.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("common.catalogue")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-gray-400">
                  {t("footer.privacy")}
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-400">
                  {t("footer.terms")}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.contactUs")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                contact@laukars.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +237 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Douala, Cameroun
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t("common.appName")}.{" "}
            {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
