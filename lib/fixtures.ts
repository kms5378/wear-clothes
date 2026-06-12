import type { HomeSection, Product } from "@/lib/types";

export const sampleProducts: Product[] = [
  {
    id: "prod_coat",
    name: "Atelier Wool Coat",
    slug: "atelier-wool-coat",
    description: "Double-faced wool coat with a clean shoulder line and concealed closure.",
    price: 420,
    category: "Outerwear",
    colors: ["Charcoal", "Ivory"],
    sizes: ["S", "M", "L"],
    status: "published",
    imageUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
    accentImageUrl:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "prod_blazer",
    name: "Structured Evening Blazer",
    slug: "structured-evening-blazer",
    description: "Sharp tailoring in a compact crepe with satin-facing lapels.",
    price: 360,
    category: "Tailoring",
    colors: ["Black", "Oyster"],
    sizes: ["XS", "S", "M", "L"],
    status: "published",
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    accentImageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "prod_knit",
    name: "Cashmere Column Knit",
    slug: "cashmere-column-knit",
    description: "Fine-gauge cashmere knit with elongated ribbing and a quiet neckline.",
    price: 240,
    category: "Knitwear",
    colors: ["Ivory", "Stone", "Black"],
    sizes: ["S", "M", "L"],
    status: "published",
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    accentImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
  }
];

export const homeSections: HomeSection[] = [
  {
    id: "hero_main",
    type: "hero",
    title: "Wear Clothes",
    subtitle: "A minimal luxury wardrobe edited for calm, repeatable dressing.",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
    productIds: ["prod_coat", "prod_blazer"],
    sortOrder: 1,
    active: true
  },
  {
    id: "collection_winter",
    type: "collection",
    title: "Winter Edit",
    subtitle: "Outerwear, tailoring, and cashmere in restrained tones.",
    imageUrl:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1400&q=80",
    productIds: ["prod_coat", "prod_knit"],
    sortOrder: 2,
    active: true
  }
];

export function getProductBySlug(slug: string) {
  return sampleProducts.find((product) => product.slug === slug && product.status === "published");
}
