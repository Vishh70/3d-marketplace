"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Shapes,
  Printer,
  Home as HomeIcon,
  Wrench,
  Hammer,
  Gamepad2,
  Palette,
  Shirt,
  GraduationCap,
  Ghost,
  Swords,
  HeartPulse,
  Sparkles,
  Wand2,
  Users,
  UserCircle2,
  ChevronDown,
  Globe,
  LucideIcon
} from "lucide-react";

type CategoryItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  subcategories?: { id: string; label: string; href: string }[];
};

const MAIN_NAV = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "all-models", label: "All Models", icon: Shapes, href: "/models" },
  { id: "ai-lab", label: "3D Foundry", icon: Sparkles, href: "/ai-foundry" },
  { id: "maker-tools", label: "Maker Tools", icon: Wrench, href: "/tools" },
  { id: "community", label: "Community", icon: Users, href: "/community" },
  { id: "account", label: "Account", icon: UserCircle2, href: "/account" },
];

const CATEGORIES: CategoryItem[] = [
  { 
    id: "3d-printer", 
    label: "3D Printer", 
    icon: Printer, 
    href: "/categories/3d-printer",
    subcategories: [
      { id: "printer-parts", label: "Printer Parts", href: "/categories/3d-printer/parts" },
      { id: "accessories", label: "Accessories", href: "/categories/3d-printer/accessories" },
      { id: "upgrades", label: "Upgrades", href: "/categories/3d-printer/upgrades" },
    ]
  },
  { id: "household", label: "Household", icon: HomeIcon, href: "/categories/household" },
  { id: "hobby-diy", label: "Hobby & DIY", icon: Hammer, href: "/categories/hobby-diy" },
  { id: "tools", label: "Tools", icon: Wrench, href: "/categories/tools" },
  { id: "toys-games", label: "Toys & Games", icon: Gamepad2, href: "/categories/toys-games" },
  { id: "art", label: "Art", icon: Palette, href: "/categories/art" },
  { id: "fashion", label: "Fashion", icon: Shirt, href: "/categories/fashion" },
  { id: "education", label: "Education", icon: GraduationCap, href: "/categories/education" },
  { id: "costumes", label: "Costumes & Cosplay", icon: Ghost, href: "/categories/costumes" },
  { id: "miniatures", label: "Miniatures", icon: Swords, href: "/categories/miniatures" },
  { id: "health-fitness", label: "Health & Fitness", icon: HeartPulse, href: "/categories/health-fitness" },
  { id: "pop-culture", label: "Pop Culture", icon: Sparkles, href: "/categories/pop-culture" },
  { id: "generative", label: "Generative 3D Model", icon: Wand2, href: "/categories/generative" },
  { id: "creative-kit", label: "Creative Kit Model", icon: Globe, href: "/categories/creative-kit" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedCats, setExpandedCats] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-sm hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto scrollbar-hide">
      <div className="py-4 flex flex-col gap-1 px-3">
        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Categories Header */}
        <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </div>

        {/* Categories List */}
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = pathname.startsWith(cat.href);
            const isExpanded = expandedCats[cat.id];
            const hasSubcats = cat.subcategories && cat.subcategories.length > 0;

            return (
              <div key={cat.id} className="flex flex-col">
                <Link
                  href={cat.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
                    isActive
                      ? "text-foreground font-medium bg-secondary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{cat.label}</span>
                  </div>
                  {hasSubcats && (
                    <button 
                      onClick={(e) => toggleCategory(cat.id, e)}
                      className="p-1 rounded-sm hover:bg-secondary text-muted-foreground"
                    >
                      <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded ? "rotate-180" : "")} />
                    </button>
                  )}
                </Link>

                {/* Subcategories */}
                {hasSubcats && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pr-3 py-1 flex flex-col space-y-1">
                          {cat.subcategories!.map(sub => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className={cn(
                                "py-1.5 px-2 rounded-md text-xs transition-colors",
                                pathname === sub.href
                                  ? "text-primary bg-primary/5 font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
