"use client";

import * as React from "react";
import { ModelCard } from "./ModelCard";
import { type ModelData } from "@/data/mock";
import { ModelSkeleton } from "./ModelSkeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ModelGridProps {
  models: ModelData[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  showControls?: boolean;
}

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ModelGrid({ 
  models, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  className,
  showControls = true
}: ModelGridProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (gridRef.current) {
      gsap.fromTo(
        ".model-card-item",
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.08, 
          ease: "back.out(1.7)",
          overwrite: "auto",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, { dependencies: [models, isLoading, view], scope: gridRef });

  return (
    <div className={cn("space-y-4", className)}>
      {showControls && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{models.length}</span> models
          </p>
          <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 border">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-md", view === "grid" && "bg-background shadow-sm")}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-md", view === "list" && "bg-background shadow-sm")}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {view === "grid" ? (
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="model-card-item opacity-0">
                <ModelSkeleton />
              </div>
            ))
          ) : (
            models.map((model) => (
              <div key={model.id} className="model-card-item opacity-0">
                <ModelCard model={model} />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* List view placeholder - would implement a horizontal card variant here */}
          <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
            List view coming soon
          </div>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center pt-8 pb-4">
          <Button variant="outline" onClick={onLoadMore} className="w-full sm:w-auto">
            Load More Models
          </Button>
        </div>
      )}
      
      {isLoading && models.length > 0 && (
        <div className="flex justify-center py-6">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
}
