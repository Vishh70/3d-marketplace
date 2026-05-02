"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShieldCheck, 
  UserCircle, 
  History,
  TrendingUp,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type AccountTabsProps = {
  tabs: Tab[];
  children: React.ReactNode;
  activeTab: string;
  onChange: (id: string) => void;
};

export function AccountTabs({ tabs, children, activeTab, onChange }: AccountTabsProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
