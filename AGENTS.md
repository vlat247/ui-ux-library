# Project context

Read `docs/PRD.md`, `docs/TRD.md`, and `docs/DISCOVERY.md` before changing product
scope. The Next.js foundation is complete; product discovery is ongoing. The first
release is the inspiration browser, followed by an agent-focused page for Codex.
Designeer is a reference whose relevant aspects remain to clarify; current colors
and the home page are provisional scaffolding.

## Boundaries

- Use TypeScript and App Router. Keep browser interactivity in narrow Client
  Components and keep route/layout components on the server by default.
- Keep `src/content/` serializable and independent of rendering code. Reusable
  effects and presets belong in `src/registry/`.
- The library serves people and coding agents. Agent delivery format is still
  open. Codex is the first target; automatic library search is a desired workflow,
  not an implemented discovery mechanism. This file guides repository development
  and is not a distributable skill.
- Shader engine, deployment, persistence, accounts, payments, and licensing are
  pending decisions. Choose dependencies when feature requirements justify them.
- The inspiration list will need equivalent pointer, keyboard, and touch access.
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
