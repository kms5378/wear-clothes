import type { Product } from "@/lib/types";

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  unitPrice: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
};

export type ShippingAddress = {
  recipient: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
};

export type MockOrder = {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totals: CartTotals;
  status: "mock_paid";
};

type AddCartItemInput = {
  product: Product;
  size: string;
  color: string;
  quantity?: number;
};

type CreateMockOrderInput = {
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
};

export function addCartItem(items: CartItem[], input: AddCartItemInput) {
  const quantity = Math.max(1, input.quantity ?? 1);
  const id = getCartItemId(input.product.id, input.size, input.color);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    return items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + quantity } : item
    );
  }

  return [
    ...items,
    {
      id,
      productId: input.product.id,
      productName: input.product.name,
      productSlug: input.product.slug,
      unitPrice: input.product.price,
      imageUrl: input.product.imageUrl,
      size: input.size,
      color: input.color,
      quantity
    }
  ];
}

export function updateCartItemQuantity(items: CartItem[], itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeCartItem(items, itemId);
  }

  return items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
}

export function removeCartItem(items: CartItem[], itemId: string) {
  return items.filter((item) => item.id !== itemId);
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = 0;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount
  };
}

export function createMockOrder(input: CreateMockOrderInput): MockOrder {
  const totals = calculateCartTotals(input.items);

  return {
    id: `mock_order_${input.userId}_${totals.total}_${totals.itemCount}`,
    userId: input.userId,
    items: input.items.map((item) => ({ ...item })),
    shippingAddress: { ...input.shippingAddress },
    totals,
    status: "mock_paid"
  };
}

function getCartItemId(productId: string, size: string, color: string) {
  return [productId, size, color].map((part) => part.toLowerCase().replaceAll(" ", "-")).join(":");
}
