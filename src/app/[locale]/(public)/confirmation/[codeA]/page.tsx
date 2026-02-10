import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckCircle2, Copy, ArrowRight } from "lucide-react";
import { CopyCodeButton } from "@/components/shared/copy-code-button";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ codeA: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Confirmation de demande" };
}

export default async function ConfirmationPage({ params }: Props) {
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
    },
  });

  if (!lead) notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          {t("successTitle")}
        </h1>
        <p className="mt-2 text-gray-600">{t("successMessage")}</p>

        {/* Code A */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 border-dashed">
          <p className="text-sm text-blue-600 font-medium">{t("yourCode")}</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <p className="text-3xl font-mono font-bold text-blue-900 tracking-wider">
              {codeA}
            </p>
            <CopyCodeButton code={codeA} />
          </div>
          <p className="mt-3 text-xs text-blue-600">{t("codeInstruction")}</p>
        </div>

        {/* Vehicle Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left">
          <p className="text-sm font-medium text-gray-900">
            {lead.vehicle.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {lead.vehicle.brand} {lead.vehicle.model} {lead.vehicle.year} -{" "}
            {lead.vehicle.city}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link
            href={`/suivi/${codeA}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
          >
            {t("trackTitle")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/catalogue"
            className="block w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
