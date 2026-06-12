import Link from "next/link";
import Image from "next/image";

import { ProductCard } from "@/components/product-card";
import { homeSections, sampleProducts } from "@/lib/fixtures";

export default function HomePage() {
  const hero = homeSections.find((section) => section.type === "hero");

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Minimal luxury wardrobe</p>
          <h1>{hero?.title ?? "Wear Clothes"}</h1>
          <p>{hero?.subtitle}</p>
          <Link className="button" href="/products">
            Shop the edit
          </Link>
        </div>
        <div className="hero-media">
          {hero?.imageUrl ? <Image src={hero.imageUrl} alt="" width={900} height={1125} priority /> : null}
        </div>
      </section>

      <section aria-labelledby="featured-products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated pieces</p>
            <h2 id="featured-products">Featured products</h2>
          </div>
          <Link href="/products">View all</Link>
        </div>
        <div className="product-grid">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
