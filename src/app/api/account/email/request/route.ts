import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

const emailChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newEmail: z.string().email("Enter a valid email address"),
});

function buildVerificationUrl(token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/account/email/verify?token=${encodeURIComponent(token)}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = emailChangeSchema.parse(await req.json());
    const normalizedEmail = payload.newEmail.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, password: true },
    });

    if (!user?.password) {
      return NextResponse.json({ message: "Email change is unavailable for this account" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    if (user.email?.toLowerCase() === normalizedEmail) {
      return NextResponse.json({ message: "This email is already attached to your account" }, { status: 400 });
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== user.id) {
      return NextResponse.json({ message: "That email address is already in use" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const identifier = `email-change:${user.id}:${normalizedEmail}`;
    const expires = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    });

    await sendVerificationEmail(normalizedEmail, token);

    return NextResponse.json({
      message: "A verification link has been sent to your new email address. Please check your inbox (and spam folder) to complete the update.",
      expiresAt: expires.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid email change data", issues: error.flatten() },
        { status: 400 }
      );
    }

    console.error("Email change request error:", error);
    return NextResponse.json(
      { message: "An error occurred while starting the email change" },
      { status: 500 }
    );
  }
}
