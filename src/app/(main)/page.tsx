import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trophy, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModelGrid } from "@/components/models/ModelGrid";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MODELS } from "@/data/mock";

export default function Home() {
  const trendingModels = MOCK_MODELS.slice(0, 4);
  const newModels = MOCK_MODELS.slice(4, 8);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 pt-6 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white min-h-[400px] flex items-center">
          {/* Abstract 3D Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1633526543814-9718c8922b7a?q=80&w=2000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <Badge variant="brand" className="mb-4 bg-primary text-primary-foreground border-transparent">
              New Platform Launch
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6 text-balance">
              Discover & Print the World's Best 3D Models
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg text-balance">
              Join millions of makers. Download high-quality, verified STL files for your next 3D printing project.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Models
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                Upload Design
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card border rounded-xl p-6">
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-bold font-display text-primary">2.5M+</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Free Models</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-bold font-display text-primary">500k+</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Creators</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-bold font-display text-primary">12M+</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Downloads</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-bold font-display text-primary">50+</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Categories</p>
          </div>
        </div>
      </section>

      {/* Active Contests Banner */}
      <section className="px-4 md:px-6">
        <Link href="/contests" className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-transform hover:scale-[1.01]">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
            <Trophy className="h-48 w-48" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display">Desktop Organizer Design Contest</h3>
              <p className="text-white/80">Win a Bambu Lab X1-Carbon Combo! Ends in 12 days.</p>
            </div>
          </div>
          <Button variant="secondary" className="relative z-10 shrink-0 bg-white text-orange-600 hover:bg-white/90">
            Join Contest <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Trending Models */}
      <section className="px-4 md:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold font-display">Trending Now</h2>
          </div>
          <Link href="/models?sort=trending">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ModelGrid models={trendingModels} showControls={false} />
      </section>

      {/* New Arrivals */}
      <section className="px-4 md:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold font-display">New Arrivals</h2>
          </div>
          <Link href="/models?sort=new">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ModelGrid models={newModels} showControls={false} />
      </section>
    </div>
  );
}
