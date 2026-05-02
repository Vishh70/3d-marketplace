import Image from "next/image";
import Link from "next/link";
import { Trophy, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ContestsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            Design Contests
          </h1>
          <p className="text-muted-foreground">Compete, win prizes, and push the boundaries of 3D printing.</p>
        </div>
      </div>

      {/* Featured Active Contest */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581430883134-192534575771?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        
        <div className="relative z-10 p-8 md:p-12 lg:w-2/3 space-y-6 text-white">
          <Badge variant="warning" className="animate-pulse">Active Now</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-balance">
            Desktop Organizer Challenge
          </h2>
          <p className="text-slate-300 text-lg text-balance">
            Design the ultimate modular desktop organizer. The best entry wins a Bambu Lab X1-Carbon Combo and $500 in filament!
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-slate-300 py-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>Ends in 12 days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              <span>142 Entries</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>$2,500 Prize Pool</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0">
              Submit Entry
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
              View Rules
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming & Past Contests Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-display">Past Contests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden hover:border-primary/50 transition-colors group">
              <div className="h-48 bg-muted relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">Ended</Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <h4 className="text-xl font-bold font-display line-clamp-1">Print-in-Place Toys</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Create amazing toys that require zero assembly and no supports.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-emerald-600">Winner Announced</span>
                  <Button variant="ghost" size="sm" className="text-primary group-hover:bg-primary/10">
                    View Winners <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
