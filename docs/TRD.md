# Technical requirements — UI/UX Library

Status: discovery draft · Updated: 2026-10-28

The project foundation is complete. The current task is product discovery, with
the inspiration browser selected for the first release and an agent-focused page afterward.
The user supplied Designeer as a reference; the exact visual direction remains to clarify.
This document distinguishes the starter foundation from requirements for the future product.
No catalog interface, effect renderer, shader engine, or inspiration interaction is implemented by this setup.

## 1. Confirmed product requirements

- Build with Next.js.
- Include gradients, shaders, and reusable design presets.
- Serve people browsing and reusing assets, and coding agents consuming assets or skills.
- Provide a compact, scrollable, curated inspiration list.
- Expand inspiration entries on hover to reveal site descriptions.
- Ship the inspiration browser first; build the agent-focused page afterward.
- Support Codex first for agent consumption, with automatic library search as the desired workflow.
- Define design presets as reusable rules and built-in colors, with animations,
  headers, and other page sections; complete website code is not required by the brief.
- Use [Designeer](https://designeer.xyz/) as a reference while clarifying which aspects to adopt.

The mechanism for agent consumption and initial discovery is unresolved: structured
manifests, downloadable files, skills/plugins, an API, and MCP are candidates rather
than selected technologies. Automatic search is a desired user experience, not a
guarantee that an unconfigured Codex session will discover the library.
Keyboard and touch behavior for inspiration expansion must accompany the requested hover interaction.
Product routes, rendering engines, export formats, accounts, and commercial features remain open.
Shader rendering and agent integration do not gate the first inspiration-browser release.

## 2. Starter baseline

| Area | Setup scope | Future work |
| --- | --- | --- |
| Application | Next.js App Router, TypeScript, neutral starter page | Product pages and interactions |
| Content | Local content boundaries and initial TypeScript contracts | Catalog entries, presets, curation workflow |
| Components | Shared UI and preview directories | Actual product components and renderers |
| Graphics | Lifecycle guidance only | Shader engine selection and effect implementations |
| Agent access | Architecture discussion only | A validated delivery contract and implementation |
| Storage | Repository files | Persistence only if saved user data is required |

No backend, authentication, database, payments, shader dependency, or external service is selected.
The starter page exists to verify the project can run, not to establish the product design.

## 3. Stack and configuration

- Next.js `16.4.3`, React and React DOM `19.3.0`, as pinned in `package.json`.
- TypeScript 5, strict mode, and the `@/*` import alias pointing to `src/*`.
- Tailwind CSS 4 and the generated `@tailwindcss/turbopack` integration; native CSS remains available.
- ESLint 9 with `eslint-config-next` matching the Next.js version.
- pnpm `10.29.3`; commit the generated lockfile after installation.
- System fonts; builds must not require remote font downloads.

Package ranges and the generated lockfile determine installed tooling versions.
`next.config.ts` retains the generated Tailwind CSS loader integration. Optional
Cache Components and partial prefetching are left disabled until a feature needs them.
Consult the [Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation)
and [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs) when changing the setup.

## 4. Folder boundaries

```text
src/
  app/
    layout.tsx                       # Application document and shared layout
    page.tsx                         # Neutral setup page
    globals.css                      # Baseline styles
  features/
    library/types.ts                 # Initial library contracts
    inspiration/types.ts             # Initial inspiration contracts
  content/
    library.ts                       # Empty typed resource collection
    inspiration.ts                   # Empty typed inspiration collection
    README.md                        # Content authoring and provenance guidance
  components/
    ui/                              # Shared interface component boundary
    previews/                        # Interactive effect preview boundary
  lib/
    site.ts                          # Shared site metadata
  registry/README.md                 # Reusable effect and preset source boundary
  shaders/README.md                  # Proposed graphics lifecycle requirements
public/
  previews/                          # Preview and fallback media boundary
docs/
  PRD.md
  TRD.md
  DISCOVERY.md
```

`app` owns routing and page composition; reusable effects should not be embedded in route files.
`features` owns contracts and workflows; `content` owns serializable authored metadata.
`registry` will own reusable effects and presets; `components/previews` will own browser interaction.
`shaders` holds lifecycle guidance now and can hold shared graphics support later.
The initial `LibraryItem` and `InspirationSite` types are scaffolding, not complete publication contracts.
Do not add a plugin framework, central state store, or service layer before requirements justify it.

## 5. Proposed routing and rendering

Only `/` is part of the current setup. Candidate future routes are `/library`,
`/library/[slug]`, and `/inspiration`; names and page responsibilities require product confirmation.
Pages, layouts, catalog descriptions, and metadata should remain Server Components by default.
Use small client boundaries for interactive controls, graphics, and browser APIs, following the
[Next.js server/client component model](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Catalog metadata must be serializable and importable without importing graphics runtimes.
A future manifest should reference item identifiers and content rather than execute preview components.
Resolve unknown item slugs to a not-found response.
When implementing detail routes, await the route `params` before reading `slug`, following the
[dynamic route documentation](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).
Keep agent delivery independent from visual page layouts so it can evolve without parsing rendered HTML.

## 6. Proposed source and export contract

This section concerns the later agent/resource phase. No effect export is implemented.
Presets should carry design instructions and color values, and may reference reusable
animations, headers, and other sections. CSS, React source, shader source, and packaged
skills are possible companion formats; their exact packaging is still open.
Each future item should declare its identifier, category, description, requirements, and licensing information.
Use deterministic, serializable configuration where practical.
When preview and export are added, derive both from the same configuration and generation functions.
Avoid maintaining separate example code that silently differs from the actual preview implementation.
Validate portable manifests against a versioned contract once an external consumer exists.
Do not expose arbitrary code execution merely to provide an editable preview.

### Later Codex discovery workflow

**Desired behavior:** a user requests a design, Codex searches this library, retrieves
a suitable preset's rules, colors, and relevant sections, then applies them to the project.
The user named Codex as the first target; automatic search was expressed as a tentative preference.

**Proposal:** keep a searchable, machine-readable index and stable per-resource
documentation independent of the visual inspiration interface. An agent-facing page
can explain access and reuse when that phase begins. Neither the index nor the page exists yet.

Codex can select an available skill when a task matches its description; the official
documentation describes local skill discovery and distribution through plugins.
That behavior concerns skills available to Codex, rather than arbitrary websites.
See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).
Decide later whether users introduce the library through a link, repository instructions,
an installed skill/plugin, or a configured service. The discovery step must be tested
with a representative Codex setup before automatic access is promised.

## 7. Proposed shader lifecycle

No graphics dependency has been chosen.
Canvas/WebGL, a focused shader library, or a scene library are candidates depending on actual effects.
WebGPU support is a separate compatibility decision; Three.js or another engine is not assumed.
Choose after agreeing on representative effects, target devices, licensing, and portability requirements.

Future graphics previews must:

- Initialize browser graphics inside client components and load expensive renderers on demand.
- Keep lists lightweight through static thumbnails, posters, or limited active previews.
- Pause when offscreen, when the document is hidden, and when the user requests a pause.
- Respect reduced-motion preferences and provide a still representation.
- Bound canvas resolution and pixel ratio; measure quality settings on target devices.
- Cancel animation frames, disconnect observers, remove listeners, and dispose GPU resources on unmount.
- Handle unsupported graphics, failed initialization, and lost rendering contexts gracefully.
- Preserve readable DOM content and accessible controls independently of a graphics surface.

Numeric frame-rate, memory, and bundle budgets remain pending an agreed device and effect baseline.

## 8. Future interface requirements

The inspiration list should support scrolling and expanding descriptions on hover as requested.
Provide equivalent focus, keyboard, and touch activation without making descriptions hover-only.
Use visible control labels, focus indicators, and readable contrast around visual previews.
Define motion timing, expansion geometry, mobile behavior, screenshots, and descriptions during design discovery.
Do not treat a temporary setup page as approval of typography, palette, layout, or animation direction.

### First inspiration-browser release

Confirmed core: curated website entries, a compact scrollable list, enlarged previews
and useful descriptions on hover, and deliberate navigation to source sites.
The reference's [list view](https://designeer.xyz/inspiration?view=list) was inspected
on 2026-10-28 and shows a list beside a larger preview area. The user's preferred
relationship between that layout and the earlier in-list expansion idea is still open.

Resolve these before implementation: resource categories, expansion placement,
preview media versus live embedding, click behavior, initial content sourcing,
search/filter scope, and whether favorites belong in the first release.
Accounts, submissions, saved collections, and all reference-site features are not
implicitly included. Graphics engine selection and agent integration remain later work.

## 9. Validation and release

Required local checks are `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
The typecheck script generates Next.js route types, then runs TypeScript without emitting files.

Setup verification on 2026-10-27:

| Check | Result |
| --- | --- |
| Dependency installation and lockfile | Passed |
| `pnpm lint` | Passed with zero warnings |
| `pnpm typecheck` | Passed |
| Production `next build` | Passed; `/` and the default not-found page prerendered |
| Temporary production HTTP smoke check | Passed: `/` returned 200 with the expected title/content, compiled Tailwind CSS returned 200, and an unknown route returned 404 |

The first build attempts hit a local sandbox restriction in the CSS worker.
A direct Next.js CLI retry with a clean generated `.next` cache and local worker
access completed successfully; no application or bundler workaround was needed.
The temporary verification server was stopped afterward. Browser viewport and
interaction checks remain for the product UI phase; no browser QA is claimed here.

When product features arrive, verify direct routes, unknown slugs, keyboard/touch behavior,
preview/export parity, clipboard feedback, reduced motion, and graphics cleanup as applicable.
Add targeted automated tests when logic complexity or regressions justify them.

Deployment is TBD: no host, domain, production environment, or publishing workflow has been selected.
Preserve a standard `next build` / `next start` path until hosting requirements are known.
Do not assume static export compatibility solely because initial content is stored locally.
Update the PRD, this document, and discovery decisions together as requirements become concrete.
