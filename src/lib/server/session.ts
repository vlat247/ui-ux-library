import { getBackend, isOwner } from "./auth";
import { RequestError } from "./errors";

export async function getIdentity(request: Request) {
  const backend = await getBackend();
  const session = await backend.auth.api.getSession({ headers: request.headers });
  return {
    backend,
    user: session?.user || null,
    isOwner: isOwner(session?.user, backend.config),
  };
}

export async function requireIdentity(request: Request) {
  const identity = await getIdentity(request);
  if (!identity.user) throw new RequestError(401, "Sign in to continue.");
  return { ...identity, user: identity.user };
}
