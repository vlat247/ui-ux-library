# ui-ux-library

A Next.js foundation for shaders, reusable design presets, and curated inspiration
that people and coding agents can use in their own projects.

**Current phase:** product discovery; the project foundation is complete. The
first release will have a Useful Sites tab with an expanding compact list, and an
Inspiration tab for designs, design solutions, short animation videos, and
interactive websites (working names). An agent-focused page for Codex follows.
The home page is a neutral placeholder. Final design, launch content,
shader runtime, export formats, and agent delivery mechanism remain to be defined.

## Start locally

Use Node.js 24 (see `.nvmrc`) and pnpm 10.29.3 (see `packageManager`).

```sh
nvm use
pnpm install
pnpm dev
```

Open the local URL printed by Next.js, normally [localhost:3000](http://localhost:3000).
No environment variables or external services are required for this scaffold.

## Project structure

```text
src/
  app/                  Next.js routes, layout, and global styles
  components/
    ui/                 Shared interface components
    previews/           Future interactive effect previews
  features/
    library/            Initial library metadata types
    inspiration/        Initial curated-site metadata types
  content/              Empty typed collections, independent of renderers
  registry/             Future reusable effect and preset implementations
  shaders/              Graphics runtime boundary and lifecycle guidance
  lib/                  Shared site metadata and utilities
public/
  previews/             Future preview and fallback media
docs/
  PRD.md                Product direction, scope, and acceptance criteria
  TRD.md                Architecture, technical requirements, and open choices
  DISCOVERY.md          Answers, decision record, and later questions
```

Keep authored metadata serializable. Load graphics and browser APIs only through
client preview components. The initial metadata types are intentionally minimal;
publication will need an agreed format, dependencies, provenance, and licensing.

## Product direction

- Reusable shaders, gradients, design presets, and design instructions.
- Design rules, built-in colors, animations, and reusable sections for agents.
- Codex first, with automatic library search as the desired later workflow.
- A separate Useful Sites tab with a compact, scrollable list and animated row expansion.
- Another tab for interesting designs, design solutions, short animation clips,
  interactive website examples, and cool design posts from X/Twitter.
- An initial owner-curated collection, plus link submissions from signed-in
  visitors. Submissions become public only after the owner's approval.
- Google and email sign-in; email flow and auth provider remain to be selected.
- Search, category/content-type filters, Curated/Recently added sorting, and
  account-saved favorites with a Saved filter.
- Pleasant browsing with polished visual design and motion.

The inspiration interaction and all other product screens are future work.
[Designeer](https://designeer.xyz/) is the current reference; the user selected
the original expanding list. Final visual direction remains under discussion.
See the [PRD](docs/PRD.md), [TRD](docs/TRD.md), and [discovery notes](docs/DISCOVERY.md).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm lint` | Run ESLint with zero warnings allowed |
| `pnpm typecheck` | Generate Next.js route types and run TypeScript |
| `pnpm check` | Run lint and type checking |
| `pnpm build` | Produce a production build |
| `pnpm start` | Serve the production build |

No behavior test suite is included yet because product behavior has not been
implemented. Add focused tests with the first meaningful feature logic.

## Foundation

Next.js App Router, React, strict TypeScript, Tailwind CSS 4, ESLint, and pnpm.
The lockfile records installed versions. System fonts keep builds independent of
font download services. The current theme follows the OS and is provisional.

The setup follows the [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation)
and [Tailwind Next.js integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
Accounts and owner approval are required for submissions; their implementation,
email sign-in flow, auth provider, storage, deployment, licensing, and monetization
remain open. Public browsing with login for saving/submitting is the proposed default.
