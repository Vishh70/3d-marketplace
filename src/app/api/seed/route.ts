import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { MOCK_MODELS } from "@/data/mock";

export async function GET() {
  try {
    // 0. Clear existing data for clean seed
    await prisma.model3D.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Mock Creator
    const hashedPassword = await bcrypt.hash("password123", 10);
    const creator = await prisma.user.create({
      data: {
        email: "creator@meltedmodulus.com",
        name: "PrintMaster3D",
        password: hashedPassword,
        role: "CREATOR",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop"
      }
    });

    // 2. Create Categories
    const cat = await prisma.category.create({
      data: {
        name: "3D Printer Accessories",
        slug: "3d-printer-accessories"
      }
    });

    // 3. Seed Models
    for (const mock of MOCK_MODELS) {
      await prisma.model3D.create({
        data: {
          title: mock.title,
          thumbnail: mock.thumbnail,
          priceDigital: mock.price?.digital || 0,
          pricePhysical: mock.price?.physical || null,
          materials: mock.materials?.join(",") || "",
          badges: mock.badges?.join(",") || "",
          isGif: mock.isGif || false,
          downloads: mock.stats.downloads,
          likes: mock.stats.likes,
          creatorId: creator.id,
          categoryId: cat.id
        }
      });
    }

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Error seeding database" }, { status: 500 });
  }
}
