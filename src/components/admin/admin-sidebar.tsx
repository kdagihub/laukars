"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  CalendarDays,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

type Props = {
  user: {
    name: string;
    email: string;
    role: Role;
  };
};

export function AdminSidebar({ user }: Props) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin" as const,
      label: tCommon("dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/admin/vehicules" as const,
      label: t("vehicles"),
      icon: Car,
    },
    {
      href: "/admin/demandes" as const,
      label: t("leads"),
      icon: ClipboardList,
    },
    {
      href: "/admin/rdv" as const,
      label: t("appointments"),
      icon: CalendarDays,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {tCommon("logout")}
        </button>
      </div>
    </aside>
  );
}
