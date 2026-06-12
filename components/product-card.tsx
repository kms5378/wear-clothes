import Link from "next/link";
import Image from "next/image";

import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="product-media">
        <Image src={product.imageUrl} alt="" width={720} height={900} />
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p>{formatCurrency(product.price)}</p>
      </div>
    </article>
  );
}
