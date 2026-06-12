import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductDetail } from "@/components/product-detail";
import { sampleProducts } from "@/lib/fixtures";

describe("shopping UI", () => {
  it("shows product options, cart action, and AI try-on entry point", () => {
    render(<ProductDetail product={sampleProducts[0]} />);

    expect(screen.getByRole("heading", { name: /atelier wool coat/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to bag/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create ai try-on/i })).toBeInTheDocument();
    expect(screen.getByText(/photo consent/i)).toBeInTheDocument();
  });
});
