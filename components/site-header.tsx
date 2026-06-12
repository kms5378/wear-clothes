import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="Wear Clothes">
        Wear Clothes
      </Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/products">Shop</Link>
        <Link href="/cart">
          <ShoppingBag aria-hidden="true" size={17} />
          Cart
        </Link>
        <Link href="/login">Login</Link>
        <Link href="/admin">
          <UserRound aria-hidden="true" size={17} />
          Admin
        </Link>
      </nav>
    </header>
  );
}
