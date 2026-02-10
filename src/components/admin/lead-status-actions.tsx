"use client";

import { useState } from "react";
import { updateLeadStatus, createAppointment } from "@/app/actions/admin";
import {
  Phone,
  CalendarPlus,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

type Props = {
  leadId: string;
  currentStatus: string;
  codeB: string | null;
};

export function LeadStatusActions({ leadId, currentStatus, codeB }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState<"sold" | "failed" | null>(null);

  const handleStatusUpdate = async (status: string, extra?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    const result = await updateLeadStatus(leadId, status, extra);
    if (!result.success) {
      setError(result.error || "Erreur");
    }
    setLoading(false);
    router.refresh();
  };

  const handleAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("leadRequestId", leadId);
    const result = await createAppointment(formData);
    if (!result.success) {
      setError(result.error || "Erreur");
    }
    setLoading(false);
    setShowAppointmentForm(false);
    router.refresh();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {currentStatus === "NEW" && (
        <button
          onClick={() => handleStatusUpdate("CONTACTED")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
          Marquer comme Contacté
        </button>
      )}

      {currentStatus === "CONTACTED" && (
        <>
          <button
            onClick={() => setShowAppointmentForm(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <CalendarPlus className="h-4 w-4" />
            Programmer un RDV
          </button>
          {showAppointmentForm && (
            <form onSubmit={handleAppointment} className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-xs font-medium text-gray-700">Date et heure</label>
                <input name="scheduledAt" type="datetime-local" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Lieu</label>
                <input name="locationText" required className={inputClass} placeholder="Adresse du RDV" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Notes</label>
                <textarea name="notes" rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "..." : "Confirmer"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {currentStatus === "APPOINTMENT_SET" && (
        <button
          onClick={() => handleStatusUpdate("VISIT_DONE")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Eye className="h-4 w-4" />
          Visite effectuée
        </button>
      )}

      {(currentStatus === "VISIT_DONE" || currentStatus === "APPOINTMENT_SET") && (
        <>
          <button
            onClick={() => setShowCloseForm("sold")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Clôturer (Vendu)
          </button>
          <button
            onClick={() => setShowCloseForm("failed")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Clôturer (Échec)
          </button>

          {showCloseForm === "sold" && (
            <div className="p-4 bg-green-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-green-800">Confirmer la vente</p>
              <input
                type="text"
                placeholder="Saisir le Code B"
                className={inputClass}
                id="codeBInput"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const input = document.getElementById("codeBInput") as HTMLInputElement;
                    handleStatusUpdate("SOLD", { codeB: input.value });
                  }}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowCloseForm(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {showCloseForm === "failed" && (
            <div className="p-4 bg-red-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-red-800">Raison de l&apos;échec</p>
              <textarea
                placeholder="Pourquoi la vente a échoué..."
                className={`${inputClass} resize-none`}
                rows={3}
                id="failureInput"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const input = document.getElementById("failureInput") as HTMLTextAreaElement;
                    handleStatusUpdate("FAILED", { failureReason: input.value });
                  }}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Confirmer l&apos;échec
                </button>
                <button
                  onClick={() => setShowCloseForm(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {(currentStatus === "SOLD" || currentStatus === "FAILED" || currentStatus === "CANCELED") && (
        <p className="text-center text-sm text-gray-500 py-4">
          Cette demande est clôturée.
        </p>
      )}
    </div>
  );
}
