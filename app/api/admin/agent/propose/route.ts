import { createAgentProposal } from "@/lib/admin-agent";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.role !== "admin") {
    return json({ error: "Admin role required" }, 403);
  }

  if (!body.adminId || !body.prompt) {
    return json({ error: "adminId and prompt are required" }, 400);
  }

  const proposal = createAgentProposal({
    adminId: String(body.adminId),
    prompt: String(body.prompt),
    products: Array.isArray(body.products) ? body.products : [],
    homeSections: Array.isArray(body.homeSections) ? body.homeSections : []
  });

  return json(proposal);
}
