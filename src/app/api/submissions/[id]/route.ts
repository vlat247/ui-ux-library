import { apiResponse, json, RequestError } from "@/lib/server/errors";
import { requireIdentity } from "@/lib/server/session";
import { assertSameOrigin, readJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiResponse(async () => {
    const { user, isOwner, backend } = await requireIdentity(request);
    if (!isOwner) throw new RequestError(403, "Only the owner can review submissions.");
    assertSameOrigin(request, backend.config.baseURL);
    const body = await readJson(request);
    if (body.status !== "approved" && body.status !== "rejected") {
      throw new RequestError(400, "Choose approved or rejected.");
    }
    const { id } = await context.params;
    return json({ submission: backend.store.moderateSubmission(id, body.status, user.id) });
  });
}
