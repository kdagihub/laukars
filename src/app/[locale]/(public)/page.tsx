import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  BadgeDollarSign,
  HeadphonesIcon,
  Ticket,
  Car,
  Users,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100 sm:text-xl">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/catalogue"
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-colors"
              >
                {t("landing.ctaCatalogue")}
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t("landing.ctaContact")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Car className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">50+</p>
                <p className="text-sm text-gray-500">{t("landing.statsVehicles")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">200+</p>
                <p className="text-sm text-gray-500">{t("landing.statsClients")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10+</p>
                <p className="text-sm text-gray-500">{t("landing.statsCities")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("landing.whyUs")}
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: t("landing.advantage1Title"),
                desc: t("landing.advantage1Desc"),
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: BadgeDollarSign,
                title: t("landing.advantage2Title"),
                desc: t("landing.advantage2Desc"),
                color: "bg-green-100 text-green-700",
              },
              {
                icon: HeadphonesIcon,
                title: t("landing.advantage3Title"),
                desc: t("landing.advantage3Desc"),
                color: "bg-purple-100 text-purple-700",
              },
              {
                icon: Ticket,
                title: t("landing.advantage4Title"),
                desc: t("landing.advantage4Desc"),
                color: "bg-amber-100 text-amber-700",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("landing.heroTitle")}
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-8">
            <Link
              href="/catalogue"
              className="inline-block rounded-xl bg-white px-10 py-4 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-colors"
            >
              {t("landing.ctaCatalogue")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
