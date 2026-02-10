"use server";

import { prisma } from "@/lib/prisma";
import { generateCodeA } from "@/lib/codes";
import { leadRequestSchema } from "@/lib/validators/lead";

export type LeadActionResult = {
  success: boolean;
  codeA?: string;
  error?: string;
};

export async function createLeadRequest(
  formData: FormData
): Promise<LeadActionResult> {
  try {
    const raw = {
      vehicleId: formData.get("vehicleId") as string,
      clientName: formData.get("clientName") as string,
      clientPhone: formData.get("clientPhone") as string,
      clientCity: formData.get("clientCity") as string,
      message: (formData.get("message") as string) || undefined,
      requestType: formData.get("requestType") as string,
      consent: formData.get("consent") === "on",
    };

    const parsed = leadRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Données invalides",
      };
    }

    // Verify vehicle exists and is published
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parsed.data.vehicleId, status: "PUBLISHED" },
    });

    if (!vehicle) {
      return { success: false, error: "Véhicule introuvable" };
    }

    // Find the agent who manages this vehicle
    const agentId = vehicle.createdByUserId;

    // Generate unique Code A
    let codeA = generateCodeA();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.leadRequest.findUnique({
        where: { codeA },
      });
      if (!existing) break;
      codeA = generateCodeA();
      attempts++;
    }

    // Create the lead request
    const lead = await prisma.leadRequest.create({
      data: {
        vehicleId: parsed.data.vehicleId,
        agentId,
        clientName: parsed.data.clientName,
        clientPhone: parsed.data.clientPhone,
        clientCity: parsed.data.clientCity,
        message: parsed.data.message,
        requestType: parsed.data.requestType === "BUY" ? "BUY" : "RENT",
        codeA,
        status: "NEW",
      },
    });

    // Log the action in audit
    await prisma.auditLog.create({
      data: {
        actorUserId: agentId, // System action attributed to agent
        entityType: "LEAD_REQUEST",
        entityId: lead.id,
        action: "CREATE",
        metaJson: JSON.stringify({
          codeA,
          vehicleId: vehicle.id,
          clientName: parsed.data.clientName,
        }),
      },
    });

    return { success: true, codeA };
  } catch (error) {
    console.error("Error creating lead request:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
