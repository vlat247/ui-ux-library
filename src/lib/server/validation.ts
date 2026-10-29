import type { DiscoverySection } from "@/features/discovery/types";
import { RequestError } from "./errors";

const MAX_BODY_BYTES = 16_384;

export function assertSameOrigin(request: Request, baseURL: string): void {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(baseURL).origin) {
    throw new RequestError(403, "This request must come from this website.");
  }
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new RequestError(415, "Send a JSON request body.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "A request body is required.");

  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError(413, "The request body is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  let value: unknown;
  try {
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new RequestError(400, "The request body must contain valid JSON.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestError(400, "The request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

export function textField(
  value: unknown,
  label: string,
  min: number,
  max: number,
): string {
  if (typeof value !== "string") throw new RequestError(400, `${label} is required.`);
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max || trimmed.includes("\0")) {
    throw new RequestError(400, `${label} must contain ${min}–${max} characters.`);
  }
  return trimmed;
}

export function sourceUrl(value: unknown): string {
  const raw = textField(value, "URL", 1, 2048);
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      throw new Error("Invalid source URL");
    }
    return url.href;
  } catch {
    throw new RequestError(400, "Enter a valid HTTP or HTTPS URL without embedded credentials.");
  }
}

export interface SubmissionInput {
  title: string;
  url: string;
  description: string;
  section: DiscoverySection;
  category: string;
}

export function submissionInput(body: Record<string, unknown>): SubmissionInput {
  if (body.section !== "sites" && body.section !== "inspiration") {
    throw new RequestError(400, "Choose Useful Sites or Inspiration.");
  }
  return {
    title: textField(body.title, "Title", 3, 120),
    url: sourceUrl(body.url),
    description: textField(body.description, "Description", 10, 1200),
    section: body.section,
    category: textField(body.category, "Category", 2, 60),
  };
}
