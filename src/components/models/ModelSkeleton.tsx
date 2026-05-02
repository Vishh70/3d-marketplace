"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function ModelSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border-white/5 bg-card/50 transition-all duration-300", className)}>
      <div className="relative aspect-[4/3] bg-white/5 animate-pulse overflow-hidden">
        {/* Shimmer effect placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 bg-white/10 rounded-md w-3/4 animate-pulse" />
          <div className="flex gap-2 shrink-0">
            <div className="h-3 w-8 bg-white/5 rounded-md animate-pulse" />
            <div className="h-3 w-8 bg-white/5 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-16 bg-white/5 rounded-md animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-white/10 rounded-md animate-pulse" />
            <div className="h-7 w-7 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
