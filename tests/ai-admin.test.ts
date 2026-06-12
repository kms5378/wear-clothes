import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";

import {
  generateProductImage,
  generateTryOnImage,
  getImageModel
} from "@/lib/ai";
import {
  approveAgentProposal,
  createAgentProposal,
  rejectAgentProposal
} from "@/lib/admin-agent";
import type { HomeSection, Product } from "@/lib/types";
import { POST as approveProposalPost } from "@/app/api/admin/agent/approve/route";
import { POST as proposeAgentPost } from "@/app/api/admin/agent/propose/route";
import { POST as productImagePost } from "@/app/api/ai/product-image/route";
import { POST as tryOnPost } from "@/app/api/ai/try-on/route";
import AdminAgentPage from "@/app/admin/agent/page";
import AdminHomePage from "@/app/admin/home/page";
import AdminProductsPage from "@/app/admin/products/page";

const product: Product = {
  id: "prod_test",
  name: "Test Coat",
  slug: "test-coat",
  description: "A refined wool coat.",
  price: 390,
  category: "Outerwear",
  colors: ["Black"],
  sizes: ["M"],
  status: "draft",
  imageUrl: "/images/old.jpg",
  accentImageUrl: "/images/old-accent.jpg"
};

const section: HomeSection = {
  id: "hero_main",
  type: "hero",
  title: "Old title",
  subtitle: "Old subtitle",
  imageUrl: "/images/hero.jpg",
  productIds: ["prod_test"],
  sortOrder: 1,
  active: true
};

describe("AI image helpers", () => {
  it("defaults to gpt-image-2 and returns deterministic placeholder product images without an API key", async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    const previousModel = process.env.OPENAI_IMAGE_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_IMAGE_MODEL;

    const result = await generateProductImage({
      productId: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      stylePrompt: "editorial studio lighting"
    });

    expect(getImageModel()).toBe("gpt-image-2");
    expect(result).toEqual({
      status: "completed",
      model: "gpt-image-2",
      imageUrl: "/generated/product/prod_test-gpt-image-2.svg",
      prompt:
        "Luxury ecommerce product photo of Test Coat, Outerwear. A refined wool coat. Style: editorial studio lighting",
      provider: "placeholder"
    });

    process.env.OPENAI_API_KEY = previousKey;
    process.env.OPENAI_IMAGE_MODEL = previousModel;
  });

  it("requires consent and validates user uploads before generating try-on placeholders", async () => {
    await expect(
      generateTryOnImage({
        userId: "user_1",
        productId: product.id,
        productImageUrl: product.imageUrl,
        upload: { name: "portrait.txt", type: "text/plain", size: 4000 },
        consent: true
      })
    ).rejects.toThrow("Only jpeg, png, and webp images are supported");

    await expect(
      generateTryOnImage({
        userId: "user_1",
        productId: product.id,
        productImageUrl: product.imageUrl,
        upload: { name: "portrait.jpg", type: "image/jpeg", size: 4000 },
        consent: false
      })
    ).rejects.toThrow("User consent is required");

    const result = await generateTryOnImage({
      userId: "user_1",
      productId: product.id,
      productImageUrl: product.imageUrl,
      upload: { name: "portrait.jpg", type: "image/jpeg", size: 4000 },
      consent: true
    });

    expect(result).toMatchObject({
      status: "completed",
      model: "gpt-image-2",
      imageUrl: "/generated/try-on/user_1/prod_test-gpt-image-2.svg",
      provider: "placeholder"
    });
  });
});

describe("admin agent proposal flow", () => {
  it("stores proposed JSON without applying changes until admin approval", () => {
    const proposal = createAgentProposal({
      adminId: "admin_1",
      prompt: "Publish the test coat and make the hero mention it",
      products: [product],
      homeSections: [section]
    });

    expect(proposal.status).toBe("pending");
    expect(proposal.changes.products).toEqual([
      { id: "prod_test", status: "published" }
    ]);
    expect(product.status).toBe("draft");
    expect(section.title).toBe("Old title");

    const applied = approveAgentProposal({
      proposal,
      products: [product],
      homeSections: [section]
    });

    expect(applied.proposal.status).toBe("approved");
    expect(applied.products[0]).toMatchObject({ id: "prod_test", status: "published" });
    expect(applied.homeSections[0]).toMatchObject({
      id: "hero_main",
      title: "Wear Clothes",
      subtitle: "Publish the test coat and make the hero mention it"
    });
    expect(product.status).toBe("draft");
    expect(section.title).toBe("Old title");
  });

  it("rejects proposals without applying them", () => {
    const proposal = createAgentProposal({
      adminId: "admin_1",
      prompt: "Archive the homepage hero",
      products: [product],
      homeSections: [section]
    });

    const rejected = rejectAgentProposal(proposal);

    expect(rejected.status).toBe("rejected");
    expect(() =>
      approveAgentProposal({
        proposal: rejected,
        products: [product],
        homeSections: [section]
      })
    ).toThrow("Only pending proposals can be approved");
  });
});

describe("admin and AI API routes", () => {
  it("protects product image generation behind the admin role", async () => {
    const denied = await productImagePost(
      new Request("http://localhost/api/ai/product-image", {
        method: "POST",
        body: JSON.stringify({ role: "customer", product })
      })
    );

    expect(denied.status).toBe(403);

    const allowed = await productImagePost(
      new Request("http://localhost/api/ai/product-image", {
        method: "POST",
        body: JSON.stringify({
          role: "admin",
          productId: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          stylePrompt: "clean studio"
        })
      })
    );

    expect(allowed.status).toBe(200);
    await expect(allowed.json()).resolves.toMatchObject({
      imageUrl: "/generated/product/prod_test-gpt-image-2.svg",
      provider: "placeholder"
    });
  });

  it("requires logged-in customer consent for try-on generation", async () => {
    const denied = await tryOnPost(
      new Request("http://localhost/api/ai/try-on", {
        method: "POST",
        body: JSON.stringify({
          userId: "user_1",
          role: "customer",
          productId: product.id,
          productImageUrl: product.imageUrl,
          upload: { name: "portrait.jpg", type: "image/jpeg", size: 4000 },
          consent: false
        })
      })
    );

    expect(denied.status).toBe(400);

    const allowed = await tryOnPost(
      new Request("http://localhost/api/ai/try-on", {
        method: "POST",
        body: JSON.stringify({
          userId: "user_1",
          role: "customer",
          productId: product.id,
          productImageUrl: product.imageUrl,
          upload: { name: "portrait.jpg", type: "image/jpeg", size: 4000 },
          consent: true
        })
      })
    );

    expect(allowed.status).toBe(200);
    await expect(allowed.json()).resolves.toMatchObject({
      imageUrl: "/generated/try-on/user_1/prod_test-gpt-image-2.svg"
    });
  });

  it("creates pending agent proposals and applies them only through approval", async () => {
    const proposed = await proposeAgentPost(
      new Request("http://localhost/api/admin/agent/propose", {
        method: "POST",
        body: JSON.stringify({
          role: "admin",
          adminId: "admin_1",
          prompt: "Publish the test coat and make the hero mention it",
          products: [product],
          homeSections: [section]
        })
      })
    );
    const proposal = await proposed.json();

    expect(proposed.status).toBe(200);
    expect(proposal.status).toBe("pending");
    expect(product.status).toBe("draft");

    const approved = await approveProposalPost(
      new Request("http://localhost/api/admin/agent/approve", {
        method: "POST",
        body: JSON.stringify({
          role: "admin",
          proposal,
          products: [product],
          homeSections: [section]
        })
      })
    );

    expect(approved.status).toBe(200);
    await expect(approved.json()).resolves.toMatchObject({
      proposal: { status: "approved" },
      products: [{ id: "prod_test", status: "published" }]
    });
  });
});

describe("admin management pages", () => {
  it("shows product, home, and agent management screens", () => {
    render(createElement(AdminProductsPage));
    expect(screen.getByRole("heading", { name: /product management/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /generate ai image/i }).length).toBeGreaterThan(0);

    render(createElement(AdminHomePage));
    expect(screen.getByRole("heading", { name: /home sections/i })).toBeInTheDocument();
    expect(screen.getByText(/Hero banner/i)).toBeInTheDocument();

    render(createElement(AdminAgentPage));
    expect(screen.getByRole("heading", { name: /agent proposals/i })).toBeInTheDocument();
    expect(screen.getByText(/approval required/i)).toBeInTheDocument();
  });
});
