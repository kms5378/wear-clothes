import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AdminAgentPage from "@/app/admin/agent/page";
import AdminHomePage from "@/app/admin/home/page";
import AdminProductsPage from "@/app/admin/products/page";

describe("admin management UI", () => {
  it("renders product management actions including AI image generation", () => {
    render(<AdminProductsPage />);

    expect(screen.getByRole("heading", { name: /product management/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create product/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /generate ai image/i })).toHaveLength(3);
  });

  it("renders homepage section management", () => {
    render(<AdminHomePage />);

    expect(screen.getByRole("heading", { name: /home sections/i })).toBeInTheDocument();
    expect(screen.getByText(/hero banner/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save section order/i })).toBeInTheDocument();
  });

  it("renders agent proposal approval workflow", () => {
    render(<AdminAgentPage />);

    expect(screen.getByRole("heading", { name: /agent proposals/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/admin instruction/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create proposal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /approve proposal/i })).toBeInTheDocument();
    expect(screen.getByText(/approval is required before publishing/i)).toBeInTheDocument();
  });
});
