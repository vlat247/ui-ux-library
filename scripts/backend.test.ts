import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { DiscoveryEntry, Submission } from "../src/features/discovery/types";
import * as authRoute from "../src/app/api/auth/[...all]/route";
import * as meRoute from "../src/app/api/me/route";
import * as entriesRoute from "../src/app/api/entries/route";
import * as favoritesRoute from "../src/app/api/favorites/route";
import * as submissionsRoute from "../src/app/api/submissions/route";
import * as reviewRoute from "../src/app/api/submissions/[id]/route";
import { createBackend, getBackend, provisionOwner } from "../src/lib/server/auth";
import { getServerConfig } from "../src/lib/server/config";

const origin = "http://localhost:3000";
const password = "test-only-password-please-ignore";

function request(path: string, options: {
  method?: string;
  body?: unknown;
  cookie?: string;
  origin?: string | null;
  raw?: string;
} = {}): Request {
  const headers = new Headers();
  if (options.cookie) headers.set("cookie", options.cookie);
  if (options.origin !== null) headers.set("origin", options.origin || origin);
  if (options.body !== undefined || options.raw !== undefined) headers.set("content-type", "application/json");
  return new Request(`${origin}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.raw !== undefined ? options.raw
      : options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

function cookies(response: Response): string {
  return response.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; ");
}

async function authenticate(email: string, name: string): Promise<string> {
  const response = await authRoute.POST(request("/api/auth/sign-up/email", {
    method: "POST", body: { email, name, password },
  }));
  assert.equal(response.status, 200, await response.clone().text());
  assert.ok(cookies(response), "Sign-up must establish a real session cookie.");
  return cookies(response);
}

async function entries(): Promise<DiscoveryEntry[]> {
  const response = await entriesRoute.GET();
  assert.equal(response.status, 200);
  return (await response.json()).entries;
}

async function favoriteIds(cookie: string): Promise<string[]> {
  const response = await favoritesRoute.GET(request("/api/favorites", { cookie }));
  assert.equal(response.status, 200);
  return (await response.json()).ids;
}

async function submissions(cookie: string): Promise<Submission[]> {
  const response = await submissionsRoute.GET(request("/api/submissions", { cookie }));
  assert.equal(response.status, 200);
  return (await response.json()).submissions;
}

test("backend authorization, private state, moderation, and durability", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "ui-ux-library-backend-"));
  process.env.DATABASE_PATH = join(directory, "library.sqlite");
  process.env.BETTER_AUTH_SECRET = "backend-integration-test-secret-at-least-thirty-two";
  process.env.BETTER_AUTH_URL = origin;
  process.env.OWNER_EMAIL = " OWNER@library.test ";
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;

  let memberA = "";
  let memberB = "";
  let owner = "";
  let pendingId = "";
  let seedId = "";
  const backend = await getBackend();
  t.after(() => {
    backend.db.close();
    rmSync(directory, { recursive: true, force: true });
  });

  await t.test("guests can browse but cannot save, submit, inspect private state, or moderate", async () => {
    const me = await meRoute.GET(request("/api/me"));
    assert.deepEqual(await me.json(), { user: null, isOwner: false, googleEnabled: false });
    const initialEntries = await entries();
    assert.ok(initialEntries.length > 0, "The public owner-curated seed collection should be available.");
    seedId = initialEntries[0].id;
    assert.equal((await favoritesRoute.GET(request("/api/favorites"))).status, 401);
    assert.equal((await favoritesRoute.GET(request("/api/favorites", {
      cookie: "better-auth.session_token=forged-session-token",
    }))).status, 401);
    assert.equal((await submissionsRoute.GET(request("/api/submissions"))).status, 401);
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", body: { entryId: seedId, saved: true },
    }))).status, 401);
    assert.equal((await submissionsRoute.POST(request("/api/submissions", {
      method: "POST", body: {},
    }))).status, 401);
    assert.equal((await reviewRoute.PATCH(request("/api/submissions/unknown", {
      method: "PATCH", body: { status: "approved" },
    }), { params: Promise.resolve({ id: "unknown" }) })).status, 401);
  });

  await t.test("real accounts get distinct sessions and owner identity cannot be claimed publicly", async () => {
    memberA = await authenticate("member-a@library.test", "Member A");
    memberB = await authenticate("member-b@library.test", "Member B");
    const reserved = await authRoute.POST(request("/api/auth/sign-up/email", {
      method: "POST", body: { name: "Impersonator", email: "OWNER@library.test", password, emailVerified: true },
    }));
    assert.equal(reserved.status, 403);
    await provisionOwner("Library owner", password);
    const login = await authRoute.POST(request("/api/auth/sign-in/email", {
      method: "POST", body: { email: "owner@library.test", password },
    }));
    assert.equal(login.status, 200, await login.clone().text());
    owner = cookies(login);
    const ownerMe = await meRoute.GET(request("/api/me", { cookie: owner }));
    assert.equal((await ownerMe.json()).isOwner, true);
    const memberMe = await meRoute.GET(request("/api/me", { cookie: memberA }));
    const identity = await memberMe.json();
    assert.equal(identity.isOwner, false);
    assert.equal(identity.user.email, "member-a@library.test");
  });

  await t.test("auth profile endpoints cannot claim verified identity or store invalid display names", async () => {
    const update = (body: unknown) => authRoute.POST(request("/api/auth/update-user", {
      method: "POST", cookie: memberA, body,
    }));
    assert.equal((await update({ email: "owner@library.test", emailVerified: true })).status, 400);
    assert.equal((await update({ name: null })).status, 400);
    assert.equal((await update({ name: "x".repeat(81) })).status, 400);
    const me = await meRoute.GET(request("/api/me", { cookie: memberA }));
    const identity = await me.json();
    assert.equal(identity.isOwner, false);
    assert.equal(identity.user.name, "Member A");
  });

  await t.test("favourites are unique, private, durable, and limited to published entries", async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const saved = await favoritesRoute.POST(request("/api/favorites", {
        method: "POST", cookie: memberA, body: { entryId: seedId, saved: true, userId: "forged-user" },
      }));
      assert.equal(saved.status, 200);
    }
    assert.deepEqual(await favoriteIds(memberA), [seedId]);
    assert.deepEqual(await favoriteIds(memberB), []);
    assert.deepEqual(await favoriteIds(owner), []);
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, body: { entryId: "not-published", saved: true },
    }))).status, 404);
  });

  await t.test("submission authors see only their own records and pending content stays private", async () => {
    const input = {
      title: "A community design resource",
      url: "https://example.com/community",
      description: "An independently submitted resource waiting for the owner's review.",
      section: "sites", category: "Design tools", status: "approved", userId: "forged-user",
    };
    const created = await submissionsRoute.POST(request("/api/submissions", {
      method: "POST", cookie: memberA, body: input,
    }));
    assert.equal(created.status, 201);
    const { submission } = await created.json();
    pendingId = submission.id;
    assert.equal(submission.status, "pending");
    assert.notEqual(submission.userId, "forged-user");
    assert.equal((await submissions(memberA)).length, 1);
    assert.deepEqual(await submissions(memberB), []);
    assert.equal((await submissions(owner)).length, 1);
    assert.ok(!(await entries()).some((entry) => entry.id === `submission:${pendingId}`));
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, body: { entryId: `submission:${pendingId}`, saved: true },
    }))).status, 404);
  });

  await t.test("only the owner can publish; unknown records return 404", async () => {
    const review = (cookie: string, id = pendingId) => reviewRoute.PATCH(request(`/api/submissions/${id}`, {
      method: "PATCH", cookie, body: { status: "approved" },
    }), { params: Promise.resolve({ id }) });
    assert.equal((await review(memberA)).status, 403);
    assert.equal((await review(memberB)).status, 403);
    assert.equal((await review(owner, "unknown")).status, 404);
    assert.equal((await review(owner)).status, 200);
    const published = (await entries()).find((entry) => entry.id === `submission:${pendingId}`);
    assert.ok(published);
    assert.equal(published.sourceUrl, "https://example.com/community");
    assert.equal(published.creator, undefined, "Submitters must not be misattributed as original creators.");
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, body: { entryId: published.id, saved: true },
    }))).status, 200);
    assert.equal((await favoriteIds(memberA)).length, 2);
  });

  await t.test("rejection unpublishes immediately, including saved results", async () => {
    assert.equal((await reviewRoute.PATCH(request(`/api/submissions/${pendingId}`, {
      method: "PATCH", cookie: owner, body: { status: "rejected" },
    }), { params: Promise.resolve({ id: pendingId }) })).status, 200);
    assert.ok(!(await entries()).some((entry) => entry.id === `submission:${pendingId}`));
    assert.deepEqual(await favoriteIds(memberA), [seedId]);
    assert.equal((await submissions(memberA))[0].status, "rejected");
  });

  await t.test("mutations reject cross-origin requests, malformed input, unsafe URLs, and oversized bodies", async () => {
    const favorite = { entryId: seedId, saved: true };
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, origin: "https://another-site.test", body: favorite,
    }))).status, 403);
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, origin: null, body: favorite,
    }))).status, 403);
    assert.equal((await favoritesRoute.POST(request("/api/favorites", {
      method: "POST", cookie: memberA, raw: "{broken",
    }))).status, 400);
    assert.equal((await submissionsRoute.POST(request("/api/submissions", {
      method: "POST", cookie: memberA,
      body: { title: "Invalid resource", description: "A deliberately invalid source URL.",
        url: "javascript:alert(1)", category: "Design", section: "sites" },
    }))).status, 400);
    assert.equal((await submissionsRoute.POST(request("/api/submissions", {
      method: "POST", cookie: memberA, raw: JSON.stringify({ title: "x".repeat(20_000) }),
    }))).status, 413);
    assert.equal((await authRoute.POST(request("/api/auth/sign-out", {
      method: "POST", cookie: memberA, origin: "https://another-site.test", body: {},
    }))).status, 403);
  });

  await t.test("initialization is repeatable and records survive a second database connection", async () => {
    const second = await createBackend(getServerConfig());
    try {
      const row = second.db.prepare('SELECT id FROM "user" WHERE email = ?')
        .get("member-a@library.test") as { id: string };
      assert.deepEqual(second.store.favoriteIds(row.id), [seedId]);
      assert.equal(second.store.submissions(row.id, false)[0].status, "rejected");
    } finally {
      second.db.close();
    }
  });

  await t.test("sign-out revokes the server session", async () => {
    const response = await authRoute.POST(request("/api/auth/sign-out", {
      method: "POST", cookie: memberA, body: {},
    }));
    assert.equal(response.status, 200);
    assert.equal((await favoritesRoute.GET(request("/api/favorites", { cookie: memberA }))).status, 401);
  });
});
