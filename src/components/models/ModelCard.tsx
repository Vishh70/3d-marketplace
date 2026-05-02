import * as React from "react";
import Link from "next/link";
import { Download, Heart, Box, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { type ModelData } from "@/data/mock";
import { useCart } from "@/context/CartContext";

export function ModelCard({ model, className }: { model: ModelData; className?: string }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: model.id,
      title: model.title,
      thumbnail: model.thumbnail,
      price: model.price?.digital || 0,
      type: "digital"
    });
  };
  return (
    <Card className={cn("group overflow-hidden border-transparent bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer", className)}>
      <Link href={`/models/${model.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${model.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop"})` }}
          />
          
          {/* 3D Preview badge */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10">
              <Box className="h-3 w-3 text-primary" /> 3D Preview
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {model.badges?.map((badge) => (
              <span key={badge} className="bg-primary/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg">
                {badge}
              </span>
            ))}
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2 gap-2">
            <button className="bg-white/10 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-primary transition-colors" onClick={(e) => e.preventDefault()}>
              <Heart className="h-4 w-4" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-primary transition-colors" onClick={(e) => e.preventDefault()}>
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>

      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/models/${model.id}`} className="block group-hover:text-primary transition-colors flex-1 min-w-0">
            <h3 className="font-bold text-sm line-clamp-1 leading-snug tracking-tight">
              {model.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
             <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
               <Heart className="h-3 w-3" /> {model.stats.likes}
             </div>
             <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
               <Download className="h-3 w-3" /> {model.stats.downloads}
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <Avatar fallback={model.author.name[0]} size="sm" className="h-6 w-6 border border-white/10" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
              {model.author.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-primary">
              {model.price?.digital === 0 || !model.price ? "FREE" : `₹${model.price.digital}`}
            </span>
            <Button 
              size="icon" 
              className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 hover:bg-primary transition-all group/btn"
              onClick={handleAdd}
            >
              <ShoppingCart className="h-3.5 w-3.5 text-slate-400 group-hover/btn:text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
