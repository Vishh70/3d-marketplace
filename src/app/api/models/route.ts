import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const categoryId = searchParams.get("categoryId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Single model fetch
    if (id) {
      const model = await prisma.model3D.findUnique({
        where: { id },
        include: {
          creator: { select: { name: true, image: true } },
          category: true
        }
      });
      if (!model) return NextResponse.json({ message: "Model not found" }, { status: 404 });
      return NextResponse.json(formatModel(model));
    }

    // List models with optional category filter
    const models = await prisma.model3D.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        creator: { select: { name: true, image: true } }
      },
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(models.map(formatModel));
  } catch (error) {
    console.error("Fetch models error:", error);
    return NextResponse.json({ message: "Error fetching models" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, type } = await req.json(); // type: 'like' | 'download'
    if (!id || !type) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    const updateData = type === 'like' ? { likes: { increment: 1 } } : { downloads: { increment: 1 } };

    const updatedModel = await prisma.model3D.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, count: type === 'like' ? updatedModel.likes : updatedModel.downloads });
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin access required" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Missing model id" }, { status: 400 });

    await prisma.model3D.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete model error:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

// Helper to format Prisma model to Frontend ModelData
function formatModel(m: {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  downloads: number;
  likes: number;
  priceDigital: number | null;
  pricePhysical: number | null;
  fileUrl: string | null;
  materials: string | null;
  badges: string | null;
  isGif: boolean;
  creator: { name: string | null; image: string | null };
}) {
  return {
    id: m.id,
    title: m.title,
    description: m.description || "",
    thumbnail: m.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800",
    author: {
      name: m.creator.name || "Unknown",
      avatar: m.creator.image || undefined,
      verified: true
    },
    stats: {
      downloads: m.downloads,
      likes: m.likes
    },
    price: {
      digital: m.priceDigital || 0,
      physical: m.pricePhysical || undefined
    },
    fileUrl: m.fileUrl || undefined,
    materials: m.materials ? m.materials.split(",") : [],
    badges: m.badges ? m.badges.split(",") : [],
    isGif: m.isGif
  };
}
