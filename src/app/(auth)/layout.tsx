import * as React from "react";
import Link from "next/link";
import { Box } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Box className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Maker<span className="text-primary">Verse</span>
          </span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
