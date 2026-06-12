import { generateTryOnImage } from "@/lib/ai";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.userId || body.role !== "customer") {
    return json({ error: "Logged-in customer required" }, 401);
  }

  try {
    const result = await generateTryOnImage({
      userId: String(body.userId),
      productId: String(body.productId || ""),
      productImageUrl: String(body.productImageUrl || ""),
      upload: body.upload,
      consent: Boolean(body.consent)
    });

    return json(result);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Try-on generation failed" }, 400);
  }
}
