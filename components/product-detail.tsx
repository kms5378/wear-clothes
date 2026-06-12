"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [message, setMessage] = useState("");

  async function createTryOn() {
    if (!photo || !consent) {
      setMessage("Upload a photo and confirm consent first.");
      return;
    }

    const form = new FormData();
    form.set("userId", "demo_customer");
    form.set("role", "customer");
    form.set("productId", product.id);
    form.set("productImageUrl", product.imageUrl);
    form.set("consent", "true");
    form.set("photo", photo);

    setMessage("Generating private try-on image...");
    const response = await fetch("/api/ai/try-on", { method: "POST", body: form });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Try-on generation failed.");
      return;
    }

    setResultUrl(data.imageUrl);
    setMessage("Try-on image ready.");
  }

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
            <input
              accept="image/png,image/jpeg,image/webp"
              type="file"
              onChange={(event) => setPhoto(event.currentTarget.files?.[0] ?? null)}
            />
          </label>
          <label className="check-label">
            <input
              checked={consent}
              onChange={(event) => setConsent(event.currentTarget.checked)}
              type="checkbox"
            />
            I confirm private AI try-on generation consent.
          </label>
          <button className="button secondary" type="button" onClick={createTryOn}>
            Create AI try-on
          </button>
          {message ? <p role="status">{message}</p> : null}
          {resultUrl ? (
            <Image
              className="try-on-result"
              src={resultUrl}
              alt="Generated AI try-on result"
              width={320}
              height={400}
              unoptimized
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
