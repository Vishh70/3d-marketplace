"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Box, Zap } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import dynamic from "next/dynamic";

// Dynamic import — Three.js can't run on the server
const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function HeroSection() {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".gsap-hero-element",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 min-h-[80vh] flex items-center">
      {/* Three.js background */}
      <HeroScene />

      {/* Gradient overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none z-[1]" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="gsap-hero-element inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold backdrop-blur-sm shadow-xl">
            <Zap className="h-4 w-4 fill-primary" />
            <span>The Future of 3D Manufacturing</span>
          </div>

          {/* Heading */}
          <div className="gsap-hero-element space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] italic">
              MELTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">MODULUS</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Premium 3D model repository and industrial-grade AI Foundry for the next generation of makers.
            </p>
          </div>

          {/* Actions */}
          <div className="gsap-hero-element flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/catalogue" className="w-full sm:w-auto">
              <Button size="lg" className="h-16 px-10 text-lg font-black rounded-2xl w-full sm:w-auto shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
                Explore Catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/custom-printing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl w-full sm:w-auto border-white/10 hover:bg-white/5 transition-all active:scale-95">
                Custom Quote
                <Box className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="gsap-hero-element pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-white/5 mt-12">
            {[
              { label: "India Wide", sub: "Fast Shipping" },
              { label: "10+ Materials", sub: "Industrial Grade" },
              { label: "3D Foundry", sub: "Image to STL Lab" },
              { label: "Precision", sub: "0.1mm Tolerance" }
            ].map((feature, i) => (
              <div key={i} className="space-y-1">
                <div className="text-white font-bold text-lg">{feature.label}</div>
                <div className="text-slate-500 text-sm">{feature.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
