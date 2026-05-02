import * as React from "react";
import { cn } from "@/lib/utils";
import { Box } from "lucide-react";

export function LoadingSpinner({ className, size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <Box className={cn("animate-float text-primary", sizes[size])} strokeWidth={1.5} />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full mix-blend-multiply animate-pulse" />
      </div>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
