import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Heart, Share2, Printer, CheckCircle2, Box, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ModelViewer3D } from "@/components/models/ModelViewer3D";
import { MOCK_MODELS } from "@/data/mock";

// In a real app, this would fetch from a database based on params.id
export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const model = MOCK_MODELS.find(m => m.id === params.id) || MOCK_MODELS[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/categories/3d-printer" className="text-sm text-primary hover:underline font-medium">
              3D Printer Parts
            </Link>
            <span className="text-muted-foreground text-sm">&gt;</span>
            <span className="text-muted-foreground text-sm">Upgrades</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display">{model.title}</h1>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" className="gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 border-rose-200 dark:border-rose-900">
            <Heart className="h-4 w-4" /> Save ({model.stats.likes})
          </Button>
          <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Download className="h-5 w-5" /> Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Viewer / Gallery */}
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border bg-muted">
            {/* In a real app we'd load the 3D model, for now we show the viewer component which has a placeholder */}
            <ModelViewer3D />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {/* Thumbnails */}
             <div className="h-20 w-32 shrink-0 rounded-md bg-card border-2 border-primary overflow-hidden relative cursor-pointer">
                <Image src={model.thumbnail} alt="Thumbnail 1" fill className="object-cover" />
             </div>
             <div className="h-20 w-32 shrink-0 rounded-md bg-muted border overflow-hidden relative cursor-pointer hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                  <Box className="h-6 w-6 text-muted-foreground" />
                </div>
             </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="font-display">About this model</h2>
            <p>
              This is a highly detailed, print-in-place model designed to be printed without supports. 
              It has been tested extensively on Bambu Lab, Prusa, and Creality machines. 
              Ensure your bed is leveled perfectly for the best first layer adhesion.
            </p>
            <h3>Print Settings</h3>
            <ul>
              <li><strong>Layer Height:</strong> 0.16mm - 0.20mm</li>
              <li><strong>Infill:</strong> 15% Gyroid</li>
              <li><strong>Supports:</strong> None required</li>
              <li><strong>Material:</strong> PLA, PETG, or ABS</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Author & Meta */}
        <div className="space-y-6">
          {/* Author Card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <Avatar src={model.author.avatar} fallback={model.author.name} size="xl" verified={model.author.verified} />
              <div>
                <Link href={`/creators/${model.author.name}`} className="font-bold text-lg hover:text-primary transition-colors">
                  {model.author.name}
                </Link>
                <p className="text-sm text-muted-foreground">Pro Creator • 124 Models</p>
              </div>
              <div className="flex gap-2 w-full pt-2">
                <Button className="w-full">Follow</Button>
                <Button variant="outline" className="w-full">Tip Creator</Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Meta */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-start gap-3">
                  <Printer className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Certified Printable</h4>
                    <p className="text-xs text-muted-foreground mt-1">Verified on Bambu Lab X1C & Prusa MK4.</p>
                  </div>
                </div>
                <div className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">License</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Creative Commons - Attribution - Non-Commercial
                    </p>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Articulated</Badge>
                  <Badge variant="secondary">Print-in-Place</Badge>
                  <Badge variant="secondary">No Supports</Badge>
                  <Badge variant="secondary">Toy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card>
            <div className="p-4 border-b bg-muted/50 font-medium flex justify-between items-center">
              <span>Model Files (2)</span>
              <span className="text-xs text-muted-foreground">34.2 MB total</span>
            </div>
            <CardContent className="p-0 divide-y">
              <div className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">dragon_body_v2.3mf</p>
                  <p className="text-xs text-muted-foreground">12.4 MB</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Download className="h-4 w-4" /></Button>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">dragon_wings_v2.3mf</p>
                  <p className="text-xs text-muted-foreground">21.8 MB</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Download className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
