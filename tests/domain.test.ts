import { describe, expect, it } from "vitest";

import {
  addCartItem,
  calculateCartTotals,
  createMockOrder,
  removeCartItem,
  updateCartItemQuantity
} from "@/lib/cart";
import { canAccessAdmin, canAccessCustomer, requireAdmin } from "@/lib/auth";
import { fixtureStore } from "@/lib/store";

describe("domain layer", () => {
  it("exposes published products and active home sections from fixtures", () => {
    const products = fixtureStore.listProducts();
    const sections = fixtureStore.listHomeSections();

    expect(products).toHaveLength(3);
    expect(products.every((product) => product.status === "published")).toBe(true);
    expect(sections.map((section) => section.id)).toEqual(["hero_main", "collection_winter"]);
  });

  it("separates customer and admin role access", () => {
    expect(canAccessCustomer({ id: "user_1", role: "customer" })).toBe(true);
    expect(canAccessAdmin({ id: "user_1", role: "customer" })).toBe(false);
    expect(canAccessAdmin({ id: "admin_1", role: "admin" })).toBe(true);
    expect(() => requireAdmin({ id: "user_1", role: "customer" })).toThrow("Admin role required");
  });

  it("adds, updates, and removes cart items deterministically", () => {
    const product = fixtureStore.getProductById("prod_coat");
    if (!product) throw new Error("missing fixture product");

    const firstCart = addCartItem([], {
      product,
      size: "M",
      color: "Charcoal",
      quantity: 1
    });
    const mergedCart = addCartItem(firstCart, {
      product,
      size: "M",
      color: "Charcoal",
      quantity: 2
    });
    const resizedCart = updateCartItemQuantity(mergedCart, mergedCart[0].id, 5);
    const emptyCart = removeCartItem(resizedCart, resizedCart[0].id);

    expect(mergedCart).toMatchObject([{ productId: "prod_coat", quantity: 3 }]);
    expect(resizedCart).toMatchObject([{ productId: "prod_coat", quantity: 5 }]);
    expect(emptyCart).toEqual([]);
  });

  it("calculates cart totals and creates a mock paid order snapshot", () => {
    const coat = fixtureStore.getProductById("prod_coat");
    const knit = fixtureStore.getProductById("prod_knit");
    if (!coat || !knit) throw new Error("missing fixture products");

    const cart = addCartItem(
      addCartItem([], { product: coat, size: "M", color: "Charcoal", quantity: 1 }),
      { product: knit, size: "S", color: "Ivory", quantity: 2 }
    );

    expect(calculateCartTotals(cart)).toEqual({
      subtotal: 900,
      shipping: 0,
      total: 900,
      itemCount: 3
    });

    const order = createMockOrder({
      userId: "user_1",
      items: cart,
      shippingAddress: {
        recipient: "Kim",
        line1: "123 Atelier St",
        city: "Seoul",
        postalCode: "04524",
        country: "KR"
      }
    });

    expect(order).toMatchObject({
      id: "mock_order_user_1_900_3",
      userId: "user_1",
      status: "mock_paid",
      totals: { subtotal: 900, shipping: 0, total: 900, itemCount: 3 }
    });
    expect(order.items[0]).toMatchObject({ productName: "Atelier Wool Coat", unitPrice: 420 });
  });
});
