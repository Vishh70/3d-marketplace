export interface ModelData {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  stats: {
    downloads: number;
    likes: number;
  };
  price?: {
    digital: number;
    physical?: number;
  };
  fileUrl?: string;
  materials?: string[];
  badges?: string[];
  isGif?: boolean;
}

export const MOCK_MODELS: ModelData[] = [
  {
    id: "1",
    title: "Ashoka Stambh",
    description: "National emblem of India, meticulously detailed for high-quality gold/bronze prints. Symbols of power, courage, and confidence.",
    thumbnail: "/images/models/ashoka_stambh.png",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 1200, likes: 450 },
    price: { digital: 0, physical: 1499 },
    materials: ["Silk Gold PLA", "Brass"],
    badges: ["best-seller"],
  },
  {
    id: "2",
    title: "Buddha Murti (Abhaya Mudra)",
    description: "Serene Buddha idol in gold finish, perfect for home decor and spiritual spaces. Represents protection and peace.",
    thumbnail: "/images/models/buddha_murti.png",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 2500, likes: 890 },
    price: { digital: 0, physical: 1999 },
    materials: ["Silk Gold PLA"],
    badges: ["spiritual"],
  },
  {
    id: "10",
    title: "Buddha Murti",
    description: "Classic meditative Buddha statue for focus and tranquility. Minimalist design for modern homes.",
    thumbnail: "https://images.unsplash.com/photo-1542151629-913416246419?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 1800, likes: 620 },
    price: { digital: 0, physical: 899 },
    materials: ["White Marble PLA"],
  },
  {
    id: "3",
    title: "Jesus Christ Statue",
    description: "Elegant 20cm white marble-finish statue of Jesus Christ. Hand-finished for smooth textures.",
    thumbnail: "/images/models/jesus_statue.png",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 1500, likes: 600 },
    price: { digital: 0, physical: 2499 },
    materials: ["Marble PLA"],
  },
  {
    id: "4",
    title: "BMW M-Series Keychain",
    description: "Premium dual-tone BMW keychain for automotive enthusiasts. Durable and lightweight.",
    thumbnail: "/images/models/bmw_keychain.png",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 5000, likes: 1200 },
    price: { digital: 0, physical: 299 },
    materials: ["PLA+", "PETG"],
    badges: ["popular"],
  },
  {
    id: "11",
    title: "Photo Print Keychain",
    description: "Personalized memory captured in a 3D printed lithophane-style keychain. Just send us your photo!",
    thumbnail: "https://images.unsplash.com/photo-1610411624388-3486001097e3?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 900, likes: 310 },
    price: { digital: 0, physical: 499 },
    materials: ["White PLA"],
    badges: ["personalized"],
  },
  {
    id: "12",
    title: "Infinity Calendar 📅",
    description: "A sleek, perpetual desk calendar that lasts forever. Minimalist and satisfying interaction.",
    thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 3200, likes: 840 },
    price: { digital: 0, physical: 699 },
    materials: ["PLA", "Wood Finish"],
    badges: ["new"],
  },
  {
    id: "13",
    title: "Heart Keychain",
    description: "Set of interlocking heart keychains, perfect for couples. One heart, two pieces.",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 4100, likes: 1500 },
    price: { digital: 0, physical: 249 },
    materials: ["Red Silk PLA"],
  },
  {
    id: "14",
    title: "Labrador Model Print",
    description: "High-detail miniature of a Labrador Retriever, perfect for dog lovers and pet enthusiasts.",
    thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 1100, likes: 280 },
    price: { digital: 0, physical: 799 },
    materials: ["Gold/Brown PLA"],
  },
  {
    id: "15",
    title: "Customized Name Keychain",
    description: "3D printed name tag with custom font and colors. Ideal for bags, keys, and gifts.",
    thumbnail: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 6700, likes: 1900 },
    price: { digital: 0, physical: 199 },
    materials: ["Dual-tone PLA"],
    badges: ["custom"],
  },
  {
    id: "5",
    title: "Hexagon Fidget Keychain",
    description: "Satisfying geometric fidget toy that fits right on your keys. Relieve stress anywhere.",
    thumbnail: "/images/models/hexagon_fidget.png",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 8000, likes: 2100 },
    price: { digital: 0, physical: 199 },
    materials: ["PLA"],
    badges: ["fidget"],
  },
  {
    id: "6",
    title: "Articulated Golf Buddy",
    description: "A fun, poseable companion for your desk or golf bag. 3D printed with moving joints.",
    thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 3400, likes: 950 },
    price: { digital: 0, physical: 499 },
    materials: ["PLA"],
  },
  {
    id: "7",
    title: "Puffer Jacket Pen Stand",
    description: "Stylish and unique desk accessory inspired by modern streetwear. Keeps your pens cozy.",
    thumbnail: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 2100, likes: 540 },
    price: { digital: 0, physical: 899 },
    materials: ["PETG", "TPU"],
  },
  {
    id: "8",
    title: "Helmet Holder (Wall Mount)",
    description: "Sturdy wall mount for motorcycle helmets and gear. Saves space and protects your helmet.",
    thumbnail: "https://images.unsplash.com/photo-1558484660-5bb013b7e82e?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 1200, likes: 300 },
    price: { digital: 499, physical: 1299 },
    materials: ["PETG"],
  },
  {
    id: "9",
    title: "Sliding Photo Book",
    description: "Interactive 3D printed photo book frame with sliding mechanism. A unique way to display memories.",
    thumbnail: "https://images.unsplash.com/photo-1544391496-1ca7c9748018?q=80&w=800",
    author: { name: "Melted Modulus", verified: true },
    stats: { downloads: 4500, likes: 1100 },
    price: { digital: 0, physical: 1599 },
    materials: ["PLA"],
  }
];
