"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { 
  Box, 
  Search, 
  Menu, 
  Upload, 
  Moon,
  Sun,
  ShoppingCart,
  ChevronDown,
  CircleUserRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { totalCount, toggleCart } = useCart();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

  // Hydration fix for next-themes
  React.useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!accountMenuOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen]);

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
            Melted<span className="text-primary">Modulus</span>
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

          <Link href="/catalogue" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Catalogue
          </Link>

          <Link href="/ai-foundry" className="hidden lg:block text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            3D Foundry
          </Link>

          <Link href="/custom-printing" className="hidden sm:block">
            <Button className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              <span>Get Quote</span>
            </Button>
          </Link>

          {status === "authenticated" ? (
            <div ref={accountMenuRef} className="relative ml-2">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 pr-3 transition hover:border-primary/30 hover:bg-primary/10"
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
              >
                <Avatar
                  fallback={(session?.user?.name || "User").slice(0, 2).toUpperCase()}
                  size="sm"
                  className="ring-2 ring-transparent transition-all cursor-pointer hover:ring-primary/50"
                />
                <div className="hidden lg:block leading-tight text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.role || "USER"}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${accountMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-[28px] border border-white/10 bg-background/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <Avatar
                      fallback={(session?.user?.name || "User").slice(0, 2).toUpperCase()}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session?.user?.email || "No email attached"}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        <ShieldCheck className="h-3 w-3" />
                        {session?.user?.role || "USER"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 py-2">
                    <Link
                      href={session?.user?.role === "ADMIN" ? "/admin" : "/account"}
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary/10 hover:text-primary"
                    >
                      <CircleUserRound className="h-4 w-4" />
                      {session?.user?.role === "ADMIN" ? "Open admin panel" : "Open account"}
                    </Link>
                    <Link
                      href="/catalogue"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Search className="h-4 w-4" />
                      Browse catalogue
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        void signOut({ callbackUrl: "/login" });
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 inline-flex h-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 text-sm font-bold text-primary transition hover:bg-primary/20"
            >
              Login
            </Link>
          )}

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
                {totalCount}
              </span>
            )}
            <span className="sr-only">Open Cart</span>
          </Button>

        </div>
      </div>
    </header>
  );
}
