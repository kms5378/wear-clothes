export type UserRole = "customer" | "admin";

export type ProductStatus = "draft" | "published";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  colors: string[];
  sizes: string[];
  status: ProductStatus;
  imageUrl: string;
  accentImageUrl: string;
};

export type HomeSection = {
  id: string;
  type: "hero" | "collection" | "featured" | "lookbook";
  title: string;
  subtitle: string;
  imageUrl: string;
  productIds: string[];
  sortOrder: number;
  active: boolean;
};
