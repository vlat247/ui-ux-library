# Project context

Read `docs/PRD.md`, `docs/TRD.md`, and `docs/DISCOVERY.md` before changing product
scope. The Next.js foundation is complete; product discovery is ongoing. The first
release is an inspiration browser with two separate tabs: a Useful Sites directory
using the original compact list with entries expanding on hover, and an Inspiration
collection for designs, design solutions, short animation videos, and interactive
websites (tab names provisional). The agent-focused page for Codex comes afterward.
Designeer is a reference; current colors and the home page are provisional scaffolding.

## Boundaries

- Use TypeScript and App Router. Keep browser interactivity in narrow Client
  Components and keep route/layout components on the server by default.
- Keep `src/content/` serializable and independent of rendering code. Reusable
  effects and presets belong in `src/registry/`.
- The library serves people and coding agents. Agent delivery format is still
  open. Codex is the first target; automatic library search is a desired workflow,
  not an implemented discovery mechanism. This file guides repository development
  and is not a distributable skill.
- Accounts are required for V1 link submissions, and the owner must approve a
  submission before it is published. This does not establish a login requirement
  for browsing. Google and email are the selected sign-in methods; the email
  flow and auth provider remain open, as do storage, deployment, shader engine,
  payments, and licensing.
- V1 browsing tools are metadata search, category/content-type filters, Curated
  and Recently added sorting, and private account-saved favorites with a Saved
  filter. Public browsing is the proposed default; sign-in is needed to save/submit.
- The expanding Useful Sites list will need equivalent pointer, keyboard, and
  touch access. The media collection needs explicit playback and offscreen behavior.
- Inspiration includes cool design posts from X/Twitter. The owner supplies the
  initial collection. V1 needs authenticated submissions and an owner review flow;
  pending submissions must stay outside public collections.
- X API access, automatic social import, and media ingestion are not selected.
- Follow shader lifecycle and fallback requirements in `src/shaders/README.md`
  when introducing graphics code.

## Validation

Use pnpm. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` for scaffold or
application changes. Add behavior tests when meaningful product logic exists.
Keep the PRD and TRD accurate about what is implemented versus proposed.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
