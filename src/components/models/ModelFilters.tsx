"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface FilterSection {
  id: string;
  title: string;
  options: { id: string; label: string; count?: number }[];
}

const FILTERS: FilterSection[] = [
  {
    id: "printing-method",
    title: "Printing Method",
    options: [
      { id: "fdm", label: "FDM / FFF", count: 1240 },
      { id: "resin", label: "Resin (SLA/DLP)", count: 432 },
      { id: "sls", label: "SLS", count: 89 },
    ]
  },
  {
    id: "license",
    title: "License Type",
    options: [
      { id: "free", label: "Free (CC)", count: 2100 },
      { id: "commercial", label: "Commercial", count: 150 },
      { id: "editorial", label: "Editorial Only", count: 45 },
    ]
  },
  {
    id: "format",
    title: "File Format",
    options: [
      { id: "stl", label: "STL", count: 1800 },
      { id: "obj", label: "OBJ", count: 650 },
      { id: "3mf", label: "3MF (Recommended)", count: 420 },
      { id: "step", label: "STEP", count: 120 },
    ]
  }
];

export function ModelFilters({ className }: { className?: string }) {
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    "printing-method": true,
    "license": true,
  });

  const toggleFilter = (sectionId: string, optionId: string) => {
    setActiveFilters(prev => {
      const section = prev[sectionId] || [];
      if (section.includes(optionId)) {
        return { ...prev, [sectionId]: section.filter(id => id !== optionId) };
      } else {
        return { ...prev, [sectionId]: [...section, optionId] };
      }
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg font-display">Filters</h3>
        <button 
          onClick={() => setActiveFilters({})}
          className="text-xs text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {FILTERS.map((section) => (
          <div key={section.id} className="border-b border-border/50 pb-4 last:border-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              {section.title}
              <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections[section.id] ? "rotate-180" : "")} />
            </button>
            
            {expandedSections[section.id] && (
              <div className="mt-2 space-y-2">
                {section.options.map((option) => {
                  const isActive = activeFilters[section.id]?.includes(option.id);
                  return (
                    <label 
                      key={option.id} 
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border transition-colors",
                          isActive ? "bg-primary border-primary text-primary-foreground" : "border-input group-hover:border-primary/50"
                        )}>
                          {isActive && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {option.label}
                        </span>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-xs text-muted-foreground/60">
                          {option.count}
                        </span>
                      )}
                      {/* Hidden checkbox for accessibility */}
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={isActive}
                        onChange={() => toggleFilter(section.id, option.id)}
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
