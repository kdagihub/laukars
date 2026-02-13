import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { VehicleGallery } from "@/components/catalogue/vehicle-gallery";
import { LeadRequestForm } from "@/components/catalogue/lead-request-form";
import { ShareButtons } from "@/components/catalogue/share-buttons";
import {
  Calendar,
  Gauge,
  Fuel,
  Cog,
  MapPin,
  Ticket,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";

const TEAL = "#4FAAA3";
const TEAL_DARK = "#215F5A";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id, status: "PUBLISHED" },
  });
  if (!vehicle) return { title: "Véhicule introuvable" };

  return {
    title: vehicle.title,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${formatPrice(vehicle.pricePublic)} - ${vehicle.city}`,
    openGraph: {
      title: vehicle.title,
      description: `${vehicle.brand} ${vehicle.model} ${vehicle.year} à ${vehicle.city}`,
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      rentalPolicy: true,
    },
  });

  if (!vehicle) notFound();

  // Increment view count
  await prisma.vehicle.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  const isRent = vehicle.type === "RENT";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par ${vehicle.title} (${vehicle.brand} ${vehicle.model} ${vehicle.year}) publié sur Laukars.`
  );

  const specs = [
    { icon: Calendar, label: t("vehicle.year"), value: String(vehicle.year) },
    {
      icon: Gauge,
      label: t("vehicle.mileage"),
      value: `${vehicle.mileage.toLocaleString()} ${t("vehicle.km")}`,
    },
    {
      icon: Fuel,
      label: t("vehicle.fuel"),
      value: t(`vehicle.${vehicle.fuel.toLowerCase()}`),
    },
    {
      icon: Cog,
      label: t("vehicle.transmission"),
      value: t(`vehicle.${vehicle.transmission.toLowerCase()}`),
    },
    { icon: MapPin, label: t("vehicle.city"), value: vehicle.city },
  ];

  return (
    <div style={{ background: "#f6fafa", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
          }}
          className="vehicle-detail-grid"
        >
          {/* ── Left Column: Gallery + Details ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              gridColumn: "1 / 3",
            }}
            className="vehicle-detail-left"
          >
            {/* Gallery */}
            <VehicleGallery photos={vehicle.photos} title={vehicle.title} />

            {/* Details card */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: 28,
                border: "1px solid #e8eeee",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: isRent ? "#e6f7f5" : "#e8f0fe",
                      color: isRent ? TEAL_DARK : "#1a3a6b",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {isRent
                      ? t("catalogue.typeRent")
                      : t("catalogue.typeSale")}
                  </span>
                  <h1
                    style={{
                      marginTop: 14,
                      fontSize: 28,
                      fontWeight: 800,
                      color: "#1a2332",
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      lineHeight: 1.2,
                    }}
                  >
                    {vehicle.title}
                  </h1>
                </div>
                <ShareButtons title={vehicle.title} />
              </div>

              {/* Specs Grid */}
              <div
                style={{
                  marginTop: 32,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 14,
                      borderRadius: 12,
                      background: "#f6fafa",
                    }}
                  >
                    <spec.icon
                      size={20}
                      style={{ color: TEAL, flexShrink: 0 }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#999",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {spec.label}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1a2332",
                          margin: 0,
                        }}
                      >
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div style={{ marginTop: 32 }}>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1a2332",
                      margin: "0 0 14px",
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                    }}
                  >
                    {t("vehicle.description")}
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#5a6a7e",
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Rental Policy */}
              {isRent && vehicle.rentalPolicy && (
                <div
                  style={{
                    marginTop: 32,
                    padding: 24,
                    background: "#e6f7f5",
                    borderRadius: 14,
                    border: `1px solid ${TEAL}33`,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: TEAL_DARK,
                      margin: "0 0 16px",
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                    }}
                  >
                    {t("vehicle.rentalPolicy")}
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {vehicle.rentalPolicy.pricePerDay && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEAL,
                            margin: "0 0 4px",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("vehicle.pricePerDay")}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: TEAL_DARK,
                            margin: 0,
                          }}
                        >
                          {formatPrice(vehicle.rentalPolicy.pricePerDay)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.pricePerWeek && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEAL,
                            margin: "0 0 4px",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("vehicle.pricePerWeek")}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: TEAL_DARK,
                            margin: 0,
                          }}
                        >
                          {formatPrice(vehicle.rentalPolicy.pricePerWeek)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.pricePerMonth && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEAL,
                            margin: "0 0 4px",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("vehicle.pricePerMonth")}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: TEAL_DARK,
                            margin: 0,
                          }}
                        >
                          {formatPrice(vehicle.rentalPolicy.pricePerMonth)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.deposit && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEAL,
                            margin: "0 0 4px",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("vehicle.depositAmount")}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: TEAL_DARK,
                            margin: 0,
                          }}
                        >
                          {formatPrice(vehicle.rentalPolicy.deposit)}
                        </p>
                      </div>
                    )}
                    {vehicle.rentalPolicy.kmIncluded && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEAL,
                            margin: "0 0 4px",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("vehicle.kmIncluded")}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: TEAL_DARK,
                            margin: 0,
                          }}
                        >
                          {vehicle.rentalPolicy.kmIncluded} km
                        </p>
                      </div>
                    )}
                  </div>
                  {vehicle.rentalPolicy.conditions && (
                    <p
                      style={{
                        marginTop: 16,
                        fontSize: 13,
                        color: TEAL_DARK,
                        lineHeight: 1.5,
                      }}
                    >
                      {vehicle.rentalPolicy.conditions}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Price + Form ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
            className="vehicle-detail-right"
          >
            {/* Price Card */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: 28,
                border: "1px solid #e8eeee",
                position: "sticky",
                top: 90,
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                {isRent ? (
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#7a8a9e",
                        margin: "0 0 6px",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {t("vehicle.pricePerDay")}
                    </p>
                    <p
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: TEAL_DARK,
                        margin: 0,
                        fontFamily: '"Inter Tight", system-ui, sans-serif',
                        lineHeight: 1,
                      }}
                    >
                      {formatPrice(
                        vehicle.rentalPolicy?.pricePerDay ||
                          vehicle.pricePublic
                      )}
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: "#7a8a9e",
                          marginLeft: 4,
                        }}
                      >
                        {t("catalogue.perDay")}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#7a8a9e",
                        margin: "0 0 6px",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {t("vehicle.price")}
                    </p>
                    <p
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: TEAL_DARK,
                        margin: 0,
                        fontFamily: '"Inter Tight", system-ui, sans-serif',
                      }}
                    >
                      {formatPrice(vehicle.pricePublic)}
                    </p>
                  </div>
                )}
              </div>

              {/* Code Advantage */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  background: "#fff8e1",
                  borderRadius: 12,
                  border: "1px solid #ffe082",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Ticket size={18} color="#f59e0b" />
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#92400e",
                      fontSize: 13,
                    }}
                  >
                    {t("vehicle.codeAdvantage")}
                  </span>
                </div>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#a16207",
                    lineHeight: 1.4,
                  }}
                >
                  {t("vehicle.codeAdvantageDesc")}
                </p>
              </div>

              {/* Separator */}
              <div
                style={{
                  height: 1,
                  background: "#e8eeee",
                  margin: "0 0 24px",
                }}
              />

              {/* Lead Form */}
              <LeadRequestForm
                vehicleId={vehicle.id}
                vehicleType={vehicle.type}
              />

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  background: "#25d366",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                  fontFamily: '"Inter Tight", system-ui, sans-serif',
                }}
              >
                <MessageCircle size={18} />
                {t("vehicle.contactWhatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        .vehicle-detail-grid {
          display: grid !important;
          grid-template-columns: 1fr 380px !important;
          gap: 32px !important;
        }
        .vehicle-detail-left {
          grid-column: 1 / 2 !important;
        }
        .vehicle-detail-right {
          grid-column: 2 / 3 !important;
        }
        @media (max-width: 1024px) {
          .vehicle-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .vehicle-detail-left {
            grid-column: 1 !important;
          }
          .vehicle-detail-right {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
