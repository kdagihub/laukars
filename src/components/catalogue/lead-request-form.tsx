"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { createLeadRequest } from "@/app/actions/lead";
import { Loader2, Send } from "lucide-react";

type Props = {
  vehicleId: string;
  vehicleType: "SALE" | "RENT";
};

export function LeadRequestForm({ vehicleId, vehicleType }: Props) {
  const t = useTranslations("lead");
  const tVehicle = useTranslations("vehicle");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createLeadRequest(formData);

    if (result.success && result.codeA) {
      router.push(`/confirmation/${result.codeA}`);
    } else {
      setError(result.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-gray-900">{t("formTitle")}</h3>

      <input type="hidden" name="vehicleId" value={vehicleId} />
      <input
        type="hidden"
        name="requestType"
        value={vehicleType === "SALE" ? "BUY" : "RENT"}
      />

      <div>
        <input
          name="clientName"
          type="text"
          required
          placeholder={t("name")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      <div>
        <input
          name="clientPhone"
          type="tel"
          required
          placeholder={t("phone")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      <div>
        <input
          name="clientCity"
          type="text"
          required
          placeholder={t("city")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      <div>
        <textarea
          name="message"
          rows={3}
          placeholder={t("message")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-600">{t("consent")}</span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-colors disabled:opacity-50 bg-blue-900 hover:bg-blue-800"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            {vehicleType === "SALE"
              ? tVehicle("orderBuy")
              : tVehicle("orderRent")}
          </>
        )}
      </button>
    </form>
  );
}
