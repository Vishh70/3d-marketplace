import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateAccountSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  image: z.string().trim().url().optional().or(z.literal("")).nullable().optional(),
  bio: z.string().trim().max(500).optional().or(z.literal("")).nullable().optional(),
  website: z.string().trim().url().optional().or(z.literal("")).nullable().optional(),
  twitter: z.string().trim().optional().or(z.literal("")).nullable().optional(),
  instagram: z.string().trim().optional().or(z.literal("")).nullable().optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = updateAccountSchema.parse(await req.json());

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(payload.name ? { name: payload.name } : {}),
        image: payload.image === "" ? null : payload.image,
        bio: payload.bio === "" ? null : payload.bio,
        website: payload.website === "" ? null : payload.website,
        twitter: payload.twitter === "" ? null : payload.twitter,
        instagram: payload.instagram === "" ? null : payload.instagram,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        website: true,
        twitter: true,
        instagram: true,
      },
    });

    return NextResponse.json({
      message: "Account updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data provided", issues: error.flatten() },
        { status: 400 }
      );
    }

    console.error("Account update error:", error);
    return NextResponse.json(
      { message: "Could not update profile" },
      { status: 500 }
    );
  }
}
