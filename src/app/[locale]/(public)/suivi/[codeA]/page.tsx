import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import {
  CheckCircle2,
  Clock,
  Phone,
  CalendarDays,
  Eye,
  ShoppingCart,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { SurveyForm } from "@/components/shared/survey-form";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ codeA: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Suivi de votre demande" };
}

export default async function TrackingPage({ params }: Props) {
  const { codeA } = await params;
  const t = await getTranslations("lead");

  const lead = await prisma.leadRequest.findUnique({
    where: { codeA },
    include: {
      vehicle: {
        include: {
          photos: { take: 1, orderBy: { sortOrder: "asc" } },
        },
      },
      appointment: true,
    },
  });

  if (!lead) notFound();

  const steps = [
    {
      key: "NEW",
      label: t("statusNew"),
      icon: Clock,
      date: lead.createdAt,
      active: true,
    },
    {
      key: "CONTACTED",
      label: t("statusContacted"),
      icon: Phone,
      date: lead.contactedAt,
      active: !!lead.contactedAt,
    },
    {
      key: "APPOINTMENT_SET",
      label: t("statusAppointment"),
      icon: CalendarDays,
      date: lead.appointmentAt,
      active: !!lead.appointmentAt,
    },
    {
      key: "VISIT_DONE",
      label: t("statusVisitDone"),
      icon: Eye,
      date: null,
      active: ["VISIT_DONE", "SOLD", "FAILED"].includes(lead.status),
    },
    {
      key: "SOLD",
      label: lead.status === "FAILED" ? t("statusFailed") : t("statusSold"),
      icon: lead.status === "FAILED" ? XCircle : ShoppingCart,
      date: lead.closedAt,
      active: ["SOLD", "FAILED"].includes(lead.status),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("trackTitle")}</h1>
          <p className="mt-1 text-gray-600">{t("trackSubtitle")}</p>

          {/* Code */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600">{t("yourCode")}</p>
            <p className="text-2xl font-mono font-bold text-blue-900">{codeA}</p>
          </div>

          {/* Vehicle */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900">{lead.vehicle.title}</p>
            <p className="text-sm text-gray-500">
              {lead.vehicle.brand} {lead.vehicle.model} {lead.vehicle.year} -{" "}
              {lead.vehicle.city}
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <div className="space-y-0">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex gap-4">
                  {/* Line + Dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.active
                          ? step.key === "SOLD" && lead.status === "FAILED"
                            ? "bg-red-100 text-red-600"
                            : step.key === "SOLD"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          steps[idx + 1]?.active ? "bg-blue-200" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p
                      className={`font-medium ${
                        step.active ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateTime(step.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          {lead.appointment && (
            <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="font-medium text-purple-900">Votre rendez-vous</p>
              <p className="text-sm text-purple-700 mt-1">
                {formatDateTime(lead.appointment.scheduledAt)} -{" "}
                {lead.appointment.locationText}
              </p>
            </div>
          )}

          {/* Survey for FAILED leads */}
          {lead.status === "FAILED" && !lead.surveyAnswer && (
            <div className="mt-6">
              <SurveyForm codeA={lead.codeA} />
            </div>
          )}

          {lead.surveyAnswer && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                {t("surveyThanks")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
