"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, totalPrice, totalCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Your Collection</h2>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{totalCount} Items Staged</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/5">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  <p className="font-bold">Your cart is currently empty</p>
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="rounded-xl">
                    Continue Discovery
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.type}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          item.type === "physical" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <p className="font-black text-primary text-sm">₹{item.price * item.quantity}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02] space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>Manufacturing & Shipping</span>
                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-black uppercase tracking-tight pt-2 border-t border-white/5">
                    <span>Grand Total</span>
                    <span className="text-primary text-xl">₹{totalPrice}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/checkout";
                  }}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 group"
                >
                  <CreditCard className="h-5 w-5" />
                  PROCEED TO SECURE CHECKOUT
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground font-medium flex items-center justify-center gap-1.5 uppercase tracking-widest">
                  <CreditCard className="h-3 w-3" /> Encrypted Transaction via Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
