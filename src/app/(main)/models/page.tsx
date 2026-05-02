import * as React from "react";
import { ModelGrid } from "@/components/models/ModelGrid";
import { ModelFilters } from "@/components/models/ModelFilters";
import { MOCK_MODELS } from "@/data/mock";

export default function ModelsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-20 bg-card border rounded-xl p-4 shadow-sm">
          <ModelFilters />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display mb-2">All Models</h1>
          <p className="text-muted-foreground">Browse our entire collection of verified 3D printable files.</p>
        </div>
        
        {/* We duplicate MOCK_MODELS to simulate a larger catalog */}
        <ModelGrid 
          models={[...MOCK_MODELS, ...MOCK_MODELS]} 
          hasMore={true}
        />
      </div>
    </div>
  );
}
