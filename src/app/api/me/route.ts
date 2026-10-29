import { apiResponse, json } from "@/lib/server/errors";
import { getIdentity } from "@/lib/server/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return apiResponse(async () => {
    const { user, isOwner, backend } = await getIdentity(request);
    return json({
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      isOwner,
      googleEnabled: Boolean(backend.config.google),
    });
  });
}
