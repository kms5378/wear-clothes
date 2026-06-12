import { ProductCard } from "@/components/product-card";
import { sampleProducts } from "@/lib/fixtures";

export default function ProductsPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Shop</p>
      <h1>Collection</h1>
      <div className="product-grid">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
