"use client";

import Image from "next/image";

import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <section className="product-detail">
      <div className="detail-gallery">
        <Image src={product.imageUrl} alt="" width={760} height={950} priority />
        <Image src={product.accentImageUrl} alt="" width={760} height={950} />
      </div>
      <div className="detail-info">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="price">{formatCurrency(product.price)}</p>
        <p>{product.description}</p>
        <form className="product-form">
          <label>
            Size
            <select name="size" aria-label="Size" defaultValue={product.sizes[0]}>
              {product.sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <label>
            Color
            <select name="color" aria-label="Color" defaultValue={product.colors[0]}>
              {product.colors.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>
          </label>
          <button className="button" type="button">
            Add to bag
          </button>
        </form>
        <div className="panel try-on-panel">
          <p className="eyebrow">AI fitting room</p>
          <h2>Create a private try-on image</h2>
          <p>Photo consent is required before upload. Your original photo is never shown publicly.</p>
          <label className="file-label">
            Upload photo
            <input accept="image/png,image/jpeg,image/webp" type="file" />
          </label>
          <button className="button secondary" type="button">
            Create AI try-on
          </button>
        </div>
      </div>
    </section>
  );
}
