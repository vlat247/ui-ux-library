import { toNextJsHandler } from "better-auth/next-js";
import { getBackend } from "@/lib/server/auth";
import { apiResponse } from "@/lib/server/errors";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return apiResponse(async () => {
    const { auth } = await getBackend();
    return toNextJsHandler(auth).GET(request);
  });
}

export async function POST(request: Request) {
  return apiResponse(async () => {
    const { auth } = await getBackend();
    // Better Auth checks origins, callback URLs, and OAuth state for its own routes.
    return toNextJsHandler(auth).POST(request);
  });
}
