import OpenAI, { toFile } from "openai";

export type ImageJobStatus = "completed" | "error";

export type GeneratedImage = {
  status: ImageJobStatus;
  model: string;
  imageUrl: string;
  prompt: string;
  provider: "placeholder" | "openai";
};

type ProductImageInput = {
  productId: string;
  name: string;
  description: string;
  category: string;
  stylePrompt?: string;
};

type TryOnImageInput = {
  userId: string;
  productId: string;
  productImageUrl: string;
  upload: {
    name: string;
    type: string;
    size: number;
    file?: File;
  };
  consent: boolean;
};

const SUPPORTED_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function getImageModel() {
  const model = process.env.OPENAI_IMAGE_MODEL;
  return model && model !== "undefined" ? model : "gpt-image-2";
}

function safeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function placeholderSvgDataUrl(title: string, subtitle: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
  <rect width="640" height="800" fill="#ddd3c2"/>
  <rect x="54" y="54" width="532" height="692" fill="#f7f2e8" stroke="#a38652" stroke-width="3"/>
  <text x="80" y="180" fill="#101010" font-family="Georgia,serif" font-size="54">${escapeSvg(title)}</text>
  <text x="80" y="245" fill="#6f6a5e" font-family="Arial,sans-serif" font-size="26">${escapeSvg(subtitle)}</text>
  <path d="M210 360c32-68 70-102 114-102s82 34 114 102v214H210V360z" fill="#1c1b19"/>
  <path d="M265 312h118l-24 54h-70l-24-54z" fill="#a38652"/>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export async function generateProductImage(input: ProductImageInput): Promise<GeneratedImage> {
  const model = getImageModel();
  const style = input.stylePrompt?.trim() || "minimal luxury ecommerce studio lighting";
  const prompt = `Luxury ecommerce product photo of ${input.name}, ${input.category}. ${input.description} Style: ${style}`;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "undefined") {
    return {
      status: "completed",
      model,
      imageUrl: placeholderSvgDataUrl(input.name, `${input.category} · ${model}`),
      prompt,
      provider: "placeholder"
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.images.generate({
    model,
    prompt,
    size: "1024x1024"
  } as never);
  const image = response.data?.[0];

  return {
    status: "completed",
    model,
    imageUrl: image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : placeholderSvgDataUrl(input.name, `${input.category} · ${model}`)),
    prompt,
    provider: "openai"
  };
}

export async function generateTryOnImage(input: TryOnImageInput): Promise<GeneratedImage> {
  if (!input.consent) {
    throw new Error("User consent is required");
  }

  if (!SUPPORTED_UPLOAD_TYPES.has(input.upload.type)) {
    throw new Error("Only jpeg, png, and webp images are supported");
  }

  if (input.upload.size > MAX_UPLOAD_BYTES) {
    throw new Error("Upload must be 8MB or smaller");
  }

  const model = getImageModel();
  const prompt = `Create a realistic virtual try-on image for product ${input.productId} using source product image ${input.productImageUrl}. Preserve the user identity and fit the garment naturally.`;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "undefined") {
    return {
      status: "completed",
      model,
      imageUrl: placeholderSvgDataUrl("AI try-on", `${input.productId} · ${model}`),
      prompt,
      provider: "placeholder"
    };
  }

  if (!input.upload.file) {
    throw new Error("Uploaded photo file is required for image editing");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const images = [await toFile(input.upload.file, input.upload.name, { type: input.upload.type })];
  const productReference = await loadProductReference(input.productImageUrl);

  if (productReference) {
    images.push(productReference);
  }

  const response = await client.images.edit({
    model,
    image: images,
    prompt,
    size: "1024x1536"
  } as never);
  const image = response.data?.[0];

  return {
    status: "completed",
    model,
    imageUrl: image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : placeholderSvgDataUrl("AI try-on", `${input.productId} · ${model}`)),
    prompt,
    provider: "openai"
  };
}

async function loadProductReference(productImageUrl: string) {
  if (!productImageUrl.startsWith("http")) {
    return null;
  }

  try {
    const response = await fetch(productImageUrl);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return toFile(blob, "product-reference.jpg", {
      type: blob.type || "image/jpeg"
    });
  } catch {
    return null;
  }
}
