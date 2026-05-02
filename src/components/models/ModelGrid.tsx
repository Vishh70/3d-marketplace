"use client";

import * as React from "react";
import { ModelCard, type ModelData } from "./ModelCard";
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

export function ModelGrid({ 
  models, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  className,
  showControls = true
}: ModelGridProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
          {isLoading && (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-xl border bg-card aspect-[4/3] animate-pulse" />
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
