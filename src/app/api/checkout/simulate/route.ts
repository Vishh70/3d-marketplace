import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { items, totalAmount } = await req.json();

    // 1. Create a "PAID" simulated order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        status: "PAID",
        razorpayOrderId: "sim_" + Math.random().toString(36).substring(7),
        razorpayPaymentId: "pay_" + Math.random().toString(36).substring(7),
        items: {
          create: items.map((item: any) => ({
            modelId: item.model.id,
            price: item.price,
            type: item.type,
            quantity: 1,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Simulated checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
