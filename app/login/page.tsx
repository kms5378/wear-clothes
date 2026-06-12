import Link from "next/link";

import { getSupabaseConfigStatus } from "@/lib/supabase";

export default function LoginPage() {
  const status = getSupabaseConfigStatus();

  return (
    <main className="page-shell">
      <p className="eyebrow">Customer and admin auth</p>
      <h1>Account access</h1>
      <section className="agent-layout">
        <form className="panel agent-form">
          <label>
            Email
            <input aria-label="Email" name="email" placeholder="you@example.com" type="email" />
          </label>
          <button className="button" type="button">
            Send magic link
          </button>
          <button className="button secondary" type="button">
            Logout
          </button>
        </form>
        <aside className="panel proposal-preview">
          <p className="eyebrow">Role boundary</p>
          <h2>Admin accounts can manage products, home sections, and agent proposals.</h2>
          <p>Customers can shop, use the mock checkout, and create private AI try-on images.</p>
          <p>
            Supabase client config: {status.isClientReady ? "ready" : "waiting for env"}
          </p>
          <Link href="/admin">Go to admin</Link>
        </aside>
      </section>
    </main>
  );
}
