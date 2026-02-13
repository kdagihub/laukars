"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { createLeadRequest } from "@/app/actions/lead";
import { Loader2, Send } from "lucide-react";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

type Props = {
  vehicleId: string;
  vehicleType: "SALE" | "RENT";
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1.5px solid #e0e8e8",
  padding: "12px 16px",
  fontSize: 14,
  color: "#1a2332",
  background: "#fafcfc",
  outline: "none",
  transition: "border-color 0.2s ease",
  fontFamily: "inherit",
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
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <h3
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: "#1a2332",
          margin: "0 0 4px",
          fontFamily: '"Inter Tight", system-ui, sans-serif',
        }}
      >
        {t("formTitle")}
      </h3>

      <input type="hidden" name="vehicleId" value={vehicleId} />
      <input
        type="hidden"
        name="requestType"
        value={vehicleType === "SALE" ? "BUY" : "RENT"}
      />

      <input
        name="clientName"
        type="text"
        required
        placeholder={t("name")}
        style={fieldStyle}
      />

      <input
        name="clientPhone"
        type="tel"
        required
        placeholder={t("phone")}
        style={fieldStyle}
      />

      <input
        name="clientCity"
        type="text"
        required
        placeholder={t("city")}
        style={fieldStyle}
      />

      <textarea
        name="message"
        rows={3}
        placeholder={t("message")}
        style={{
          ...fieldStyle,
          resize: "none",
        }}
      />

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          name="consent"
          required
          style={{
            marginTop: 3,
            width: 16,
            height: 16,
            accentColor: TEAL,
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: 12, color: "#7a8a9e", lineHeight: 1.4 }}>
          {t("consent")}
        </span>
      </label>

      {error && (
        <p
          style={{
            fontSize: 13,
            color: "#dc2626",
            background: "#fef2f2",
            padding: "10px 14px",
            borderRadius: 10,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 0",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 15,
          color: "#FFFFFF",
          background: TEAL_DARK,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "background 0.2s ease, opacity 0.2s ease",
          fontFamily: '"Inter Tight", system-ui, sans-serif',
        }}
      >
        {loading ? (
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <>
            <Send size={16} />
            {vehicleType === "SALE"
              ? tVehicle("orderBuy")
              : tVehicle("orderRent")}
          </>
        )}
      </button>

      {/* Focus + spinner styles */}
      <style>{`
        input:focus, textarea:focus {
          border-color: ${TEAL} !important;
          box-shadow: 0 0 0 3px rgba(79, 170, 163, 0.12);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
