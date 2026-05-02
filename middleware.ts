import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = token?.role === "ADMIN";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !isAdmin) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "admin-required");
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/api/models" && request.method === "DELETE" && !isAdmin) {
    return NextResponse.json({ message: "Admin access required" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/models"],
};
