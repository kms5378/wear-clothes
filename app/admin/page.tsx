import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Admin</p>
      <h1>Homepage management</h1>
      <div className="product-grid">
        <Link className="panel" href="/admin/products">
          Products
        </Link>
        <Link className="panel" href="/admin/home">
          Home sections
        </Link>
        <Link className="panel" href="/admin/agent">
          Agent proposals
        </Link>
      </div>
    </main>
  );
}
