import { HeroVehicleScroll } from "@/components/landing/hero-vehicle-scroll";
import { CataloguePreview } from "@/components/landing/catalogue-preview";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { LandingFooter } from "@/components/landing/landing-footer";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      rentalPolicy: true,
    },
  });

  return (
    <>
      <HeroVehicleScroll />
      <CataloguePreview vehicles={vehicles} />
      <WhyChooseUs />
      <LandingFooter />
    </>
  );
}
