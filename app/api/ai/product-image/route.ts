import { generateProductImage } from "@/lib/ai";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.role !== "admin") {
    return json({ error: "Admin role required" }, 403);
  }

  const productId = String(body.productId || body.product?.id || "");
  const name = String(body.name || body.product?.name || "");
  const description = String(body.description || body.product?.description || "");
  const category = String(body.category || body.product?.category || "");

  if (!productId || !name || !description || !category) {
    return json({ error: "productId, name, description, and category are required" }, 400);
  }

  const result = await generateProductImage({
    productId,
    name,
    description,
    category,
    stylePrompt: body.stylePrompt
  });

  return json(result);
}
