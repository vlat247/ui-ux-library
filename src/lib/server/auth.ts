import { AsyncLocalStorage } from "node:async_hooks";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { APIError, betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { getServerConfig, normalizeEmail, type ServerConfig } from "./config";
import { LibraryStore, migrateLibraryTables } from "./store";

const ownerProvisioning = new AsyncLocalStorage<boolean>();

function displayName(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 80) {
    throw new APIError("BAD_REQUEST", { message: "Your name must contain 1–80 characters." });
  }
  return value.trim();
}

export async function createBackend(config: ServerConfig = getServerConfig()) {
  if (config.databasePath !== ":memory:") mkdirSync(dirname(config.databasePath), { recursive: true });
  const db = new DatabaseSync(config.databasePath);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");

  const auth = betterAuth({
    appName: "ui-ux-library",
    database: db,
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: [config.baseURL],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    socialProviders: config.google ? { google: config.google } : {},
    rateLimit: { enabled: true, window: 60, max: 100, storage: "database" },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (config.ownerEmail && normalizeEmail(user.email) === config.ownerEmail
              && !user.emailVerified && !ownerProvisioning.getStore()) {
              throw new APIError("FORBIDDEN", {
                message: "This address is reserved for the owner. Use Google or ask the owner to provision it locally.",
              });
            }
            return { data: { ...user, name: displayName(user.name), email: normalizeEmail(user.email) } };
          },
        },
        update: {
          before: async (user) => {
            if (user.name !== undefined) return { data: { ...user, name: displayName(user.name) } };
          },
        },
      },
    },
  });

  try {
    // One SQLite write lock covers inspection and both migration sets.
    db.exec("BEGIN IMMEDIATE");
    const migrations = await getMigrations(auth.options);
    if (migrations.schemaProblems.length || migrations.unsafeChanges.length) {
      throw new Error("The authentication schema needs a reviewed migration before startup.");
    }
    await migrations.runMigrations();
    migrateLibraryTables(db);
    db.exec("COMMIT");
  } catch (error) {
    if (db.isTransaction) db.exec("ROLLBACK");
    db.close();
    throw error;
  }

  return { auth, db, config, store: new LibraryStore(db) };
}

export type Backend = Awaited<ReturnType<typeof createBackend>>;

const backendGlobal = globalThis as typeof globalThis & {
  __uiUxLibraryBackend?: Promise<Backend>;
};

export function getBackend(): Promise<Backend> {
  if (!backendGlobal.__uiUxLibraryBackend) {
    backendGlobal.__uiUxLibraryBackend = createBackend().catch((error) => {
      backendGlobal.__uiUxLibraryBackend = undefined;
      throw error;
    });
  }
  return backendGlobal.__uiUxLibraryBackend;
}

export function isOwner(
  user: { email: string; emailVerified: boolean } | null | undefined,
  config: ServerConfig,
): boolean {
  return Boolean(config.ownerEmail && user?.emailVerified
    && normalizeEmail(user.email) === config.ownerEmail);
}

/** Local CLI only. Never expose this function through an HTTP route. */
export async function provisionOwner(name: string, password: string): Promise<void> {
  const backend = await getBackend();
  const email = backend.config.ownerEmail;
  if (!email) throw new Error("Set OWNER_EMAIL before provisioning the owner.");
  const existing = backend.db.prepare('SELECT id FROM "user" WHERE email = ?').get(email);
  if (existing) throw new Error("That owner account already exists. Sign in with its existing method.");
  const result = await ownerProvisioning.run(true, () => backend.auth.api.signUpEmail({
    body: { name, email, password },
  }));
  backend.db.prepare('UPDATE "user" SET emailVerified = 1 WHERE id = ?').run(result.user.id);
}
