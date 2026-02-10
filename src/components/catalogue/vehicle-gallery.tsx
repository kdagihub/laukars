"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VehiclePhoto } from "@prisma/client";

type Props = {
  photos: VehiclePhoto[];
  title: string;
};

export function VehicleGallery({ photos, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="bg-gray-200 rounded-2xl aspect-[16/9] flex items-center justify-center text-gray-400">
        Pas de photo disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={photos[current].url}
          alt={`${title} - Photo ${current + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button
              onClick={() =>
                setCurrent((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setCurrent(idx)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                idx === current ? "border-blue-600" : "border-transparent"
              }`}
            >
              <Image
                src={photo.url}
                alt={`${title} - Miniature ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
