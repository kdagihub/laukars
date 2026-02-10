"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { createVehicle } from "@/app/actions/admin";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NewVehiclePage() {
  const t = useTranslations("admin");
  const tVehicle = useTranslations("vehicle");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState("SALE");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createVehicle(formData);

    if (result.success) {
      router.push("/admin/vehicules");
    } else {
      setError(result.error || "Erreur");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/vehicules"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("newVehicle")}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Type */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Type</label>
            <select
              name="type"
              className={inputClass}
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="SALE">Vente</option>
              <option value="RENT">Location</option>
            </select>
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Titre</label>
            <input name="title" required className={inputClass} placeholder="Ex: Toyota Corolla 2020 - Excellent état" />
          </div>

          {/* Brand / Model */}
          <div>
            <label className={labelClass}>{tVehicle("brand")}</label>
            <input name="brand" required className={inputClass} placeholder="Toyota" />
          </div>
          <div>
            <label className={labelClass}>{tVehicle("model")}</label>
            <input name="model" required className={inputClass} placeholder="Corolla" />
          </div>

          {/* Year / Mileage */}
          <div>
            <label className={labelClass}>{tVehicle("year")}</label>
            <input name="year" type="number" required min="1990" max="2027" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{tVehicle("mileage")} (km)</label>
            <input name="mileage" type="number" required min="0" className={inputClass} />
          </div>

          {/* Fuel / Transmission */}
          <div>
            <label className={labelClass}>{tVehicle("fuel")}</label>
            <select name="fuel" className={inputClass}>
              <option value="GASOLINE">{tVehicle("gasoline")}</option>
              <option value="DIESEL">{tVehicle("diesel")}</option>
              <option value="ELECTRIC">{tVehicle("electric")}</option>
              <option value="HYBRID">{tVehicle("hybrid")}</option>
              <option value="LPG">{tVehicle("lpg")}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{tVehicle("transmission")}</label>
            <select name="transmission" className={inputClass}>
              <option value="MANUAL">{tVehicle("manual")}</option>
              <option value="AUTOMATIC">{tVehicle("automatic")}</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className={labelClass}>{tVehicle("city")}</label>
            <input name="city" required className={inputClass} placeholder="Douala" />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Statut</label>
            <select name="status" className={inputClass}>
              <option value="DRAFT">{t("draft")}</option>
              <option value="PUBLISHED">{t("published")}</option>
            </select>
          </div>

          {/* Prices */}
          <div>
            <label className={labelClass}>{t("publicPrice")} (FCFA)</label>
            <input name="pricePublic" type="number" required min="1" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("supplierPrice")} (FCFA)</label>
            <input name="priceSupplier" type="number" required min="1" className={inputClass} />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className={labelClass}>{tVehicle("description")}</label>
            <textarea name="description" rows={4} className={`${inputClass} resize-none`} />
          </div>

          {/* Photo URL (simplified for MVP) */}
          <div className="sm:col-span-2">
            <label className={labelClass}>URL de la photo principale</label>
            <input name="photoUrl" type="url" className={inputClass} placeholder="https://..." />
          </div>

          {/* Rental Policy (conditional) */}
          {vehicleType === "RENT" && (
            <>
              <div className="sm:col-span-2 mt-4 p-5 bg-green-50 rounded-xl border border-green-100">
                <h3 className="font-semibold text-green-900 mb-4">{tVehicle("rentalPolicy")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>{tVehicle("pricePerDay")}</label>
                    <input name="pricePerDay" type="number" min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{tVehicle("pricePerWeek")}</label>
                    <input name="pricePerWeek" type="number" min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{tVehicle("pricePerMonth")}</label>
                    <input name="pricePerMonth" type="number" min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{tVehicle("depositAmount")}</label>
                    <input name="deposit" type="number" min="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{tVehicle("kmIncluded")}</label>
                    <input name="kmIncluded" type="number" min="0" className={inputClass} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelClass}>{tVehicle("conditions")}</label>
                    <textarea name="conditions" rows={2} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("newVehicle")}
          </button>
          <Link
            href="/admin/vehicules"
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
