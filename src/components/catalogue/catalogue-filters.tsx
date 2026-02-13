"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Box, Text, Group, UnstyledButton } from "@mantine/core";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

type Props = {
  brands: string[];
  cities: string[];
  currentFilters: Record<string, string | undefined>;
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1.5px solid #e0e8e8",
  padding: "10px 14px",
  fontSize: 14,
  color: "#1a2332",
  background: "#fafcfc",
  outline: "none",
  transition: "border-color 0.2s ease",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234FAAA3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1.5px solid #e0e8e8",
  padding: "10px 14px",
  fontSize: 14,
  color: "#1a2332",
  background: "#fafcfc",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#5a6a7e",
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
  marginBottom: 6,
  display: "block",
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
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <Box
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #e8eeee",
        position: "sticky",
        top: 90,
      }}
    >
      {/* Header */}
      <Group gap={10} mb={24}>
        <Box
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#e6f7f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SlidersHorizontal size={18} style={{ color: TEAL }} />
        </Box>
        <Text
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "#1a2332",
            fontFamily: '"Inter Tight", system-ui, sans-serif',
          }}
        >
          {t("filterType")}
        </Text>
      </Group>

      <Box style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Type */}
        <Box>
          <label style={labelStyle}>{t("filterType")}</label>
          <select
            style={selectStyle}
            value={currentFilters.type || "all"}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            <option value="all">{t("allTypes")}</option>
            <option value="SALE">{t("typeSale")}</option>
            <option value="RENT">{t("typeRent")}</option>
          </select>
        </Box>

        {/* Brand */}
        <Box>
          <label style={labelStyle}>{t("filterBrand")}</label>
          <select
            style={selectStyle}
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
        </Box>

        {/* City */}
        <Box>
          <label style={labelStyle}>{t("filterCity")}</label>
          <select
            style={selectStyle}
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
        </Box>

        {/* Fuel */}
        <Box>
          <label style={labelStyle}>{t("filterFuel")}</label>
          <select
            style={selectStyle}
            value={currentFilters.fuel || "all"}
            onChange={(e) => updateFilter("fuel", e.target.value)}
          >
            <option value="all">{t("allFuels")}</option>
            <option value="GASOLINE">{t("gasoline")}</option>
            <option value="DIESEL">{t("diesel")}</option>
            <option value="ELECTRIC">{t("electric")}</option>
            <option value="HYBRID">{t("hybrid")}</option>
            <option value="LPG">{t("lpg")}</option>
          </select>
        </Box>

        {/* Transmission */}
        <Box>
          <label style={labelStyle}>{t("filterTransmission")}</label>
          <select
            style={selectStyle}
            value={currentFilters.transmission || "all"}
            onChange={(e) => updateFilter("transmission", e.target.value)}
          >
            <option value="all">{t("allTransmissions")}</option>
            <option value="MANUAL">{t("manual")}</option>
            <option value="AUTOMATIC">{t("automatic")}</option>
          </select>
        </Box>

        {/* Price range */}
        <Box>
          <label style={labelStyle}>
            {t("filterPriceMin")} / {t("filterPriceMax")}
          </label>
          <Group gap={8} grow>
            <input
              type="number"
              placeholder="Min"
              style={inputStyle}
              defaultValue={currentFilters.priceMin || ""}
              onBlur={(e) => updateFilter("priceMin", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              style={inputStyle}
              defaultValue={currentFilters.priceMax || ""}
              onBlur={(e) => updateFilter("priceMax", e.target.value)}
            />
          </Group>
        </Box>

        {/* Sort */}
        <Box>
          <label style={labelStyle}>{t("sortBy")}</label>
          <select
            style={selectStyle}
            value={currentFilters.sort || "recent"}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="recent">{t("sortRecent")}</option>
            <option value="price_asc">{t("sortPriceAsc")}</option>
            <option value="price_desc">{t("sortPriceDesc")}</option>
            <option value="popular">{t("sortPopular")}</option>
          </select>
        </Box>

        {/* Reset */}
        <UnstyledButton
          onClick={() => router.push(pathname)}
          style={{
            width: "100%",
            padding: "12px 0",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: TEAL_DARK,
            background: "#e6f7f5",
            borderRadius: 10,
            transition: "background 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <RotateCcw size={15} />
          {t("resetFilters")}
        </UnstyledButton>
      </Box>

      {/* Focus styles */}
      <style>{`
        select:focus, input[type="number"]:focus {
          border-color: ${TEAL} !important;
          box-shadow: 0 0 0 3px rgba(79, 170, 163, 0.12);
        }
      `}</style>
    </Box>
  );
}
