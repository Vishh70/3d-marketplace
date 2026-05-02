const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProducts = [
  {
    title: "Articulated Dragon",
    description: "Fully articulated dragon model with print-in-place joints.",
    price: 399,
    thumbnail: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600"],
    fileUrl: "https://example.com/dragon.stl",
    categoryId: null, // Will be set later
    tags: ["toy", "articulated", "dragon", "print-in-place"],
    authorName: "Melted Modulus",
    downloads: 450,
    likes: 120,
    isPremium: true
  },
  {
    title: "Minimalist Planter",
    description: "Modern minimalist planter perfect for succulents.",
    price: 199,
    thumbnail: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600"],
    fileUrl: "https://example.com/planter.stl",
    categoryId: null,
    tags: ["home", "decor", "planter", "minimalist"],
    authorName: "Melted Modulus",
    downloads: 800,
    likes: 340,
    isPremium: false
  },
  {
    title: "Mechanical Keyboard Case",
    description: "Custom 60% mechanical keyboard case.",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600"],
    fileUrl: "https://example.com/case.stl",
    categoryId: null,
    tags: ["tech", "keyboard", "case", "custom"],
    authorName: "Melted Modulus",
    downloads: 210,
    likes: 90,
    isPremium: true
  },
  {
    title: "Voronoi Skull",
    description: "Decorative skull with a Voronoi pattern.",
    price: 299,
    thumbnail: "https://images.unsplash.com/photo-1517436073-3b1b1b6d940c?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1517436073-3b1b1b6d940c?q=80&w=600"],
    fileUrl: "https://example.com/skull.stl",
    categoryId: null,
    tags: ["decor", "skull", "voronoi", "art"],
    authorName: "Melted Modulus",
    downloads: 650,
    likes: 210,
    isPremium: false
  },
  {
    title: "Phone Stand",
    description: "Adjustable desktop phone stand.",
    price: 99,
    thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a7982cb81?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1586953208448-b95a7982cb81?q=80&w=600"],
    fileUrl: "https://example.com/stand.stl",
    categoryId: null,
    tags: ["tech", "accessory", "stand", "desktop"],
    authorName: "Melted Modulus",
    downloads: 1200,
    likes: 500,
    isPremium: false
  },
  {
    title: "Sci-Fi Container",
    description: "Detailed sci-fi themed storage container.",
    price: 349,
    thumbnail: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600"],
    fileUrl: "https://example.com/container.stl",
    categoryId: null,
    tags: ["storage", "sci-fi", "container", "box"],
    authorName: "Melted Modulus",
    downloads: 300,
    likes: 150,
    isPremium: true
  },
  {
    title: "Topology Optimized Bracket",
    description: "High-strength lightweight bracket.",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600"],
    fileUrl: "https://example.com/bracket.stl",
    categoryId: null,
    tags: ["engineering", "bracket", "optimized", "functional"],
    authorName: "Melted Modulus",
    downloads: 150,
    likes: 80,
    isPremium: true
  },
  {
    title: "Low Poly Fox",
    description: "Cute low poly fox figure.",
    price: 149,
    thumbnail: "https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=600"],
    fileUrl: "https://example.com/fox.stl",
    categoryId: null,
    tags: ["art", "low-poly", "fox", "animal"],
    authorName: "Melted Modulus",
    downloads: 900,
    likes: 420,
    isPremium: false
  },
  {
    title: "Modular Drawer System",
    description: "Stackable and modular drawer system for small parts.",
    price: 449,
    thumbnail: "https://images.unsplash.com/photo-1595079676339-1534801ad6cb?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1595079676339-1534801ad6cb?q=80&w=600"],
    fileUrl: "https://example.com/drawer.stl",
    categoryId: null,
    tags: ["organization", "drawer", "modular", "storage"],
    authorName: "Melted Modulus",
    downloads: 550,
    likes: 260,
    isPremium: true
  },
  {
    title: "Headphone Stand",
    description: "Sleek under-desk headphone hanger.",
    price: 199,
    thumbnail: "https://images.unsplash.com/photo-1599669500515-b3e1ed55043a?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1599669500515-b3e1ed55043a?q=80&w=600"],
    fileUrl: "https://example.com/hanger.stl",
    categoryId: null,
    tags: ["tech", "audio", "headphone", "stand"],
    authorName: "Melted Modulus",
    downloads: 750,
    likes: 310,
    isPremium: false
  }
];

async function seed() {
  try {
    // 1. Ensure categories exist
    const categories = [
      { id: "cm0abc1", name: "Toys & Games", slug: "toys-games" },
      { id: "cm0abc2", name: "Home Decor", slug: "home-decor" },
      { id: "cm0abc3", name: "Tech Accessories", slug: "tech-accessories" },
      { id: "cm0abc4", name: "Art & Sculpture", slug: "art-sculpture" },
      { id: "cm0abc5", name: "Functional Parts", slug: "functional-parts" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: {},
        create: cat,
      });
    }

    // 2. Fetch admin user (Melted Modulus)
    const adminUser = await prisma.user.findFirst({
      where: { role: "CREATOR" }
    });

    if (!adminUser) {
      console.log("No CREATOR user found. Please ensure the admin user exists.");
      return;
    }

    // Assign categories mapping
    const categoryMapping = {
      "toy": "cm0abc1",
      "decor": "cm0abc2",
      "tech": "cm0abc3",
      "art": "cm0abc4",
      "engineering": "cm0abc5",
      "organization": "cm0abc2",
      "storage": "cm0abc2",
    };

    let addedCount = 0;
    
    for (const product of newProducts) {
      // Find matching category
      let catId = categories[0].id; // Default
      for (const tag of product.tags) {
        if (categoryMapping[tag]) {
          catId = categoryMapping[tag];
          break;
        }
      }

      await prisma.model3D.upsert({
        where: {
          title_creatorId: {
            title: product.title,
            creatorId: adminUser.id
          }
        },
        update: {
          downloads: product.downloads,
          likes: product.likes
        },
        create: {
          title: product.title,
          description: product.description,
          thumbnail: product.thumbnail,
          fileUrl: product.fileUrl,
          badges: JSON.stringify(product.tags),
          downloads: product.downloads,
          likes: product.likes,
          priceDigital: product.price,
          pricePhysical: product.price * 2, // Example
          categoryId: catId,
          creatorId: adminUser.id
        }
      });
      addedCount++;
    }

    console.log(`Successfully added ${addedCount} more models to the database.`);

  } catch (error) {
    console.error("Error seeding more products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
