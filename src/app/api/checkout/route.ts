import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Razorpay from "razorpay";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // 1. Create Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 2. Create Pending Order in Prisma
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: totalAmount,
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: items.map((item: any) => ({
            modelId: item.id,
            price: item.price,
            type: item.type.toUpperCase(), // DIGITAL or PHYSICAL
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error) {
    console.error("Checkout initialization error:", error);
    return NextResponse.json({ message: "Could not initialize checkout" }, { status: 500 });
  }
}
