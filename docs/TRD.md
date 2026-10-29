# Technical requirements — UI/UX Library

Status: local V1 implemented; production setup remains · Updated: 2026-10-29

This document describes the code currently in the repository, its validation requirements,
and later work. The application is implemented locally; no public deployment or completed
Google OAuth exchange is claimed. See [BACKEND.md](./BACKEND.md) for the detailed backend
contract and [CONTENT.md](./CONTENT.md) for source/media provenance.

## 1. Implemented V1

- Public Inspiration and Useful Sites collections with shareable URL query state.
- Metadata search scoped to the active collection, category/content-type filters,
  Curated/Recently added ordering, counts, reset, and empty states.
- Original in-place Useful Sites expansion for mouse hover, keyboard focus, and touch/click.
- Responsive Inspiration grid, detail previews, source links, and creator context.
- Private account favorites with Saved filtering and durable server storage.
- Real email/password signup, sign-in, sign-out, and sessions through Better Auth.
- Optional Google OAuth, enabled only when both credentials are configured.
- Authenticated link submission with pending/approved/rejected states and owner-only review.
- Sixteen editable starter entries, including three original local motion clips and posters.

Accounts are required to save or submit. Browsing is public in the current implementation.
The account/provider/storage choices below are implementation decisions, distinct from the
user's explicit requirements for Google/email sign-in and owner-approved submissions.

## 2. Stack and runtime

| Area | Current implementation |
| --- | --- |
| Runtime | Node.js 24; required for `node:sqlite` and the owner provisioning command |
| Application | Next.js 16.4.3 App Router, React/React DOM 19.3.0, strict TypeScript |
| Styling | Tailwind CSS 4 integration, native CSS, shared OKLCH tokens, system fonts |
| Identity | Better Auth 1.7.x; exact installed version recorded in the lockfile |
| Persistence | Node.js `DatabaseSync`, SQLite WAL, foreign keys, busy timeout |
| UI primitives | Native dialogs, Radix icons, small client component boundaries |
| Tooling | pnpm 10.29.3, ESLint 9, TypeScript 5, tsx for local scripts/tests |

Pages/layouts remain Server Components by default. Client components own search/filter state,
media controls, dialogs, and authenticated actions. Server-only modules hold auth/config/SQL;
credentials and owner configuration are not passed to browser components.

## 3. Routes and module boundaries

```text
src/app/
  page.tsx                         # Server shell and initial query/seed data
  review/page.tsx                   # Owner review shell
  api/auth/[...all]/route.ts        # Better Auth handlers
  api/{entries,me,favorites}/       # Public collection and private account state
  api/submissions/                 # Submission create/list and owner decisions
src/features/
  discovery/                      # Browser UI, previews, query logic/types/tests
  account/                        # Auth, submit, account, and review interfaces
src/components/dialog.tsx         # Native dialog wrapper
src/content/entries.ts            # Sixteen serializable starter entries
src/lib/
  auth-client.ts                   # Browser auth client
  server/                         # Config, sessions, validation, migrations, store
src/registry/                     # Future reusable effects/presets; no renderer
src/shaders/                      # Future graphics lifecycle guidance
public/previews/                  # Three original MP4/JPEG pairs
scripts/
  create-owner.ts                 # Local-only, interactive owner provisioning
  backend.test.ts                 # Isolated real-session/SQLite integration tests
  generate-previews.py            # Deterministic procedural media generator
```

The two browsing areas are `/?section=inspiration` and `/?section=sites`, with additional
`q`, `category`, `type`, `sort`, and `saved` query values. Query parsing constrains accepted
values; filtering/sorting is a pure function. Section changes reset search/category/type.
The owner interface is `/review`; it checks account identity before requesting the queue.
Ordinary members see an access message there without a queue request.

The remaining `features/library` and `content/library.ts` starter contracts are future preset
boundaries, not additional live product interfaces. `registry` and `shaders` are later-phase
boundaries rather than working exports or graphics integrations.

## 4. Content and previews

`DiscoveryEntry` metadata is serializable and independent of rendering code. The public
collection combines `seedEntries` with approved submissions. Pending/rejected submissions
are excluded from collection results and favorite responses. Search covers title,
description, tags, source label/URL, and creator text; all search terms must match.

The starter contains 10 useful sites, three original motion studies, and three linked
interactive websites. It is editable seed content, not the owner's supplied collection.
There are no invented X posts, popularity counts, or copied reference-site listings.
External sources use illustrated covers labelled as such in details; they are not screenshots
or live embeds. Approved visitor links get generic artwork without invented media/creators.

The three local MP4s are silent four-second loops at 720 × 480/24 fps, H.264/yuv420p with
fast-start metadata. JPEG posters support still previews. Mouse hover can play a preview
unless reduced motion is requested; detail dialogs expose native playback controls.
Intersection/visibility handlers pause offscreen and background playback and clean up on
unmount. Keyboard/touch users open the detail dialog to access playback controls.
See [CONTENT.md](./CONTENT.md) for verification, source links, and regeneration details.

## 5. Authentication and owner access

Better Auth stores real identities/sessions in SQLite. Email/password signup and sign-in
work locally. Google OAuth is wired through the provider integration but disabled without
both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. The callback is
`<BETTER_AUTH_URL>/api/auth/callback/google`; a configured external exchange still needs
verification with the actual deployment origin and Google project.

Owner authorization requires the exact configured `OWNER_EMAIL`, compared after trimming
and lowercasing, plus a verified identity. There is no first-user promotion. Public
email/password signup cannot claim the reserved owner address. A verified matching Google
identity can qualify; local email/password owner access uses `pnpm owner:create`.

The provisioning command reads the ignored local environment, asks the owner for a hidden
password and confirmation, and creates the verified account. It refuses to replace an
existing account. No public provisioning endpoint, preset owner password, or real owner
address belongs in source/docs. The owner must perform this setup; documenting the command
does not mean an owner password has been created.

No SMTP delivery, ordinary-account email verification delivery, password-reset delivery,
one-time email link/code flow, or media upload/import service is configured.

## 6. API and publication behavior

| Endpoint | Behavior |
| --- | --- |
| `GET /api/me` | Current user or null, owner flag, Google availability |
| `GET /api/entries` | Starter entries plus approved submissions only |
| `GET/POST /api/favorites` | Current account's saved IDs and save/remove mutation |
| `GET /api/submissions` | Members' own records; all records for the owner |
| `POST /api/submissions` | Authenticated URL/title/description/section/category; always pending |
| `PATCH /api/submissions/:id` | Owner-only approved/rejected decision |
| `/api/auth/*` | Better Auth identity/session operations |

Server session validation, not client state or a cookie's mere presence, authorizes private
operations. Application mutations require the configured same origin and JSON bodies, with
bounded input sizes and HTTP(S) URLs without embedded credentials. User IDs, submitter
identity, and publication status come from trusted server state. The server does not fetch
submitted URLs or scrape metadata. Full field limits/errors are in [BACKEND.md](./BACKEND.md).

Submission receipt is distinct from publication. The member account dialog shows status;
`/review` offers pending/all/approved/rejected filters, author/source context, decision
feedback, and refresh/error states. Approval publishes the link; rejecting an approved link
removes it from the public collection and returned saved results. Favorites are unique per
user/entry, account-private, and filtered to currently published content.

## 7. Configuration, storage, and deployment

Copy `.env.example` to the ignored `.env.local`. Set a stable `BETTER_AUTH_SECRET` of at
least 32 characters, the exact `BETTER_AUTH_URL`, the private owner address, and optionally
Google credentials. `DATABASE_PATH` defaults to `.data/library.sqlite` relative to the
process working directory. A missing development secret is ephemeral and loses sessions
across restart; production requires a secret. Restart after changing configuration.

Database initialization is lazy and shared across development reloads. Better Auth migration
planning and versioned library migrations run within one SQLite write transaction. Unsafe
auth schema changes stop initialization for review. Existing account data must not be
silently rebuilt during an upgrade; future application schema changes need a new migration.

Deployment remains unselected. The Node runtime needs a persistent writable database volume
and a stable origin/secret. Ephemeral filesystems or independent unsynchronized SQLite
replicas do not provide durable shared accounts. Use a SQLite-aware backup, or stop the
process before copying database/journal files. No static-export compatibility is claimed.

## 8. Validation and remaining setup

Run from the repository root:

```sh
pnpm lint
pnpm typecheck
node --import tsx --test src/features/discovery/query.test.ts
node --import tsx --test scripts/backend.test.ts
pnpm build
```

The query suite covers combined filters/search/Saved state, stable sorting, and URL parsing.
Backend integration tests use real auth handlers/sessions and an isolated temporary database;
they cover guest/member/owner gates, reserved owner identity, private favorites, pending and
approved publication, rejection, input/origin validation, persistence, migrations, and revoked
sessions. They do not operate on the local app database or test Google's external exchange.

The current local results and remaining verification limits are recorded in
[VALIDATION.md](./VALIDATION.md). Passing implementation checks is distinct from public release readiness.
Browser validation should cover both collections, keyboard/touch expansion, reduced motion,
video controls, auth handoff, saving, submit/review feedback, responsive layouts, and source
links. Configure and test Google separately. Before public deployment, provision the owner,
replace/review starter content and rights, select persistent hosting, and check the real origin.

## 9. Later agent library and graphics work

Codex is the first target for reusable design rules/colors, section templates, animations,
skills, and shader resources. Automatic search remains a desired workflow; discovery,
bootstrap, protocol, packaging, and licensing are unresolved. No agent-facing page,
manifest/MCP service, shader renderer, asset exporter, or installable skill is implemented.

Keep future delivery independent of visual layouts. Preview/export values should derive from
one configuration. When graphics are introduced, follow `src/shaders/README.md`: client-only
initialization, on-demand loading, reduced-motion/static alternatives, offscreen/hidden pause,
bounded resolution, cleanup/disposal, and context-loss/unsupported-renderer fallbacks.
No graphics engine or WebGPU support baseline has been selected.
