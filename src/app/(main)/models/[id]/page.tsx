"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Download, Heart, Share2, Printer, Box,
  Star, ShoppingBag, Eye, ChevronLeft, Badge as BadgeIcon,
  Layers, Zap, Package, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModelViewer3D } from "@/components/models/ModelViewer3D";
import { ModelData, MOCK_MODELS } from "@/data/mock";
import { useCart } from "@/context/CartContext";

// Map product IDs to 3D shape types for the viewer
const MODEL_SHAPES: Record<string, string> = {
  "1": "statue",
  "2": "statue",
  "3": "figurine",
  "4": "keychain",
  "5": "fidget",
  "6": "figurine",
  "7": "organizer",
  "8": "mechanical",
  "9": "organizer",
};

const PRINT_SPECS: Record<string, { layer: string; infill: string; material: string; supports: string; time: string }> = {
  "1": { layer: "0.12mm", infill: "25% Gyroid", material: "Silk Gold PLA", supports: "None", time: "~4h 20m" },
  "2": { layer: "0.12mm", infill: "20% Gyroid", material: "Silk Gold PLA", supports: "Minimal", time: "~5h 10m" },
  "3": { layer: "0.15mm", infill: "30%", material: "Marble PLA", supports: "Yes", time: "~6h" },
  "4": { layer: "0.20mm", infill: "15%", material: "PLA+", supports: "None", time: "~1h 10m" },
  "5": { layer: "0.20mm", infill: "15%", material: "PLA", supports: "None", time: "~45m" },
  "6": { layer: "0.20mm", infill: "20%", material: "PLA", supports: "None", time: "~2h 30m" },
  "7": { layer: "0.15mm", infill: "25%", material: "PETG", supports: "Minimal", time: "~3h" },
  "8": { layer: "0.20mm", infill: "40%", material: "PETG", supports: "Yes", time: "~4h" },
  "9": { layer: "0.15mm", infill: "20%", material: "PLA", supports: "None", time: "~2h 45m" },
};

export default function ModelDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [model, setModel] = useState<ModelData | null>(null);
  const [activeTab, setActiveTab] = useState<"3d" | "photo">("3d");
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Try database first, fallback to mock
    async function fetchModel() {
      try {
        const res = await fetch(`/api/models?id=${id}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setModel(data.find((m: ModelData) => m.id === id) || data[0]);
        } else {
          setModel(MOCK_MODELS.find(m => m.id === id) || MOCK_MODELS[0]);
        }
      } catch {
        setModel(MOCK_MODELS.find(m => m.id === id) || MOCK_MODELS[0]);
      }
    }
    fetchModel();
  }, [id]);

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading model...</p>
        </div>
      </div>
    );
  }

  const printSpec = PRINT_SPECS[id] || PRINT_SPECS["1"];
  const shapeType = MODEL_SHAPES[id] || "figurine";


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/catalogue" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Catalogue
        </Link>
        <span className="text-muted-foreground/40">›</span>
        <span className="text-foreground font-medium line-clamp-1">{model.title}</span>
      </div>

      {/* Title Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {model.badges?.map((badge) => (
              <span key={badge} className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{model.title}</h1>
          <p className="text-muted-foreground">{model.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant={liked ? "default" : "outline"}
            size="icon"
            className={`h-10 w-10 rounded-xl transition-all ${liked ? "bg-rose-500 border-rose-500 text-white" : "text-rose-500 border-rose-500/30"}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left/Main Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Viewer Tab Switcher */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "3d" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
              onClick={() => setActiveTab("3d")}
            >
              <span className="flex items-center gap-2"><Box className="h-4 w-4" /> 3D Preview</span>
            </button>
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "photo" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
              onClick={() => setActiveTab("photo")}
            >
              <span className="flex items-center gap-2"><Eye className="h-4 w-4" /> Gallery</span>
            </button>
          </div>

          {/* 3D Viewer */}
          {activeTab === "3d" ? (
            <ModelViewer3D title={model.title} type={shapeType} height="h-[380px] md:h-[520px]" />
          ) : (
            <div className="h-[380px] md:h-[520px] relative rounded-3xl overflow-hidden border border-white/10">
              <Image src={model.thumbnail} alt={model.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Thumbnail Row */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("3d")}
              className={`h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-[#0c0c0c] ${activeTab === "3d" ? "border-primary shadow-lg shadow-primary/20" : "border-white/10 hover:border-white/30"}`}
            >
              <Box className="h-8 w-8 text-primary/60" />
            </button>
            <button
              onClick={() => setActiveTab("photo")}
              className={`h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 relative transition-all ${activeTab === "photo" ? "border-primary shadow-lg shadow-primary/20" : "border-white/10 hover:border-white/30"}`}
            >
              <Image src={model.thumbnail} alt="photo" fill className="object-cover" />
            </button>
          </div>

          {/* About + Print Specs */}
          <div className="space-y-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">About This Model</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-primary hover:bg-primary/10 rounded-full font-bold"
                  onClick={() => {
                    const event = new CustomEvent('MAKERVERSE_GROK_ASK', { 
                      detail: { 
                        message: `Help me with the best print settings for the ${model.title}. It uses ${printSpec.material} and has a ${printSpec.layer} layer height. Any tips?` 
                      } 
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Ask Grok Expert
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {model.description} Manufactured with precision by the Melted Modulus team using
                high-grade biodegradable polymers. Each print is hand-inspected for quality.
              </p>
            </div>

            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Layers className="h-5 w-5 text-primary" /> Print Specifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Layer Height", value: printSpec.layer },
                  { label: "Infill", value: printSpec.infill },
                  { label: "Material", value: printSpec.material },
                  { label: "Supports", value: printSpec.supports },
                  { label: "Print Time", value: printSpec.time },
                  { label: "Printer", value: "Bambu Lab X1C" },
                ].map((spec, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{spec.label}</p>
                    <p className="text-white font-bold mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-5">
          {/* Build Options */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4 sticky top-24">
            {/* Stats Row */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5">
                <Download className="h-4 w-4" />
                <span className="font-bold text-foreground">{model.stats.downloads.toLocaleString()}</span>
                <span>downloads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span className="font-bold text-foreground">{model.stats.likes.toLocaleString()}</span>
                <span>likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">4.9</span>
              </div>
            </div>

            {/* Physical Print Estimate */}
            {model.price?.physical && (
              <div className="border-2 border-primary/30 rounded-2xl p-5 bg-primary/5 space-y-3 group hover:border-primary/60 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" /> Print Estimate
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Quote-ready production estimate across India</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">₹{model.price.physical}</p>
                    <p className="text-xs text-muted-foreground">Estimated manufacturing cost</p>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 font-black text-lg rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => addToCart({
                    id: model.id,
                    title: `${model.title} (Physical Print)`,
                    thumbnail: model.thumbnail,
                    price: model.price?.physical || 0,
                    type: "physical"
                  })}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" /> Add to Cart
                  </span>
                </Button>
              </div>
            )}

            {/* Digital STL */}
            <div className="border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" /> STL Access
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {model.fileUrl ? "Direct download available" : "Generate a file in 3D Foundry"}
                  </p>
                </div>
                <p className="text-2xl font-black">
                  {model.price?.digital === 0 || !model.price ? "Free" : `₹${model.price.digital}`}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-11 font-bold rounded-xl border-white/10 hover:bg-white/5 gap-2"
                onClick={() => addToCart({
                  id: model.id,
                  title: `${model.title} (Digital STL)`,
                  thumbnail: model.thumbnail,
                  price: model.price?.digital || 0,
                  type: "digital"
                })}
              >
                <Download className="h-4 w-4" />
                {model.fileUrl ? "Add Digital to Cart" : "Open 3D Foundry"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Zap, label: "48h Ship" },
                { icon: Printer, label: "Verified" },
                { icon: BadgeIcon, label: "Genuine" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <b.icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          {model.materials && model.materials.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Available In</h4>
              <div className="flex flex-wrap gap-2">
                {model.materials.map((mat) => (
                  <span key={mat} className="px-3 py-1.5 text-xs font-bold rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creator */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-black text-lg shrink-0">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold">{model.author.name}</p>
              <p className="text-xs text-muted-foreground">Verified Creator · Hyderabad, India</p>
            </div>
            {model.author.name === "Melted Modulus" && (
              <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                PRO TEAM
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
