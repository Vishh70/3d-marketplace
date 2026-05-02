"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShoppingBag, CreditCard, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0 && status !== "success") {
      router.push("/catalogue");
    }
  }, [items, router, status]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Initialize Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, totalAmount: totalPrice }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initialize checkout");

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Melted Modulus",
        description: "3D Marketplace Transaction",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          setStatus("processing");
          // 3. Verify Payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setStatus("success");
            clearCart();
          } else {
            setError(verifyData.message || "Payment verification failed");
            setStatus("error");
          }
        },
        prefill: {
          name: "", // Can prefill if user is logged in
          email: "",
        },
        theme: {
          color: "#fa6831",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description);
        setStatus("error");
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "An error occurred during checkout");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-emerald-500/20 bg-white/[0.03] text-center shadow-2xl">
          <CardHeader className="pt-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="mt-6 text-3xl font-black text-white">Payment Successful!</CardTitle>
            <CardDescription className="text-slate-400">
              Thank you for your purchase. Your models are now available in your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            <Button 
              className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20"
              onClick={() => router.push("/account")}
            >
              Go to My Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Order Summary */}
        <div className="flex-[1.5] space-y-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-black tracking-tight text-white">Checkout</h1>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.type}`} className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-500">{item.type} access</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">₹{item.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-slate-500">x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Card */}
        <div className="flex-1">
          <Card className="sticky top-24 border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle>Total Summary</CardTitle>
              <CardDescription>Final amount to be paid securely via Razorpay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform Fee</span>
                  <span className="text-emerald-500">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-black text-white">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  className="h-14 w-full rounded-2xl bg-primary text-lg font-black text-white shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                  disabled={loading || status === "processing"}
                  onClick={handlePayment}
                >
                  {loading || status === "processing" ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                  )}
                  {status === "processing" ? "VERIFYING..." : "PAY SECURELY"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  Secured by Razorpay India
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-black/20 p-6">
              <p className="text-[10px] leading-relaxed text-slate-500 text-center uppercase tracking-widest">
                By completing this payment, you agree to the Melted Modulus terms of service and license agreement.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
