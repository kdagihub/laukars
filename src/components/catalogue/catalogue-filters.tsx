"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  brands: string[];
  cities: string[];
  currentFilters: Record<string, string | undefined>;
};

export function CatalogueFilters({ brands, cities, currentFilters }: Props) {
  const t = useTranslations("catalogue");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset page on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900">{t("filterType")}</h2>
      </div>

      <div className="space-y-5">
        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterType")}
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.type || "all"}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            <option value="all">{t("allTypes")}</option>
            <option value="SALE">{t("typeSale")}</option>
            <option value="RENT">{t("typeRent")}</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterBrand")}
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.brand || "all"}
            onChange={(e) => updateFilter("brand", e.target.value)}
          >
            <option value="all">{t("allBrands")}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterCity")}
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.city || "all"}
            onChange={(e) => updateFilter("city", e.target.value)}
          >
            <option value="all">{t("allCities")}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterFuel")}
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.fuel || "all"}
            onChange={(e) => updateFilter("fuel", e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="GASOLINE">Essence</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Électrique</option>
            <option value="HYBRID">Hybride</option>
            <option value="LPG">GPL</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterTransmission")}
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.transmission || "all"}
            onChange={(e) => updateFilter("transmission", e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="MANUAL">Manuelle</option>
            <option value="AUTOMATIC">Automatique</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("filterPriceMin")} / {t("filterPriceMax")}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={currentFilters.priceMin || ""}
              onBlur={(e) => updateFilter("priceMin", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={currentFilters.priceMax || ""}
              onBlur={(e) => updateFilter("priceMax", e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            <Search className="h-4 w-4 inline mr-1" />
            Trier par
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.sort || "recent"}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="recent">{t("sortRecent")}</option>
            <option value="price_asc">{t("sortPriceAsc")}</option>
            <option value="price_desc">{t("sortPriceDesc")}</option>
            <option value="popular">{t("sortPopular")}</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => router.push(pathname)}
          className="w-full mt-2 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}
