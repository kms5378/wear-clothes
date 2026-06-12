import { approveAgentProposal } from "@/lib/admin-agent";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.role !== "admin") {
    return json({ error: "Admin role required" }, 403);
  }

  try {
    const result = approveAgentProposal({
      proposal: body.proposal,
      products: Array.isArray(body.products) ? body.products : [],
      homeSections: Array.isArray(body.homeSections) ? body.homeSections : []
    });

    return json(result);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Proposal approval failed" },
      400
    );
  }
}
