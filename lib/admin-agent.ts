import type { HomeSection, Product, ProductStatus } from "@/lib/types";

export type ProductChange = {
  id: string;
  status?: ProductStatus;
  name?: string;
  description?: string;
  imageUrl?: string;
};

export type HomeSectionChange = {
  id: string;
  title?: string;
  subtitle?: string;
  active?: boolean;
  productIds?: string[];
};

export type AgentProposalStatus = "pending" | "approved" | "rejected";

export type AgentProposal = {
  id: string;
  adminId: string;
  prompt: string;
  summary: string;
  status: AgentProposalStatus;
  changes: {
    products: ProductChange[];
    homeSections: HomeSectionChange[];
  };
  createdAt: string;
  appliedAt?: string;
};

type CreateProposalInput = {
  adminId: string;
  prompt: string;
  products: Product[];
  homeSections: HomeSection[];
};

type ApproveProposalInput = {
  proposal: AgentProposal;
  products: Product[];
  homeSections: HomeSection[];
};

function proposalId(adminId: string, prompt: string) {
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `proposal_${adminId}_${slug || "change"}`;
}

export function createAgentProposal(input: CreateProposalInput): AgentProposal {
  const primaryProduct = input.products[0];
  const hero = input.homeSections.find((section) => section.type === "hero") ?? input.homeSections[0];

  return {
    id: proposalId(input.adminId, input.prompt),
    adminId: input.adminId,
    prompt: input.prompt,
    summary: `Proposed admin-managed homepage update: ${input.prompt}`,
    status: "pending",
    changes: {
      products: primaryProduct ? [{ id: primaryProduct.id, status: "published" }] : [],
      homeSections: hero
        ? [
            {
              id: hero.id,
              title: "Wear Clothes",
              subtitle: input.prompt,
              productIds: primaryProduct ? [primaryProduct.id] : hero.productIds
            }
          ]
        : []
    },
    createdAt: "2026-06-12T00:00:00.000Z"
  };
}

export function approveAgentProposal(input: ApproveProposalInput) {
  if (input.proposal.status !== "pending") {
    throw new Error("Only pending proposals can be approved");
  }

  const products = input.products.map((product) => {
    const change = input.proposal.changes.products.find((candidate) => candidate.id === product.id);
    return change ? { ...product, ...change } : { ...product };
  });

  const homeSections = input.homeSections.map((section) => {
    const change = input.proposal.changes.homeSections.find((candidate) => candidate.id === section.id);
    return change ? { ...section, ...change } : { ...section };
  });

  return {
    proposal: {
      ...input.proposal,
      status: "approved" as const,
      appliedAt: "2026-06-12T00:00:00.000Z"
    },
    products,
    homeSections
  };
}

export function rejectAgentProposal(proposal: AgentProposal): AgentProposal {
  return {
    ...proposal,
    status: "rejected"
  };
}
