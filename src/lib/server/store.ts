import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { seedEntries } from "@/content/entries";
import type { DiscoveryEntry, Submission } from "@/features/discovery/types";
import { RequestError } from "./errors";
import type { SubmissionInput } from "./validation";

interface SubmissionRow {
  id: string;
  title: string;
  url: string;
  description: string;
  section: Submission["section"];
  category: string;
  status: Submission["status"];
  created_at: string;
  published_at: string | null;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
}

function submissionFromRow(row: SubmissionRow): Submission {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description,
    section: row.section,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    userId: row.user_id,
    userName: row.user_name || undefined,
    userEmail: row.user_email || undefined,
  };
}

export function migrateLibraryTables(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS library_schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
  const version = db.prepare("SELECT version FROM library_schema_migrations WHERE version = 1").get();
  if (version) return;
  db.exec(`
    CREATE TABLE library_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL,
      section TEXT NOT NULL CHECK (section IN ('sites', 'inspiration')),
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TEXT NOT NULL,
      published_at TEXT,
      reviewed_at TEXT,
      reviewed_by TEXT REFERENCES "user"(id) ON DELETE SET NULL
    );
    CREATE INDEX library_submissions_status_idx ON library_submissions(status, created_at);
    CREATE INDEX library_submissions_user_idx ON library_submissions(user_id, created_at);
    CREATE TABLE library_favorites (
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      entry_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, entry_id)
    );
  `);
  db.prepare("INSERT INTO library_schema_migrations(version, applied_at) VALUES (1, ?)")
    .run(new Date().toISOString());
}

export class LibraryStore {
  constructor(private readonly db: DatabaseSync) {}

  entries(): DiscoveryEntry[] {
    const rows = this.db.prepare(`
      SELECT * FROM library_submissions WHERE status = 'approved'
      ORDER BY published_at ASC, id ASC
    `).all() as unknown as SubmissionRow[];
    const lastCuratedOrder = Math.max(0, ...seedEntries.map((entry) => entry.curatedOrder));
    const approved = rows.map((row, index): DiscoveryEntry => ({
      id: `submission:${row.id}`,
      slug: `community-${row.id}`,
      title: row.title,
      description: row.description,
      section: row.section,
      kind: row.section === "sites" ? "website" : "design",
      category: row.category,
      tags: [row.category],
      sourceUrl: row.url,
      sourceLabel: new URL(row.url).hostname.replace(/^www\./, ""),
      art: "grid",
      color: "#d5d9de",
      publishedAt: row.published_at || row.created_at,
      curatedOrder: lastCuratedOrder + index + 1,
    }));
    return [...seedEntries, ...approved];
  }

  favoriteIds(userId: string): string[] {
    const published = new Set(this.entries().map((entry) => entry.id));
    const rows = this.db.prepare(`
      SELECT entry_id FROM library_favorites WHERE user_id = ? ORDER BY created_at DESC, entry_id
    `).all(userId) as { entry_id: string }[];
    return rows.map((row) => row.entry_id).filter((id) => published.has(id));
  }

  setFavorite(userId: string, entryId: string, saved: boolean): void {
    if (!saved) {
      this.db.prepare("DELETE FROM library_favorites WHERE user_id = ? AND entry_id = ?")
        .run(userId, entryId);
      return;
    }
    if (!this.entries().some((entry) => entry.id === entryId)) {
      throw new RequestError(404, "This entry is no longer published.");
    }
    this.db.prepare(`
      INSERT OR IGNORE INTO library_favorites(user_id, entry_id, created_at) VALUES (?, ?, ?)
    `).run(userId, entryId, new Date().toISOString());
  }

  submissions(userId: string, isOwner: boolean): Submission[] {
    const query = `
      SELECT s.*, u.name AS user_name, u.email AS user_email
      FROM library_submissions s JOIN "user" u ON u.id = s.user_id
      ${isOwner ? "" : "WHERE s.user_id = ?"}
      ORDER BY s.created_at DESC, s.id DESC
    `;
    const statement = this.db.prepare(query);
    const rows = (isOwner ? statement.all() : statement.all(userId)) as unknown as SubmissionRow[];
    return rows.map(submissionFromRow);
  }

  createSubmission(userId: string, input: SubmissionInput): Submission {
    const id = randomUUID();
    this.db.prepare(`
      INSERT INTO library_submissions
      (id, user_id, title, url, description, section, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, userId, input.title, input.url, input.description, input.section,
      input.category, new Date().toISOString());
    return this.submissions(userId, false).find((submission) => submission.id === id)!;
  }

  moderateSubmission(id: string, status: "approved" | "rejected", ownerId: string): Submission {
    const existing = this.db.prepare("SELECT status FROM library_submissions WHERE id = ?")
      .get(id) as { status: Submission["status"] } | undefined;
    if (!existing) throw new RequestError(404, "Submission not found.");
    if (existing.status !== status) {
      const now = new Date().toISOString();
      this.db.prepare(`
        UPDATE library_submissions
        SET status = ?, reviewed_at = ?, reviewed_by = ?, published_at = ?
        WHERE id = ?
      `).run(status, now, ownerId, status === "approved" ? now : null, id);
    }
    return this.submissions(ownerId, true).find((submission) => submission.id === id)!;
  }
}
