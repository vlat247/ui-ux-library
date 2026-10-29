import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

export interface ServerConfig {
  databasePath: string;
  baseURL: string;
  secret: string;
  ownerEmail: string;
  google?: { clientId: string; clientSecret: string };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getServerConfig(): ServerConfig {
  const baseURL = new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000");
  if (!["http:", "https:"].includes(baseURL.protocol)) {
    throw new Error("BETTER_AUTH_URL must be an HTTP(S) URL.");
  }

  let secret = process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }
  if (secret && secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must have at least 32 characters.");
  }
  // A missing development secret is ephemeral; set .env.local to retain sessions.
  secret ||= randomBytes(32).toString("hex");

  const databasePath = process.env.DATABASE_PATH || ".data/library.sqlite";
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  return {
    // The configured database is runtime storage, not an asset to trace into a build.
    databasePath: databasePath === ":memory:" ? databasePath : resolve(/* turbopackIgnore: true */ databasePath),
    baseURL: baseURL.origin,
    secret,
    ownerEmail: normalizeEmail(process.env.OWNER_EMAIL || ""),
    google: clientId && clientSecret ? { clientId, clientSecret } : undefined,
  };
}
