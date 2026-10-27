# ui-ux-library

A Next.js foundation for shaders, reusable design presets, and curated inspiration
that people and coding agents can use in their own projects.

**Current phase:** project setup and discovery. The home page is a neutral
placeholder. The final design, launch collection, shader runtime, export formats,
and agent delivery mechanism are still to be defined.

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
- Resources and skills that coding agents can discover and use.
- A compact, scrollable inspiration list with expanding website previews.

The inspiration interaction and all other product screens are future work.
Visual direction is deferred until the user provides references.
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
Deployment, licensing, accounts, persistence, and monetization remain open.
