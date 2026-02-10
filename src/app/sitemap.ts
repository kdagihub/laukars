import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Get all published vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, updatedAt: true },
  });

  const staticPages = [
    { url: `${baseUrl}/fr`, lastModified: new Date() },
    { url: `${baseUrl}/en`, lastModified: new Date() },
    { url: `${baseUrl}/fr/catalogue`, lastModified: new Date() },
    { url: `${baseUrl}/en/catalogue`, lastModified: new Date() },
  ];

  const vehiclePages = vehicles.flatMap((v) => [
    {
      url: `${baseUrl}/fr/vehicule/${v.id}`,
      lastModified: v.updatedAt,
    },
    {
      url: `${baseUrl}/en/vehicule/${v.id}`,
      lastModified: v.updatedAt,
    },
  ]);

  return [...staticPages, ...vehiclePages];
}
