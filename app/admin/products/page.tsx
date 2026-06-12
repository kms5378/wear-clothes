import { Sparkles } from "lucide-react";

import { sampleProducts } from "@/lib/fixtures";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Admin</p>
      <div className="section-heading">
        <div>
          <h1>Product management</h1>
          <p>AI product image generation is available for each product draft.</p>
        </div>
        <button className="button" type="button">
          Create product
        </button>
      </div>
      <div className="admin-list">
        {sampleProducts.map((product) => (
          <article className="panel admin-row" key={product.id}>
            <div>
              <p className="eyebrow">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{formatCurrency(product.price)} · {product.status}</p>
            </div>
            <button className="button secondary" type="button">
              <Sparkles aria-hidden="true" size={16} />
              Generate AI image
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
