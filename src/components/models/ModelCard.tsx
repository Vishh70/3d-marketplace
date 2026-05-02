import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Heart, PlaySquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export interface ModelData {
  id: string;
  title: string;
  thumbnail: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  stats: {
    downloads: number;
    likes: number;
  };
  badges?: Array<"exclusive" | "contest" | "featured" | "new">;
  isGif?: boolean;
}

export function ModelCard({ model, className }: { model: ModelData; className?: string }) {
  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  return (
    <Card className={cn("group overflow-hidden border-transparent bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Mock image - in reality we'd use next/image with the thumbnail URL */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${model.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop"})` }}
        />
        
        {/* Top left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {model.badges?.includes("exclusive") && (
            <Badge variant="brand" className="shadow-sm">EMP Exclusive</Badge>
          )}
          {model.badges?.includes("contest") && (
            <Badge variant="warning" className="shadow-sm">Contest</Badge>
          )}
        </div>

        {/* Top right indicator */}
        {model.isGif && (
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground shadow-sm flex items-center gap-1">
            <PlaySquare className="h-3 w-3" /> GIF
          </div>
        )}

        {/* Bottom gradient & Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2 gap-2">
          <button className="bg-background/90 text-foreground p-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Heart className="h-4 w-4" />
          </button>
          <button className="bg-background/90 text-foreground p-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CardContent className="p-3">
        <Link href={`/models/${model.id}`} className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-medium text-sm line-clamp-2 leading-snug">
            {model.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-auto">
          <Link href={`/creators/${model.author.name}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity min-w-0">
            <Avatar 
              src={model.author.avatar} 
              fallback={model.author.name} 
              size="sm" 
              verified={model.author.verified}
              className="h-5 w-5 text-[10px]"
            />
            <span className="text-xs text-muted-foreground truncate">{model.author.name}</span>
          </Link>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(model.stats.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatNumber(model.stats.likes)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
