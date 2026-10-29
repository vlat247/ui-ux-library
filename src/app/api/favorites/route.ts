import { apiResponse, json, RequestError } from "@/lib/server/errors";
import { requireIdentity } from "@/lib/server/session";
import { assertSameOrigin, readJson, textField } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return apiResponse(async () => {
    const { user, backend } = await requireIdentity(request);
    return json({ ids: backend.store.favoriteIds(user.id) });
  });
}

export async function POST(request: Request) {
  return apiResponse(async () => {
    const { user, backend } = await requireIdentity(request);
    assertSameOrigin(request, backend.config.baseURL);
    const body = await readJson(request);
    const entryId = textField(body.entryId, "Entry", 1, 160);
    if (typeof body.saved !== "boolean") throw new RequestError(400, "Choose whether to save this entry.");
    backend.store.setFavorite(user.id, entryId, body.saved);
    return json({ ids: backend.store.favoriteIds(user.id) });
  });
}
