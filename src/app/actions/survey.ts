"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitSurvey(codeA: string, answer: "YES" | "NO") {
  const lead = await prisma.leadRequest.findUnique({
    where: { codeA },
  });

  if (!lead || lead.status !== "FAILED") {
    return { success: false, error: "Demande introuvable" };
  }

  await prisma.leadRequest.update({
    where: { codeA },
    data: { surveyAnswer: answer },
  });

  // If client says YES (bought) but agent marked as FAILED => alert
  if (answer === "YES") {
    // Create audit log for incoherence alert
    const agents = await prisma.user.findMany({
      where: { role: { in: ["ASSOCIATE", "SUPER_ADMIN"] } },
    });

    // Log the incoherence as an audit event
    if (agents.length > 0) {
      await prisma.auditLog.create({
        data: {
          actorUserId: agents[0].id, // System action
          entityType: "LEAD_REQUEST",
          entityId: lead.id,
          action: "STATUS_CHANGE",
          metaJson: JSON.stringify({
            alert: "INCOHERENCE",
            message: `Client dit avoir acheté mais agent a marqué Échec`,
            codeA: lead.codeA,
            clientName: lead.clientName,
          }),
        },
      });
    }
  }

  revalidatePath(`/suivi/${codeA}`);
  return { success: true };
}
