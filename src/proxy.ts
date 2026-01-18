import { auth } from "@/lib/auth";
import { ROLE } from "@/lib/constants/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/lib/config/routes";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ROUTES.ADMIN)) {
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
    
    if (session.user.role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith(ROUTES.STUDENT)) {
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
    
    if (session.user.role !== ROLE.STUDENT && session.user.role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
  ],
};
