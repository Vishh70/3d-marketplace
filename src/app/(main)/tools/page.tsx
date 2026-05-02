import Link from "next/link";
import { Wrench, Box, Move3d, Cloud, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-display tracking-tight">Maker Tools Hub</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Everything you need to design, modify, and prepare your 3D models. Access powerful web-based tools directly from your browser.
        </p>
      </div>

      {/* Featured Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tinkercad */}
        <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
          <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-400 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white font-display">Tinkercad</h3>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            <Badge className="w-fit mb-3" variant="secondary">Beginner CAD</Badge>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              A free, easy-to-use web app that equips the next generation of designers and engineers with the foundational skills for innovation.
            </p>
            <a href="https://www.tinkercad.com/" target="_blank" rel="noopener noreferrer" className="w-full gap-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground h-9 px-4 py-2 transition-colors">
              Launch Tool <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>

        {/* SculptGL */}
        <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
          <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white font-display">SculptGL</h3>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            <Badge className="w-fit mb-3" variant="secondary">Organic Sculpting</Badge>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              A tiny sculpting web application. Create organic, clay-like models directly in your browser without any installation.
            </p>
            <a href="https://stephaneginier.com/sculptgl/" target="_blank" rel="noopener noreferrer" className="w-full gap-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground h-9 px-4 py-2 transition-colors">
              Launch Tool <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>

        {/* BuildBee */}
        <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
          <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-400 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white font-display">BuildBee</h3>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            <Badge className="w-fit mb-3" variant="secondary">Cloud Slicer</Badge>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              The easiest way to 3D print. Cloud-based slicing and printer management right from your phone or desktop browser.
            </p>
            <a href="https://buildbee.com/" target="_blank" rel="noopener noreferrer" className="w-full gap-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground h-9 px-4 py-2 transition-colors">
              Launch Tool <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>

      </div>

      {/* Internal Tools Teaser */}
      <div className="bg-card border rounded-2xl p-8 md:p-12 text-center mt-12 space-y-6 max-w-4xl mx-auto shadow-sm">
        <h2 className="text-2xl font-bold font-display">MakerVerse Native Tools</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We are currently developing built-in tools for STL repair, basic mesh modification, and G-Code previewing. Coming in Phase 4.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-muted-foreground">
            <Box className="h-4 w-4" /> In-browser STL Repair
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-muted-foreground">
            <Move3d className="h-4 w-4" /> Mesh Decimation
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-muted-foreground">
            <Cloud className="h-4 w-4" /> Cloud Slicing Integration
          </div>
        </div>
      </div>
    </div>
  );
}
