import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseIdentifier(identifier: string) {
  const [prefix, userId, ...emailParts] = identifier.split(":");
  if (prefix !== "email-change" || !userId || emailParts.length === 0) {
    return null;
  }

  return {
    userId,
    email: emailParts.join(":"),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/account?emailChange=missing-token", req.url));
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return NextResponse.redirect(new URL("/account?emailChange=invalid-token", req.url));
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(new URL("/account?emailChange=expired", req.url));
  }

  const parsed = parseIdentifier(verificationToken.identifier);

  if (!parsed) {
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(new URL("/account?emailChange=invalid-request", req.url));
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: parsed.userId },
        data: {
          email: parsed.email,
          emailVerified: new Date(),
        },
      }),
      prisma.verificationToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.redirect(new URL("/account?emailChange=success", req.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL("/account?emailChange=failed", req.url));
  }
}
