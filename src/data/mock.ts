import { ModelData } from "@/components/models/ModelCard";

export const MOCK_MODELS: ModelData[] = [
  {
    id: "m-101",
    title: "Articulated Dragon Print-in-Place",
    thumbnail: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "PrintMaster3D",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop"
    },
    stats: { downloads: 14200, likes: 3500 },
    badges: ["featured", "exclusive"],
    isGif: true,
  },
  {
    id: "m-102",
    title: "Bambu Lab P1P/X1 Enclosure Kit",
    thumbnail: "https://images.unsplash.com/photo-1605372423377-5264b3252fec?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "TechCreator",
      verified: true
    },
    stats: { downloads: 8400, likes: 1200 },
    badges: ["new"],
  },
  {
    id: "m-103",
    title: "Minimalist Gridfinity Organizer",
    thumbnail: "https://images.unsplash.com/photo-1581430883134-192534575771?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "OrganizeItAll"
    },
    stats: { downloads: 25600, likes: 5100 },
  },
  {
    id: "m-104",
    title: "Star Wars Stormtrooper Helmet - Wearable",
    thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "CosplayForge",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop"
    },
    stats: { downloads: 45000, likes: 8900 },
    badges: ["contest"],
  },
  {
    id: "m-105",
    title: "Self-Watering Planter Pot",
    thumbnail: "https://images.unsplash.com/photo-1416879598555-220b3cb12739?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "GreenThumb3D"
    },
    stats: { downloads: 5200, likes: 840 },
  },
  {
    id: "m-106",
    title: "Raspberry Pi 5 Arcade Case",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "RetroMaker",
      verified: true
    },
    stats: { downloads: 9100, likes: 1450 },
    badges: ["featured"],
  },
  {
    id: "m-107",
    title: "Low Poly Pokemon Chess Set",
    thumbnail: "https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "PolyArt"
    },
    stats: { downloads: 12400, likes: 2100 },
    isGif: true,
  },
  {
    id: "m-108",
    title: "Mechanical Keyboard Keycaps - SA Profile",
    thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "KeebNerd"
    },
    stats: { downloads: 3800, likes: 450 },
  }
];
