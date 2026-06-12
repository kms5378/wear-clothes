export default function CheckoutPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Mock checkout</p>
      <h1>Checkout</h1>
      <div className="panel">
        <p>Payment is mocked for v1. No real payment provider is called.</p>
        <p>The completed flow stores a mock_orders snapshot for later payment integration.</p>
        <button className="button" type="button">
          Complete mock payment
        </button>
      </div>
    </main>
  );
}
