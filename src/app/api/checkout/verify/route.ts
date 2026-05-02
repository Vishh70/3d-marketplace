import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    // 1. Verify Signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ message: "Transaction not legitimate!" }, { status: 400 });
    }

    // 2. Update Order Status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // 3. Logic for granting access to digital files can be added here
    // e.g., creating DownloadAccess records

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
