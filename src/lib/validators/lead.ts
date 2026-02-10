import { z } from "zod/v4";

export const leadRequestSchema = z.object({
  vehicleId: z.string().min(1),
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  clientPhone: z.string().min(8, "Numéro de téléphone invalide"),
  clientCity: z.string().min(1, "La ville est requise"),
  message: z.string().optional(),
  requestType: z.enum(["BUY", "RENT"]),
  consent: z.literal(true, {
    error: "Vous devez accepter les conditions",
  }),
});

export const appointmentSchema = z.object({
  leadRequestId: z.string().min(1),
  scheduledAt: z.string().min(1, "La date est requise"),
  locationText: z.string().min(1, "Le lieu est requis"),
  notes: z.string().optional(),
});

export const closeSaleSchema = z.object({
  leadRequestId: z.string().min(1),
  codeB: z.string().min(1, "Le code B est requis"),
});

export const closeFailureSchema = z.object({
  leadRequestId: z.string().min(1),
  failureReason: z.string().min(5, "La raison doit contenir au moins 5 caractères"),
});

export const surveySchema = z.object({
  codeA: z.string().min(1),
  answer: z.enum(["YES", "NO"]),
});

export type LeadRequestFormData = z.infer<typeof leadRequestSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
