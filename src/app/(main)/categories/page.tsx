import Link from "next/link";
import { 
  Printer, Home, Hammer, Wrench, Gamepad2, Palette, Shirt, 
  GraduationCap, Ghost, Swords, HeartPulse, Sparkles, Wand2, Globe 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const CATEGORIES = [
  { id: "3d-printer", label: "3D Printer", icon: Printer, desc: "Parts, accessories, and upgrades", count: "12.4k" },
  { id: "household", label: "Household", icon: Home, desc: "Practical prints for daily life", count: "45.1k" },
  { id: "hobby-diy", label: "Hobby & DIY", icon: Hammer, desc: "Tools and parts for makers", count: "28.3k" },
  { id: "tools", label: "Tools", icon: Wrench, desc: "Functional 3D printed tools", count: "15.7k" },
  { id: "toys-games", label: "Toys & Games", icon: Gamepad2, desc: "Fun prints for all ages", count: "52.9k" },
  { id: "art", label: "Art", icon: Palette, desc: "Sculptures and decorative pieces", count: "31.2k" },
  { id: "fashion", label: "Fashion", icon: Shirt, desc: "Wearables and jewelry", count: "8.4k" },
  { id: "education", label: "Education", icon: GraduationCap, desc: "Learning aids and models", count: "11.1k" },
  { id: "costumes", label: "Costumes & Cosplay", icon: Ghost, desc: "Props and armor", count: "19.8k" },
  { id: "miniatures", label: "Miniatures", icon: Swords, desc: "Tabletop and dioramas", count: "41.5k" },
  { id: "health-fitness", label: "Health & Fitness", icon: HeartPulse, desc: "Ergonomics and gear", count: "5.2k" },
  { id: "pop-culture", label: "Pop Culture", icon: Sparkles, desc: "Fan art and replicas", count: "36.7k" },
  { id: "generative", label: "Generative 3D Model", icon: Wand2, desc: "Algorithmic designs", count: "2.1k" },
  { id: "creative-kit", label: "Creative Kit Model", icon: Globe, desc: "Multi-part kits", count: "4.8k" },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold font-display mb-2">Categories</h1>
        <p className="text-muted-foreground">Explore thousands of 3D models organized by category.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.id}`}>
            <Card className="hover:border-primary/50 transition-colors group cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <cat.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.desc}</p>
                </div>
                <div className="mt-auto pt-2">
                  <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {cat.count} models
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
