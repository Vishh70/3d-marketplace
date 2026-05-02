import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase, BUCKET_NAME } from "@/lib/supabase";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // For development, if no session, we'll try to find an admin or the first user
    let userId = session?.user?.id;
    
    if (!userId) {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      userId = fallbackUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. Please login as a creator." }, { status: 401 });
    }

    const formData = await req.formData();
    const stlFile = formData.get("stl") as File;
    const imageFile = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const priceDigital = parseFloat(formData.get("priceDigital") as string || "0");
    const pricePhysical = formData.get("pricePhysical") ? parseFloat(formData.get("pricePhysical") as string) : null;
    const materials = formData.get("materials") as string;

    if (!stlFile || !imageFile || !title) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Generate unique filenames for Supabase
    const stlName = `models/${crypto.randomUUID()}-${stlFile.name}`;
    const imageName = `thumbnails/${crypto.randomUUID()}-${imageFile.name}`;

    // Upload to Supabase Storage
    const stlBuffer = await stlFile.arrayBuffer();
    const imageBuffer = await imageFile.arrayBuffer();

    const [stlUpload, imageUpload] = await Promise.all([
      supabase.storage.from(BUCKET_NAME).upload(stlName, stlBuffer, {
        contentType: stlFile.type,
        upsert: true,
      }),
      supabase.storage.from(BUCKET_NAME).upload(imageName, imageBuffer, {
        contentType: imageFile.type,
        upsert: true,
      }),
    ]);

    if (stlUpload.error) {
      console.error("STL Upload Error:", stlUpload.error);
      throw new Error(`STL Upload Failed: ${stlUpload.error.message}`);
    }
    if (imageUpload.error) {
      console.error("Image Upload Error:", imageUpload.error);
      throw new Error(`Image Upload Failed: ${imageUpload.error.message}`);
    }

    // Get public URLs
    const { data: { publicUrl: fileUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(stlName);
    const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imageName);

    // Create DB record
    const newModel = await prisma.model3D.create({
      data: {
        title,
        description,
        fileUrl,
        thumbnail: thumbnailUrl,
        priceDigital,
        pricePhysical,
        materials,
        creatorId: userId,
        categoryId: categoryId || null,
      }
    });

    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error("Model creation error:", error);
    return NextResponse.json({ 
      message: "Internal server error during upload.",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
