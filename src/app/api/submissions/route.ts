import { apiResponse, json } from "@/lib/server/errors";
import { requireIdentity } from "@/lib/server/session";
import { assertSameOrigin, readJson, submissionInput } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return apiResponse(async () => {
    const { user, isOwner, backend } = await requireIdentity(request);
    return json({ submissions: backend.store.submissions(user.id, isOwner) });
  });
}

export async function POST(request: Request) {
  return apiResponse(async () => {
    const { user, backend } = await requireIdentity(request);
    assertSameOrigin(request, backend.config.baseURL);
    const input = submissionInput(await readJson(request));
    return json({ submission: backend.store.createSubmission(user.id, input) }, 201);
  });
}
