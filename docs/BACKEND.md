# Local V1 backend

The app uses real Better Auth sessions, email/password authentication, optional Google OAuth,
and durable SQLite storage through Node.js 24's `node:sqlite`. Public browsing stays available
without an account. Favorites and submissions require sign-in; publication requires the owner.

## Configuration

Copy `.env.example` to `.env.local`, generate a secret, and restart the development server
after changing configuration. Environment files and `.data/` must stay out of Git.

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | A random secret of at least 32 characters; required in production |
| `BETTER_AUTH_URL` | The application's exact origin; local default `http://localhost:3000` |
| `DATABASE_PATH` | SQLite file; default `.data/library.sqlite`, relative to the project root |
| `OWNER_EMAIL` | Exact owner email, compared after trimming and lowercasing; blank grants nobody owner access |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Both are required to enable Google OAuth |

Use `openssl rand -hex 32` to generate a secret. Without a configured development secret,
the process generates an ephemeral one and sessions will not survive restarting it.
Register the Google callback as `<BETTER_AUTH_URL>/api/auth/callback/google`.
The interface can check `googleEnabled` before offering Google sign-in; credentials are never public.

## Owner account

There is no first-user promotion. Owner authorization requires the configured email and a verified
identity. Public email/password registration cannot claim the reserved owner email.
An identity verified by Google can use that matching address directly. For local email/password use:

1. Set `OWNER_EMAIL` in `.env.local`.
2. Run `node --import tsx scripts/create-owner.ts` from the project root.
3. Enter and confirm the hidden password, then use ordinary email sign-in in the app.

The script loads `.env.local`, creates the explicitly configured account, and marks its email
verified as a local administrative operation. It refuses to replace an existing account.
Optional `OWNER_NAME` changes the display name. `OWNER_PASSWORD` supports noninteractive local
automation; pass it through the process environment without saving it to the repository.
No owner-creation endpoint is exposed over HTTP.

## API contract

All application responses use `Cache-Control: no-store`. Auth routes use Better Auth's own behavior.
Private endpoints validate the actual server session, not just the presence of a cookie.

| Endpoint | Behavior |
| --- | --- |
| `GET /api/me` | `{user: null \| {id,name,email}, isOwner, googleEnabled}` |
| `GET /api/entries` | `{entries}`: curated seeds and approved submissions only |
| `GET /api/favorites` | `{ids}` for the signed-in account, filtered to published entries |
| `POST /api/favorites` | `{entryId,saved}`; returns current `{ids}` |
| `GET /api/submissions` | `{submissions}`: own records for members, all records for the owner |
| `POST /api/submissions` | `{title,url,description,section,category}`; returns `{submission}` with `201`, always pending |
| `PATCH /api/submissions/:id` | Owner-only `{status: "approved" \| "rejected"}`; returns `{submission}` |
| `/api/auth/*` | Better Auth's email signup/sign-in, Google OAuth, session, and sign-out endpoints |

Application mutations require `Origin` matching `BETTER_AUTH_URL` and `Content-Type: application/json`.
Bodies are limited to 16 KiB. Titles allow 3–120 characters, descriptions 10–1200, categories 2–60,
and HTTP(S) source URLs up to 2048 characters without embedded credentials. Sections are
`sites` or `inspiration`. URLs are stored as data; the server fetches no submitted metadata.
Account display names are validated server-side as nonempty strings of at most 80 characters.
An unknown publication or submission returns `404`; protected routes return `401` or `403`.

Approved community links use stable `submission:<id>` entry identifiers and a generic artwork
fallback. They do not invent a screenshot, original creator, clip, or source media.
Rejecting a previously approved entry removes it from the public collection immediately.
Saved responses also exclude unpublished entries; a user may remove an old saved record.
Favorite records are unique per user and entry. Submissions cannot supply their own author or status.

## Persistence and migrations

The database is opened lazily on the first request and cached across development reloads.
Every route waits for initialization before calling auth or application queries.
Initialization runs Better Auth's programmatic migration planner and versioned application migrations
inside one SQLite write transaction. An unsafe auth migration stops startup instead of silently
rewriting existing account data. The application schema version is stored in
`library_schema_migrations`; future changes need a new reviewed migration.

SQLite uses foreign keys, WAL, and a busy timeout. Back up the database with a SQLite-aware backup
or stop the server before copying the database and its journal files. The local file requires a
persistent writable volume; ephemeral serverless filesystems and separate unsynchronized replicas
do not provide durable shared accounts. Deployment storage must be selected before publishing.

## Verification

Run `node --import tsx --test scripts/backend.test.ts` from the project root.
The suite uses real authentication handlers, sessions, and an isolated temporary SQLite file.
It verifies guest gates, owner-address protection, private favorites, uniqueness, submission
isolation, approval/rejection publication, removal from saved results, origin/profile/input validation,
repeatable migrations, durable records, and session revocation. It never uses the local app database.
Run the project's lint, typecheck, and build checks afterward.

Google's external OAuth exchange requires real configured credentials and a browser test.
No SMTP delivery, email verification flow for ordinary accounts, password reset delivery,
automatic media import, or public deployment is included in this local V1.
Email/password signup and sign-in work without pretending to send mail.

References: [Better Auth SQLite](https://better-auth.com/docs/adapters/sqlite),
[Next.js integration](https://better-auth.com/docs/integrations/next), and
[email/password authentication](https://better-auth.com/docs/authentication/email-password).
