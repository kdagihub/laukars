"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VehiclePhoto } from "@prisma/client";

const TEAL = "#4FAAA3";

type Props = {
  photos: VehiclePhoto[];
  title: string;
};

export function VehicleGallery({ photos, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        style={{
          background: "#f4f8f8",
          borderRadius: 16,
          aspectRatio: "16 / 9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: 15,
        }}
      >
        Pas de photo disponible
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 16,
          overflow: "hidden",
          background: "#f4f8f8",
        }}
      >
        <Image
          src={photos[current].url}
          alt={`${title} - Photo ${current + 1}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((prev) =>
                  prev === 0 ? photos.length - 1 : prev - 1
                )
              }
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "background 0.2s ease",
              }}
            >
              <ChevronLeft size={20} color="#1a2332" />
            </button>
            <button
              onClick={() =>
                setCurrent((prev) =>
                  prev === photos.length - 1 ? 0 : prev + 1
                )
              }
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "background 0.2s ease",
              }}
            >
              <ChevronRight size={20} color="#1a2332" />
            </button>
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              {current + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setCurrent(idx)}
              style={{
                position: "relative",
                width: 80,
                height: 64,
                borderRadius: 10,
                overflow: "hidden",
                flexShrink: 0,
                border: `2px solid ${idx === current ? TEAL : "transparent"}`,
                padding: 0,
                background: "none",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
            >
              <Image
                src={photo.url}
                alt={`${title} - Miniature ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
