import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ASSOCIATE"];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { fullName: true, role: true } },
    },
  });

  // Generate CSV
  const headers = ["Date", "Acteur", "Role", "Action", "Type Entité", "ID Entité", "Détails"];
  const rows = logs.map((log) => [
    new Date(log.createdAt).toISOString(),
    log.actor.fullName,
    log.actor.role,
    log.action,
    log.entityType,
    log.entityId,
    log.metaJson || "",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
