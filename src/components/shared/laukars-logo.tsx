"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

export function LaukarsLogo() {
  return (
    <Link
      href="/"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        src="/logo_.png"
        alt="Laukars"
        width={180}
        height={40}
        priority
        style={{ width: 180, height: 40, objectFit: "cover", objectPosition: "center" }}
      />
    </Link>
  );
}
