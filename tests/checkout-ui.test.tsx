import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CartPage from "@/app/cart/page";
import CheckoutPage from "@/app/checkout/page";

describe("mock checkout UI", () => {
  it("explains bag totals and links to checkout", () => {
    render(<CartPage />);

    expect(screen.getByRole("heading", { name: /shopping bag/i })).toBeInTheDocument();
    expect(screen.getByText(/mock checkout total/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue to checkout/i })).toHaveAttribute(
      "href",
      "/checkout"
    );
  });

  it("makes clear that checkout is mocked and stores an order snapshot", () => {
    render(<CheckoutPage />);

    expect(screen.getByText(/No real payment provider is called/i)).toBeInTheDocument();
    expect(screen.getByText(/mock_orders/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /complete mock payment/i })).toBeInTheDocument();
  });
});
