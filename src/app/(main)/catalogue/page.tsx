"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModelGrid } from "@/components/models/ModelGrid";
import { type ModelData } from "@/data/mock";

export default function CataloguePage() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      try {
        const url = new URL("/api/models", window.location.origin);
        if (selectedCategoryId) url.searchParams.set("categoryId", selectedCategoryId);
        
        const res = await fetch(url.toString());
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, [selectedCategoryId]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Catalogue</h1>
          <p className="text-sm text-muted-foreground font-medium">Explore the complete Melted Modulus repository</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search 3D models..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0 border-white/10 hover:bg-white/5">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        {/* Real Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={selectedCategoryId === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
            className={cn("rounded-full px-5 font-bold h-9", selectedCategoryId !== null && "border-white/10 hover:bg-white/5")}
          >
            All Models
          </Button>
          {categories.map((cat) => (
            <Button 
              key={cat.id}
              variant={selectedCategoryId === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={cn("rounded-full px-5 font-bold h-9 whitespace-nowrap", selectedCategoryId !== cat.id && "border-white/10 hover:bg-white/5")}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* The Grid */}
        <ModelGrid 
          models={models.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))} 
          isLoading={loading} 
        />
      </div>

      {/* Footer CTA */}
      <div className="py-20 flex flex-col items-center text-center space-y-6 bg-white/[0.01] rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[100px] pointer-events-none -z-10" />
        <div className="space-y-2">
          <h2 className="text-3xl font-black">Can&apos;t find what you need?</h2>
          <p className="text-slate-400 max-w-md mx-auto font-medium">
            Our master designers can build custom models to your exact specifications.
          </p>
        </div>
        <Button className="rounded-2xl gap-3 h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 font-black text-lg group">
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          Chat on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
