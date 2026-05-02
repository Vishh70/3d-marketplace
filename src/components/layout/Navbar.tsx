"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Box, 
  Search, 
  Menu, 
  Bell, 
  Upload, 
  UserCircle,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  // Hydration fix for next-themes
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Box className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl hidden sm:inline-block tracking-tight text-foreground">
            Maker<span className="text-primary">Verse</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl hidden md:flex mx-4 lg:mx-8">
          <SearchBar />
        </div>
        <div className="flex-1 md:hidden flex justify-end">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
            ) : <div className="h-5 w-5" />}
            <span className="sr-only">Toggle Theme</span>
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Link href="/upload" className="hidden sm:block">
            <Button className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </Link>

          {/* User Profile (Mock logged in state) */}
          <Link href="/creators/demo_user" className="ml-2">
            <Avatar fallback="DU" size="sm" className="ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
}
