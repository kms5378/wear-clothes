import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { sampleProducts } from "@/lib/fixtures";

describe("site scaffold", () => {
  it("renders luxury commerce navigation", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: /wear clothes/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /shop/i })).toHaveAttribute("href", "/products");
    expect(screen.getByRole("link", { name: /cart/i })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: /admin/i })).toHaveAttribute("href", "/admin");
  });

  it("renders fixed-ratio product cards with commerce actions", () => {
    render(<ProductCard product={sampleProducts[0]} />);

    expect(screen.getByRole("heading", { name: sampleProducts[0].name })).toBeInTheDocument();
    expect(screen.getByText("$420")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view atelier wool coat/i })).toHaveAttribute(
      "href",
      "/products/atelier-wool-coat"
    );
  });
});
