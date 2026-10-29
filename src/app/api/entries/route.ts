import { getBackend } from "@/lib/server/auth";
import { apiResponse, json } from "@/lib/server/errors";

export const runtime = "nodejs";

export async function GET() {
  return apiResponse(async () => {
    const { store } = await getBackend();
    return json({ entries: store.entries() });
  });
}
