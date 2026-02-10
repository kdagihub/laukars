"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { submitSurvey } from "@/app/actions/survey";
import { Loader2 } from "lucide-react";

export function SurveyForm({ codeA }: { codeA: string }) {
  const t = useTranslations("lead");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = async (answer: "YES" | "NO") => {
    setLoading(true);
    await submitSurvey(codeA, answer);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl">
        <p className="text-sm text-green-800">{t("surveyThanks")}</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
      <h3 className="font-semibold text-amber-900">{t("surveyTitle")}</h3>
      <p className="mt-2 text-sm text-amber-800">{t("surveyQuestion")}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleAnswer("YES")}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            t("statusSold")
          )}
        </button>
        <button
          onClick={() => handleAnswer("NO")}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
        >
          Non
        </button>
      </div>
    </div>
  );
}
