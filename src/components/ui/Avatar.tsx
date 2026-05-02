import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", verified, ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-base",
      xl: "h-20 w-20 text-lg",
    };

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <div
          className={cn(
            "relative flex shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center border shadow-sm",
            sizes[size],
            className
          )}
        >
          {src ? (
            <Image
              src={src}
              alt={alt || "Avatar"}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span className="font-medium text-muted-foreground uppercase">
              {fallback?.substring(0, 2) || "??"}
            </span>
          )}
        </div>
        {verified && (
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-[2px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
