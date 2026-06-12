import { homeSections, sampleProducts } from "@/lib/fixtures";
import type { HomeSection, Product } from "@/lib/types";

export type ProductRepository = {
  listProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
};

export type HomeSectionRepository = {
  listHomeSections: () => HomeSection[];
};

export type Store = ProductRepository & HomeSectionRepository;

export const fixtureStore: Store = {
  listProducts() {
    return sampleProducts.filter((product) => product.status === "published");
  },
  getProductById(id: string) {
    return sampleProducts.find((product) => product.id === id && product.status === "published");
  },
  getProductBySlug(slug: string) {
    return sampleProducts.find((product) => product.slug === slug && product.status === "published");
  },
  listHomeSections() {
    return homeSections
      .filter((section) => section.active)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
};
