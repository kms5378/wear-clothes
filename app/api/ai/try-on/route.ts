import { generateTryOnImage } from "@/lib/ai";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("multipart/form-data")
    ? await readFormBody(request)
    : await request.json();

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

async function readFormBody(request: Request) {
  const form = await request.formData();
  const photo = form.get("photo");

  return {
    userId: form.get("userId"),
    role: form.get("role"),
    productId: form.get("productId"),
    productImageUrl: form.get("productImageUrl"),
    consent: form.get("consent") === "true",
    upload:
      photo instanceof File
        ? { name: photo.name, type: photo.type, size: photo.size, file: photo }
        : undefined
  };
}
