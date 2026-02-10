"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateCodeB, generateFingerprint } from "@/lib/codes";
import { vehicleSchema, rentalPolicySchema } from "@/lib/validators/vehicle";
import { revalidatePath } from "next/cache";

// ─── VEHICLE ACTIONS ────────────────────────────────────────────────────────

export async function createVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autorisé" };

  const raw = {
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    year: parseInt(formData.get("year") as string),
    mileage: parseInt(formData.get("mileage") as string),
    fuel: formData.get("fuel") as string,
    transmission: formData.get("transmission") as string,
    city: formData.get("city") as string,
    description: (formData.get("description") as string) || undefined,
    pricePublic: parseInt(formData.get("pricePublic") as string),
    priceSupplier: parseInt(formData.get("priceSupplier") as string),
    status: (formData.get("status") as string) || "DRAFT",
  };

  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const fingerprint = generateFingerprint(
    parsed.data.brand,
    parsed.data.model,
    parsed.data.year,
    parsed.data.mileage
  );

  // Check duplicates
  const duplicate = await prisma.vehicle.findFirst({
    where: {
      fingerprint,
      status: { not: "UNAVAILABLE" },
    },
  });

  if (duplicate) {
    return {
      success: false,
      error: "Un véhicule similaire existe déjà (anti-doublon)",
    };
  }

  // Check quota
  const activeCount = await prisma.vehicle.count({
    where: {
      createdByUserId: session.user.id,
      status: { in: ["DRAFT", "PUBLISHED", "SUSPENDED"] },
    },
  });

  if (activeCount >= 20) {
    return {
      success: false,
      error: "Quota de véhicules actifs atteint (max 20)",
    };
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      ...parsed.data,
      type: parsed.data.type as "SALE" | "RENT",
      status: (parsed.data.status as "DRAFT" | "PUBLISHED" | "SUSPENDED" | "UNAVAILABLE") || "DRAFT",
      fuel: parsed.data.fuel as "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID" | "LPG",
      transmission: parsed.data.transmission as "MANUAL" | "AUTOMATIC",
      createdByUserId: session.user.id,
      fingerprint,
    },
  });

  // Create rental policy if RENT
  if (parsed.data.type === "RENT") {
    const rentalData = {
      pricePerDay: parseInt(formData.get("pricePerDay") as string) || undefined,
      pricePerWeek: parseInt(formData.get("pricePerWeek") as string) || undefined,
      pricePerMonth: parseInt(formData.get("pricePerMonth") as string) || undefined,
      deposit: parseInt(formData.get("deposit") as string) || undefined,
      kmIncluded: parseInt(formData.get("kmIncluded") as string) || undefined,
      conditions: (formData.get("conditions") as string) || undefined,
    };

    await prisma.rentalPolicy.create({
      data: {
        vehicleId: vehicle.id,
        ...rentalData,
      },
    });
  }

  // Add photo URL if provided
  const photoUrl = formData.get("photoUrl") as string;
  if (photoUrl) {
    await prisma.vehiclePhoto.create({
      data: {
        vehicleId: vehicle.id,
        url: photoUrl,
        sortOrder: 0,
      },
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      entityType: "VEHICLE",
      entityId: vehicle.id,
      action: "CREATE",
      metaJson: JSON.stringify({ title: vehicle.title }),
    },
  });

  revalidatePath("/admin/vehicules");
  return { success: true, vehicleId: vehicle.id };
}

export async function updateVehicleStatus(
  vehicleId: string,
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED" | "UNAVAILABLE"
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autorisé" };

  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      entityType: "VEHICLE",
      entityId: vehicleId,
      action: "STATUS_CHANGE",
      metaJson: JSON.stringify({ newStatus: status, title: vehicle.title }),
    },
  });

  revalidatePath("/admin/vehicules");
  return { success: true };
}

// ─── LEAD ACTIONS ───────────────────────────────────────────────────────────

export async function updateLeadStatus(
  leadId: string,
  status: string,
  extra?: { failureReason?: string; codeB?: string }
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autorisé" };

  const lead = await prisma.leadRequest.findUnique({
    where: { id: leadId },
    include: { vehicle: true },
  });

  if (!lead) return { success: false, error: "Demande introuvable" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { status };
  const now = new Date();

  switch (status) {
    case "CONTACTED":
      updateData.contactedAt = now;
      break;
    case "APPOINTMENT_SET":
      updateData.appointmentAt = now;
      // Generate Code B
      let codeB = generateCodeB();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma.leadRequest.findUnique({
          where: { codeB },
        });
        if (!existing) break;
        codeB = generateCodeB();
        attempts++;
      }
      updateData.codeB = codeB;
      break;
    case "SOLD":
      if (!extra?.codeB || extra.codeB !== lead.codeB) {
        return { success: false, error: "Code B invalide" };
      }
      updateData.closedAt = now;
      updateData.margin = lead.vehicle.pricePublic - lead.vehicle.priceSupplier;
      break;
    case "FAILED":
      if (!extra?.failureReason) {
        return { success: false, error: "Raison obligatoire" };
      }
      updateData.failureReason = extra.failureReason;
      updateData.closedAt = now;
      break;
    case "CANCELED":
      updateData.closedAt = now;
      break;
  }

  await prisma.leadRequest.update({
    where: { id: leadId },
    data: updateData,
  });

  // If SOLD, mark vehicle as unavailable
  if (status === "SOLD" && lead.requestType === "BUY") {
    await prisma.vehicle.update({
      where: { id: lead.vehicleId },
      data: { status: "UNAVAILABLE" },
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      entityType: "LEAD_REQUEST",
      entityId: leadId,
      action: "STATUS_CHANGE",
      metaJson: JSON.stringify({
        previousStatus: lead.status,
        newStatus: status,
        codeA: lead.codeA,
      }),
    },
  });

  revalidatePath("/admin/demandes");
  revalidatePath(`/admin/demandes/${leadId}`);
  return { success: true, codeB: updateData.codeB };
}

export async function createAppointment(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autorisé" };

  const leadRequestId = formData.get("leadRequestId") as string;
  const scheduledAt = formData.get("scheduledAt") as string;
  const locationText = formData.get("locationText") as string;
  const notes = (formData.get("notes") as string) || undefined;

  if (!leadRequestId || !scheduledAt || !locationText) {
    return { success: false, error: "Champs requis manquants" };
  }

  await prisma.appointment.create({
    data: {
      leadRequestId,
      scheduledAt: new Date(scheduledAt),
      locationText,
      notes,
    },
  });

  // Update lead status to APPOINTMENT_SET
  const result = await updateLeadStatus(leadRequestId, "APPOINTMENT_SET");
  
  revalidatePath("/admin/rdv");
  return result;
}

export async function uploadProof(leadRequestId: string, fileUrl: string, proofType: "RECEIPT" | "PHOTO" | "DOCUMENT") {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autorisé" };

  await prisma.proof.create({
    data: {
      leadRequestId,
      fileUrl,
      proofType,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      entityType: "PROOF",
      entityId: leadRequestId,
      action: "UPLOAD",
      metaJson: JSON.stringify({ proofType, fileUrl }),
    },
  });

  revalidatePath(`/admin/demandes/${leadRequestId}`);
  return { success: true };
}
