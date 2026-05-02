"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { 
  Printer, Home, Hammer, Wrench, Gamepad2, 
  Palette, Shirt, GraduationCap, Ghost, Swords, 
  HeartPulse, Sparkles, Wand2, Globe 
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "3d-printer", label: "3D Printer", icon: Printer, color: "bg-blue-500" },
  { id: "household", label: "Household", icon: Home, color: "bg-emerald-500" },
  { id: "hobby-diy", label: "Hobby & DIY", icon: Hammer, color: "bg-orange-500" },
  { id: "tools", label: "Tools", icon: Wrench, color: "bg-slate-500" },
  { id: "toys-games", label: "Toys & Games", icon: Gamepad2, color: "bg-pink-500" },
  { id: "art", label: "Art", icon: Palette, color: "bg-purple-500" },
  { id: "fashion", label: "Fashion", icon: Shirt, color: "bg-rose-500" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-indigo-500" },
  { id: "costumes", label: "Costumes", icon: Ghost, color: "bg-amber-500" },
  { id: "miniatures", label: "Miniatures", icon: Swords, color: "bg-red-500" },
  { id: "health", label: "Health", icon: HeartPulse, color: "bg-cyan-500" },
  { id: "pop-culture", label: "Pop Culture", icon: Sparkles, color: "bg-yellow-500" },
  { id: "generative", label: "Generative", icon: Wand2, color: "bg-violet-500" },
  { id: "kits", label: "Kits", icon: Globe, color: "bg-teal-500" },
];

export function CategoryBrowse() {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".gsap-category-item",
      { opacity: 0, scale: 0.8, y: 20 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.05, 
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="container px-4 md:px-6 relative overflow-hidden py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex flex-col items-center mb-12 space-y-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">
          Industrial Library
        </h2>
        <p className="text-3xl font-black tracking-tighter text-white">
          Explore the <span className="text-primary italic">Source</span>
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-7 xl:grid-cols-7 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="gsap-category-item opacity-0"
          >
            <Link 
              href={`/categories/${cat.id}`}
              className="flex flex-col items-center gap-4 group p-4 rounded-[24px] transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/10 relative"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity duration-500",
                  cat.color.replace("bg-", "bg-")
                )} />
                
                <div className="relative h-16 w-16 rounded-[20px] bg-black/40 border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-black group-hover:border-primary/50 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                  <cat.icon className="h-7 w-7 text-slate-500 group-hover:text-primary transition-colors duration-500" />
                </div>
              </div>
              
              <div className="space-y-1 text-center">
                <span className="block text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                  {cat.label}
                </span>
                <div className="h-0.5 w-0 mx-auto bg-primary transition-all duration-500 group-hover:w-full rounded-full" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
