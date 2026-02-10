import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Phone, MapPin, MessageSquare } from "lucide-react";
import { LeadStatusActions } from "@/components/admin/lead-status-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const lead = await prisma.leadRequest.findUnique({
    where: { id },
    include: {
      vehicle: {
        include: {
          photos: { take: 1, orderBy: { sortOrder: "asc" } },
        },
      },
      appointment: true,
      proofs: true,
    },
  });

  if (!lead) notFound();

  const margin = lead.vehicle.pricePublic - lead.vehicle.priceSupplier;

  const statusSteps = [
    { key: "NEW", label: "Nouveau", date: lead.createdAt },
    { key: "CONTACTED", label: "Contacté", date: lead.contactedAt },
    { key: "APPOINTMENT_SET", label: "RDV programmé", date: lead.appointmentAt },
    { key: "VISIT_DONE", label: "Visite faite", date: null },
    { key: "SOLD", label: "Vendu", date: lead.status === "SOLD" ? lead.closedAt : null },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === lead.status);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/demandes"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("leadDetail")}
          </h1>
          <p className="text-sm text-gray-500">Code A: {lead.codeA}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Progression</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusSteps.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`flex flex-col items-center ${
                      idx <= currentStepIndex
                        ? "text-blue-700"
                        : "text-gray-300"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx < currentStepIndex
                          ? "bg-blue-700 text-white"
                          : idx === currentStepIndex
                          ? lead.status === "FAILED"
                            ? "bg-red-600 text-white"
                            : lead.status === "SOLD"
                            ? "bg-green-600 text-white"
                            : "bg-blue-700 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs mt-1 whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        idx < currentStepIndex ? "bg-blue-700" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            {lead.status === "FAILED" && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                Échec: {lead.failureReason}
              </div>
            )}
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">
              Informations client
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.clientName}
                  </p>
                  <p className="text-xs text-gray-500">Nom</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.clientPhone}
                  </p>
                  <p className="text-xs text-gray-500">Téléphone</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.clientCity}
                  </p>
                  <p className="text-xs text-gray-500">Ville</p>
                </div>
              </div>
            </div>
            {lead.message && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Véhicule</h2>
            <p className="text-lg font-medium text-gray-900">
              {lead.vehicle.title}
            </p>
            <p className="text-sm text-gray-500">
              {lead.vehicle.brand} {lead.vehicle.model} {lead.vehicle.year}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">{t("publicPrice")}</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(lead.vehicle.pricePublic)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("supplierPrice")}</p>
                <p className="text-lg font-bold text-gray-500">
                  {formatPrice(lead.vehicle.priceSupplier)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("margin")}</p>
                <p className="text-lg font-bold text-green-700">
                  {formatPrice(margin)}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment */}
          {lead.appointment && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">
                Rendez-vous
              </h2>
              <p className="text-sm text-gray-700">
                <strong>Date:</strong>{" "}
                {formatDateTime(lead.appointment.scheduledAt)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Lieu:</strong> {lead.appointment.locationText}
              </p>
              {lead.appointment.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  {lead.appointment.notes}
                </p>
              )}
            </div>
          )}

          {/* Proofs */}
          {lead.proofs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Preuves</h2>
              <div className="space-y-2">
                {lead.proofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-xs font-medium text-gray-500">
                      {proof.proofType}
                    </span>
                    <a
                      href={proof.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Voir le fichier
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">{t("codeA")}</p>
                <p className="text-lg font-mono font-bold text-blue-900">
                  {lead.codeA}
                </p>
              </div>
              {lead.codeB && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">{t("codeB")}</p>
                  <p className="text-lg font-mono font-bold text-green-900">
                    {lead.codeB}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <LeadStatusActions
                leadId={lead.id}
                currentStatus={lead.status}
                codeB={lead.codeB}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
