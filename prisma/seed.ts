import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Super Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@laukars.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "admin@laukars.com",
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
      phone: "+237600000001",
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // Create Agent (Abou)
  const agentPassword = await bcrypt.hash("agent123", 12);
  const agent = await prisma.user.upsert({
    where: { email: "abou@laukars.com" },
    update: {},
    create: {
      fullName: "Abou",
      email: "abou@laukars.com",
      passwordHash: agentPassword,
      role: Role.AGENT,
      phone: "+237600000002",
    },
  });
  console.log(`Created agent: ${agent.email}`);

  // Create Associate
  const associatePassword = await bcrypt.hash("assoc123", 12);
  const associate = await prisma.user.upsert({
    where: { email: "associe@laukars.com" },
    update: {},
    create: {
      fullName: "Associé 1",
      email: "associe@laukars.com",
      passwordHash: associatePassword,
      role: Role.ASSOCIATE,
      phone: "+237600000003",
    },
  });
  console.log(`Created associate: ${associate.email}`);

  // Create sample vehicles
  const vehicles = [
    {
      createdByUserId: agent.id,
      type: "SALE" as const,
      title: "Toyota Corolla 2020 - Excellent état",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      mileage: 45000,
      fuel: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      city: "Douala",
      description: "Toyota Corolla en excellent état, première main, carnet d'entretien complet. Climatisation, vitres électriques, écran tactile.",
      pricePublic: 8500000,
      priceSupplier: 7200000,
      status: "PUBLISHED" as const,
      fingerprint: "toyota|corolla|2020|45000|",
    },
    {
      createdByUserId: agent.id,
      type: "SALE" as const,
      title: "Mercedes-Benz Classe C 2019",
      brand: "Mercedes-Benz",
      model: "Classe C",
      year: 2019,
      mileage: 62000,
      fuel: "DIESEL" as const,
      transmission: "AUTOMATIC" as const,
      city: "Yaoundé",
      description: "Mercedes-Benz Classe C 220d, intérieur cuir, toit ouvrant, GPS intégré. Véhicule de luxe à prix accessible.",
      pricePublic: 15000000,
      priceSupplier: 12500000,
      status: "PUBLISHED" as const,
      fingerprint: "mercedes-benz|classe c|2019|62000|",
    },
    {
      createdByUserId: agent.id,
      type: "RENT" as const,
      title: "Toyota RAV4 2021 - Location",
      brand: "Toyota",
      model: "RAV4",
      year: 2021,
      mileage: 30000,
      fuel: "HYBRID" as const,
      transmission: "AUTOMATIC" as const,
      city: "Douala",
      description: "SUV familial idéal pour vos déplacements. Confortable, économique et spacieux.",
      pricePublic: 35000,
      priceSupplier: 25000,
      status: "PUBLISHED" as const,
      fingerprint: "toyota|rav4|2021|30000|",
    },
    {
      createdByUserId: agent.id,
      type: "SALE" as const,
      title: "Hyundai Tucson 2022 - Neuf",
      brand: "Hyundai",
      model: "Tucson",
      year: 2022,
      mileage: 12000,
      fuel: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      city: "Douala",
      description: "Hyundai Tucson quasi neuf, toutes options. Garantie constructeur encore valide.",
      pricePublic: 18000000,
      priceSupplier: 15500000,
      status: "PUBLISHED" as const,
      fingerprint: "hyundai|tucson|2022|12000|",
    },
    {
      createdByUserId: agent.id,
      type: "RENT" as const,
      title: "Peugeot 308 2020 - Location courte durée",
      brand: "Peugeot",
      model: "308",
      year: 2020,
      mileage: 55000,
      fuel: "DIESEL" as const,
      transmission: "MANUAL" as const,
      city: "Yaoundé",
      description: "Compacte idéale pour la ville. Économique en carburant, facile à garer.",
      pricePublic: 20000,
      priceSupplier: 14000,
      status: "PUBLISHED" as const,
      fingerprint: "peugeot|308|2020|55000|",
    },
    {
      createdByUserId: agent.id,
      type: "SALE" as const,
      title: "Ford Ranger 2021 - Pick-up robuste",
      brand: "Ford",
      model: "Ranger",
      year: 2021,
      mileage: 35000,
      fuel: "DIESEL" as const,
      transmission: "MANUAL" as const,
      city: "Kribi",
      description: "Pick-up puissant pour les terrains difficiles. Parfait pour le travail et les loisirs.",
      pricePublic: 22000000,
      priceSupplier: 19000000,
      status: "PUBLISHED" as const,
      fingerprint: "ford|ranger|2021|35000|",
    },
  ];

  for (const v of vehicles) {
    const vehicle = await prisma.vehicle.create({ data: v });
    console.log(`Created vehicle: ${vehicle.title}`);

    // Add rental policy for RENT vehicles
    if (v.type === "RENT") {
      await prisma.rentalPolicy.create({
        data: {
          vehicleId: vehicle.id,
          pricePerDay: v.pricePublic,
          pricePerWeek: Math.round(v.pricePublic * 6),
          pricePerMonth: Math.round(v.pricePublic * 22),
          deposit: v.pricePublic * 5,
          kmIncluded: 150,
          conditions: "Permis de conduire valide requis. Carburant non inclus. Retour dans le même état.",
        },
      });
    }

    // Add placeholder photos
    await prisma.vehiclePhoto.create({
      data: {
        vehicleId: vehicle.id,
        url: `https://placehold.co/800x600/1e3a5f/white?text=${encodeURIComponent(v.brand + " " + v.model)}`,
        sortOrder: 0,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
