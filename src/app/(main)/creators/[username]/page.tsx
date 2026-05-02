"use client";

import * as React from "react";
import { MapPin, Link as LinkIcon, Share2, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ModelGrid } from "@/components/models/ModelGrid";
import { MOCK_MODELS } from "@/data/mock";

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = React.useState("models");
  
  // Filter mock models to pretend they belong to this user
  const userModels = MOCK_MODELS.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-16">
      {/* Profile Header */}
      <div className="relative rounded-2xl overflow-hidden bg-card border mb-8">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="px-6 md:px-10 pb-8 relative flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 md:-mt-20">
          {/* Avatar */}
          <div className="relative shrink-0 rounded-full p-2 bg-card border">
            <Avatar 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format&fit=crop" 
              fallback="PM" 
              size="xl" 
              className="h-28 w-28 md:h-36 md:w-36"
            />
            <div className="absolute bottom-4 right-4 bg-background rounded-full p-0.5">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left pt-16 md:pt-0">
            <h1 className="text-3xl font-bold font-display tracking-tight flex items-center justify-center md:justify-start gap-2">
              {params.username}
            </h1>
            <p className="text-muted-foreground mt-1 mb-4 max-w-2xl">
              Professional 3D modeler specializing in print-in-place designs and functional mechanical parts.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> San Francisco, CA</div>
              <div className="flex items-center gap-1.5"><LinkIcon className="h-4 w-4" /> printmaster3d.com</div>
              <div className="flex items-center gap-1.5"><Share2 className="h-4 w-4" /> @printmaster3d</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto px-8">Follow</Button>
            <Button size="lg" variant="outline" className="w-full md:w-auto">Message</Button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 md:grid-cols-5 border-t divide-x">
          <div className="p-4 text-center">
            <div className="font-bold text-xl font-display">142</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Models</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-bold text-xl font-display">25k</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-bold text-xl font-display">1.2M</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Downloads</div>
          </div>
          <div className="p-4 text-center hidden md:block">
            <div className="font-bold text-xl font-display">485k</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Likes</div>
          </div>
          <div className="p-4 text-center hidden md:block text-emerald-600 dark:text-emerald-500">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold">Pro Tier</div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        tabs={[
          { id: "models", label: "Models (142)" },
          { id: "collections", label: "Collections (8)" },
          { id: "makes", label: "Makes (34)" },
          { id: "about", label: "About" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      <TabsContent value="models" activeTab={activeTab}>
        <ModelGrid models={userModels} hasMore={false} />
      </TabsContent>
      
      <TabsContent value="collections" activeTab={activeTab}>
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
          Collections coming soon
        </div>
      </TabsContent>
      
      <TabsContent value="makes" activeTab={activeTab}>
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
          User makes coming soon
        </div>
      </TabsContent>

      <TabsContent value="about" activeTab={activeTab}>
        <div className="bg-card border rounded-xl p-6 max-w-3xl">
          <h3 className="text-xl font-bold font-display mb-4">About Me</h3>
          <p className="text-muted-foreground">
            I'm a mechanical engineer by day and 3D printing enthusiast by night. I focus on creating designs that push the limits of FDM printing without requiring supports or assembly hardware.
          </p>
        </div>
      </TabsContent>
    </div>
  );
}
