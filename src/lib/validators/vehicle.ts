import { z } from "zod/v4";

export const vehicleSchema = z.object({
  type: z.enum(["SALE", "RENT"]),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  fuel: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "LPG"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  city: z.string().min(1, "La ville est requise"),
  description: z.string().optional(),
  pricePublic: z.number().int().min(1, "Le prix public est requis"),
  priceSupplier: z.number().int().min(1, "Le prix fournisseur est requis"),
  status: z.enum(["DRAFT", "PUBLISHED", "SUSPENDED", "UNAVAILABLE"]).optional(),
});

export const rentalPolicySchema = z.object({
  pricePerDay: z.number().int().min(0).optional(),
  pricePerWeek: z.number().int().min(0).optional(),
  pricePerMonth: z.number().int().min(0).optional(),
  deposit: z.number().int().min(0).optional(),
  kmIncluded: z.number().int().min(0).optional(),
  conditions: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type RentalPolicyFormData = z.infer<typeof rentalPolicySchema>;
