import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product-detail";
import { getProductBySlug, sampleProducts } from "@/lib/fixtures";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sampleProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <ProductDetail product={product} />
    </main>
  );
}
