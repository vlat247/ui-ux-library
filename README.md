# ui-ux-library

A design discovery library built with Next.js App Router, React, TypeScript, Tailwind CSS 4,
Better Auth, and SQLite through Node.js 24's `node:sqlite`.
The local V1 is implemented. Deployment and the owner's initial collection remain open.
Reusable gradients, shaders, design presets, and Codex delivery are later phases.

## Local V1

- Public **Inspiration** collection with detail previews and three playable original motion studies.
- **Useful Sites** directory with compact rows that expand on hover, keyboard focus, or touch.
- Metadata search, category filters, Inspiration content-type filters, and Curated / Recently added sorting.
- Private account-saved favorites with a Saved filter.
- Email/password accounts and optional Google sign-in.
- Signed-in link submissions, account status tracking, and an owner-only review queue at `/review`.
  New submissions stay pending until approved; rejecting a published submission removes it from browsing.
- Responsive layouts, visible keyboard focus, reduced-motion support, video controls,
  and playback pausing when previews leave the screen or the tab becomes hidden.

The 16 editable seed suggestions contain 10 Useful Sites, three original motion studies,
and three linked interactive websites, awaiting the owner's collection. External previews are original illustrated covers;
there are no fabricated X/Twitter posts. See [content provenance](docs/CONTENT.md).

## Start locally

Use Node.js 24 (`.nvmrc`) and pnpm 10.29.3 (`packageManager`).

```sh
nvm use
pnpm install
cp .env.example .env.local
openssl rand -hex 32
```

If `.env.local` already exists, keep it and edit it rather than copying over it. Configure before starting:

| Variable | Configuration |
| --- | --- |
| `BETTER_AUTH_SECRET` | Paste the generated random secret; at least 32 characters |
| `BETTER_AUTH_URL` | Exact app origin, normally `http://localhost:3000` locally |
| `DATABASE_PATH` | Defaults to `.data/library.sqlite`, relative to the project root |
| `OWNER_EMAIL` | Set the exact owner's address privately to enable owner access |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional; configure both for Google sign-in |

```sh
pnpm dev
```

Open the URL printed by Next.js, normally [localhost:3000](http://localhost:3000).
Keep `BETTER_AUTH_URL` aligned with that origin. Restart after configuration changes.
The database initializes on the first backend request. Environment files and `.data/`
are ignored by Git; keep secrets and the owner's address out of public documentation.

## Owner access and Google sign-in

After setting `OWNER_EMAIL`, create the local owner account from an interactive terminal:

```sh
pnpm owner:create
```

Enter and confirm your own password at the hidden prompts, then use ordinary email
sign-in and open `/review`. The command marks the configured identity verified and
refuses to replace an existing account. Public signup reserves the owner address;
there is no first-user promotion. Owner access requires the configured email and
a verified identity. See [backend setup](docs/BACKEND.md) for details.

Google sign-in uses Better Auth's OAuth flow and needs real provider credentials.
Register `<BETTER_AUTH_URL>/api/auth/callback/google` as its callback, for example
`http://localhost:3000/api/auth/callback/google`. The Google button is disabled until
both credentials are configured. The external OAuth exchange still needs validation
with those credentials; a Google-verified matching owner identity can access review.

## Project structure

```text
src/
  app/                  App Router pages, API routes, and styles
  components/           Shared UI and dialogs
  features/
    discovery/          Browsing UI, filters, previews, and query tests
    account/            Authentication, submissions, and owner review UI
  content/              Serializable seed metadata
  lib/server/           Authentication, SQLite, validation, and publication rules
  registry/             Boundary for future reusable effects and presets
  shaders/              Future graphics runtime and lifecycle guidance
public/previews/        Original MP4 studies and JPEG posters
scripts/                Owner bootstrap, backend tests, and preview generation
docs/                   Product, technical, discovery, backend, and content records
```

Keep content independent of rendering code. Keep browser interaction in Client Components
and routes/layouts on the server by default. Follow `src/shaders/README.md` for graphics code.

## Commands and validation

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start development |
| `pnpm lint` | Run ESLint with zero warnings allowed |
| `pnpm typecheck` | Generate route types and check TypeScript |
| `pnpm check` | Run lint and type checking |
| `pnpm test` | Run discovery query and isolated backend behavior tests |
| `pnpm build` / `pnpm start` | Build and serve production locally |
| `pnpm owner:create` | Provision the explicitly configured owner |

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` for application changes.
Tests can also run individually with `node --import tsx --test scripts/backend.test.ts`
or `node --import tsx --test src/features/discovery/query.test.ts`.
Backend tests use a temporary database rather than the local app database.
See [local verification results](docs/VALIDATION.md) for the browser checks and remaining limits.

## Current limits

No public deployment is configured. Production SQLite needs a persistent writable volume
and shared database state; ephemeral serverless storage is insufficient. Ordinary email
verification delivery, SMTP, password reset delivery, automatic social/media import,
agent presets, and a shader runtime are not implemented. Email/password accounts work locally.

Continue with the [PRD](docs/PRD.md), [TRD](docs/TRD.md), [discovery notes](docs/DISCOVERY.md),
[backend contract](docs/BACKEND.md), and [content provenance](docs/CONTENT.md).
