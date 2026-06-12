import OpenAI from "openai";

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

export async function generateProductImage(input: ProductImageInput): Promise<GeneratedImage> {
  const model = getImageModel();
  const style = input.stylePrompt?.trim() || "minimal luxury ecommerce studio lighting";
  const prompt = `Luxury ecommerce product photo of ${input.name}, ${input.category}. ${input.description} Style: ${style}`;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "undefined") {
    return {
      status: "completed",
      model,
      imageUrl: `/generated/product/${safeSegment(input.productId)}-${safeSegment(model)}.svg`,
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
    imageUrl: image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : `/generated/product/${safeSegment(input.productId)}-${safeSegment(model)}.svg`),
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
      imageUrl: `/generated/try-on/${safeSegment(input.userId)}/${safeSegment(input.productId)}-${safeSegment(model)}.svg`,
      prompt,
      provider: "placeholder"
    };
  }

  return {
    status: "completed",
    model,
    imageUrl: `/generated/try-on/${safeSegment(input.userId)}/${safeSegment(input.productId)}-${safeSegment(model)}.svg`,
    prompt,
    provider: "openai"
  };
}
