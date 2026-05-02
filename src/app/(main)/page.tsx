"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryBrowse } from "@/components/home/CategoryBrowse";
import { ModelGrid } from "@/components/models/ModelGrid";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import Link from "next/link";
import { ModelData } from "@/data/mock";

export default function HomePage() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/models");
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection />
      <CategoryBrowse />

      {/* Featured Models Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-xs">
              <Sparkles className="h-3 w-3" />
              <span>Premium Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Featured by Melted Modulus</h2>
          </div>
          <Link href="/catalogue">
            <Button variant="ghost" className="group gap-2 hover:bg-primary/10 hover:text-primary transition-all">
              View Full Catalogue
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <ModelGrid models={models.slice(0, 8)} isLoading={loading} />
      </section>

      {/* Trending Section */}
      <section className="container px-4 md:px-6 bg-white/[0.02] py-16 -mx-4 md:-mx-6 w-[100vw] self-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">Trending in India</h2>
            </div>
          </div>
          <ModelGrid models={models.slice(0, 4)} isLoading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 py-12">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 md:p-12 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Got a custom design in mind?</h2>
            <p className="text-slate-400 max-w-md text-lg">
              We bring your ideas to life with industrial-grade 3D printing. Get a quote within minutes.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link href="/custom-printing">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
