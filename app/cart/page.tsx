import Link from "next/link";

export default function CartPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Cart</p>
      <h1>Shopping bag</h1>
      <div className="panel">
        <p>Your bag is ready for the mock checkout flow.</p>
        <p>Mock checkout total is calculated from the current cart snapshot before order creation.</p>
        <Link className="button" href="/checkout">
          Continue to checkout
        </Link>
      </div>
    </main>
  );
}
