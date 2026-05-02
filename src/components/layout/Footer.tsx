"use client";

import Link from "next/link";
import { Box, Globe, MessageCircle, Mail, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 shrink-0 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Box className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Melted<span className="text-primary">Modulus</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 text-balance leading-relaxed">
              India-wide hub for high-precision 3D prints, custom models, and industrial-grade manufacturing.
            </p>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Join the Inner Circle</h4>
              <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:border-primary/50 outline-none transition-all"
                />
                <button className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-primary/90 transition-all">
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-foreground uppercase text-xs tracking-widest">Marketplace</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/catalogue" className="hover:text-primary transition-colors">All Models</Link></li>
              <li><Link href="/categories/household" className="hover:text-primary transition-colors">Household</Link></li>
              <li><Link href="/categories/toys-games" className="hover:text-primary transition-colors">Toys & Games</Link></li>
              <li><Link href="/categories/pop-culture" className="hover:text-primary transition-colors">Pop Culture</Link></li>
              <li><Link href="/categories/generative" className="hover:text-primary transition-colors">AI Generative</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground uppercase text-xs tracking-widest">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground uppercase text-xs tracking-widest">Connect</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="https://www.instagram.com/melted_modulus" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" /> Instagram
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-4 w-4" /> Website
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> Email
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" /> Twitter
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Melted Modulus. Imagine • Inspire. Handcrafted in India.</p>
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> India (EN)</span>
            <span className="font-bold text-foreground">₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
