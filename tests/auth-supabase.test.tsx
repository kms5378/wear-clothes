import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginPage from "@/app/login/page";
import { getSupabaseConfigStatus } from "@/lib/supabase";

describe("Supabase auth surface", () => {
  it("reports whether public Supabase settings are configured without exposing secrets", () => {
    const status = getSupabaseConfigStatus({
      url: "https://example.supabase.co",
      anonKey: "anon-public",
      serviceRoleKey: "secret-service-role"
    });

    expect(status).toEqual({
      hasUrl: true,
      hasAnonKey: true,
      hasServiceRoleKey: true,
      isClientReady: true,
      isServerReady: true
    });
    expect(JSON.stringify(status)).not.toContain("secret-service-role");
  });

  it("renders login and logout controls for customer and admin workflows", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /account access/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByText(/admin accounts can manage products, home sections, and agent proposals/i)).toBeInTheDocument();
  });
});
