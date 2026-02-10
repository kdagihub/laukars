import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, skip API routes and static files
  matcher: [
    "/",
    "/(fr|en)/:path*",
    // Skip: _next, api, static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
