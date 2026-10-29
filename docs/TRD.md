# Technical requirements — UI/UX Library

Status: discovery draft · Updated: 2026-10-29

The project foundation is complete. The current task is product discovery, with
the inspiration browser selected for the first release and an agent-focused page afterward.
The first release has separate Useful Sites and Inspiration sections (working names).
The user selected the original expanding-list interaction; exact styling remains open.
This document distinguishes the starter foundation from requirements for the future product.
No catalog interface, effect renderer, shader engine, or inspiration interaction is implemented by this setup.

## 1. Confirmed product requirements

- Build with Next.js.
- Include gradients, shaders, and reusable design presets.
- Serve people browsing and reusing assets, and coding agents consuming assets or skills.
- Provide a separate Useful Sites tab with a compact, scrollable, curated list.
- Expand useful-site entries within the original list on hover, with useful
  preview information and descriptions.
- Provide another tab for interesting designs, design solutions, short animation
  videos, and interactive website examples. Its exact feed/list layout is still open.
- Make the experience pleasant to browse, with polished styling and motion.
- Include cool design posts from X/Twitter in the Inspiration collection.
- Start with an owner-curated collection and let visitors submit links in V1.
- Require an account to submit links and owner approval before publication.
- Offer Google and email sign-in. The email flow and identity provider are not selected.
- Include metadata search, category/content-type filters, Curated/Recently added
  sorting, and account-saved favorites as the selected V1 browsing tools.
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
Product routes, rendering engines, export formats, authentication implementation,
and commercial features remain open. Accounts are required for submissions;
public browsing with authentication for saving and submitting is the proposed default.
Shader rendering and agent integration do not gate the first inspiration-browser release.

## 2. Starter baseline

| Area | Setup scope | Future work |
| --- | --- | --- |
| Application | Next.js App Router, TypeScript, neutral starter page | Product pages and interactions |
| Content | Local content boundaries and initial TypeScript contracts | Catalog entries, presets, curation workflow |
| Components | Shared UI and preview directories | Actual product components and renderers |
| Graphics | Lifecycle guidance only | Shader engine selection and effect implementations |
| Agent access | Architecture discussion only | A validated delivery contract and implementation |
| Storage | Repository files for the empty starter | Durable account/submission state required for V1; backend not selected |
| Identity and review | No implementation | Google/email sign-in, authenticated saves/submissions, owner-controlled publication |

No backend/authentication provider, database, payment service, graphics library,
or other external service has been selected.
Account-based submissions and owner approval are now required product capabilities;
this does not select their providers or claim an implemented service.
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
Two separate browser sections/tabs are now confirmed, but their route names and
whether tab selection is represented in the URL remain implementation decisions.
Pages, layouts, catalog descriptions, and metadata should remain Server Components by default.
Use small client boundaries for interactive controls, graphics, and browser APIs, following the
[Next.js server/client component model](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Catalog metadata must be serializable and importable without importing graphics runtimes.
A future manifest should reference item identifiers and content rather than execute preview components.
Resolve unknown item slugs to a not-found response.
When implementing detail routes, await the route `params` before reading `slug`, following the
[dynamic route documentation](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).
Keep agent delivery independent from visual page layouts so it can evolve without parsing rendered HTML.

### Proposed first-release content boundaries

Keep the useful-site directory separate from the inspiration collection. A resource
site helps visitors find a useful destination; an inspiration entry demonstrates an
interesting design, design solution, animation, or interactive website.

The current `InspirationSite` type and empty collection only scaffold website
metadata. They do not yet model videos or a mixed inspiration collection.
When implementation begins, define serializable entry types with explicit media
kinds, source URLs, descriptions, tags, and optional creator/preview metadata.
The two collections can share visual primitives without sharing an ambiguous data model.
Choose file storage or a content service from the agreed curation workflow; none
is selected by the two-tab requirement alone.

The user confirmed design posts from X/Twitter as a content source. An X API,
automatic social import/scraping, and a specific embed or media-ingestion mechanism
are not selected. Choose preview presentation and source linking during design.

### Visitor link submissions — planned V1 capability

The owner supplies the initial collection; visitors can submit additional links.
Submission persistence and publication are separate from the curated public
collections. The current scaffold implements neither a form nor a submission service.

**Confirmed workflow:** the visitor signs in, submits a link, and waits for the
owner's approval. A submission cannot appear in the public collection before approval.
Signing in does not grant permission to approve or publish a submission.

**Proposed implementation:** collect a URL with enough context to classify it as
a useful site or inspiration example, acknowledge receipt, and provide an owner
review queue. Pending, approved, and rejected are candidate internal states; exact
labels, rejection feedback, and editing behavior remain open. Required fields,
the email sign-in flow, provider, duplicate handling, storage, and review UI are undecided.

Google and email are the confirmed sign-in methods. Email/password versus an
email code/link remains open; no authentication provider has been selected.

Select a durable submission destination from that workflow; repository-backed
public content alone does not define a way to receive visitor submissions.
When implementing, enforce signed-in submission and owner-only approval on the
server, and exclude pending submissions from public collection queries. Validate
submitted data and treat links as data rather than instructions. Whether metadata
is fetched is a separate choice. Public browsing is the proposed default, with
authentication required for private saves and visitor submissions.

### Selected V1 browsing tools and proposed data handling

The user delegated selection of the most useful browsing tools from the reference.
Direct inspection of [Designeer](https://designeer.xyz/inspiration) on 2026-10-29
showed search, category filters, favorites, and Curated/Recently added sorting,
alongside additional tools. The selected subset for this product is:

- Search the active collection by name, description, tags, and source/domain.
- Filter by authored category; Inspiration also supports its design/clip/interactive
  content types. Exact taxonomy follows the initial curated entries.
- Sort by Curated editorial order or Recently added publication date.
- Save/remove favorites within an account and use a Saved-only filter in either section.
- Show result counts, clear-filter actions, and useful empty/no-result states.
- Preserve clear original-source and creator links alongside previews.

**Proposed implementation:** keep search/filter/sort state in validated URL parameters;
keep hover expansion and media playback transient in client components. Start with
typed metadata queries rather than selecting an external search service upfront.
All public results and counts must use published entries only. Use a stable
editorial order and publication timestamp so both sorting modes are deterministic.

Private favorites need durable account-scoped storage with one record per user/entry.
Use stable internal entry and user identifiers, enforce ownership on the server, and
preserve the user's browsing context through sign-in. A Saved filter never grants
access to another person's collection. Define unavailable-entry behavior if content
is unpublished. These capabilities are planned; no favorites service exists yet.

Folders, color filtering, popularity rankings, advanced recommendations, and an
extra view toggle are deferred. Useful Sites retains its confirmed expanding list.

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

The Useful Sites list should support scrolling and expanding entries on hover as requested.
Provide equivalent focus, keyboard, and touch activation without making descriptions hover-only.
Use visible control labels, focus indicators, and readable contrast around visual previews.
Define motion timing, expansion geometry, mobile behavior, screenshots, and descriptions during design discovery.
Do not treat a temporary setup page as approval of typography, palette, layout, or animation direction.

### First inspiration-browser release

Confirmed core: two separate sections/tabs. Useful Sites contains a compact
scrollable list whose entries expand in place on hover, with useful preview
information. Inspiration contains interesting designs, design solutions, short
animation videos, and interactive website examples. Exact tab names are provisional.

The reference's [list view](https://designeer.xyz/inspiration?view=list) was inspected
on 2026-10-28 and shows a list beside a larger preview area. On 2026-10-29 the
user chose the original expanding list rather than that adjacent-preview arrangement.

Resolve these before implementation: actual launch entries, source and media
handling, click behavior, submission fields/email flow/storage and review UI,
the exact category taxonomy, and final browse-control presentation.
The exact geometry of expansion, palette, typography, and motion timing remain open.
Authenticated visitor link submissions and owner approval are included in V1.
Private account favorites are also selected for V1; folders and additional
reference-site features remain deferred.
Graphics engine selection and agent integration remain later work.

### Proposed media and interaction requirements

- Expose the two sections as accessible navigation or tabs according to routing.
- Preserve readable content, scroll control, and focus during row expansion.
- Give keyboard focus and touch an equivalent way to inspect expanded site entries.
- Represent short clips with useful poster/fallback content and accessible playback
  controls. Whether clips autoplay or require interaction is still a design decision.
- Load media on demand and pause offscreen or background-tab playback. Agree an
  active-playback budget when selecting representative launch clips.
- Respect reduced motion in both interface transitions and preview playback.
- Distinguish a link to an interactive website from an interactive embed or local demo;
  the user has not yet selected among those behaviors.
- Preserve source/creator attribution and provide an understandable fallback when
  preview media is unavailable. Do not require a live embed for every external entry.

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
For submissions, verify that signed-out visitors cannot submit, ordinary members
cannot approve, pending content remains unpublished, and owner approval makes the
intended entry available. Check the selected browsing-access rule separately.
Verify search/filter/sort composition, clear and empty states, saved-item persistence,
account isolation, and exclusion of unpublished entries from results and counts.
Add targeted automated tests when logic complexity or regressions justify them.

Deployment is TBD: no host, domain, production environment, or publishing workflow has been selected.
Preserve a standard `next build` / `next start` path until hosting requirements are known.
Do not assume static export compatibility solely because initial content is stored locally.
Update the PRD, this document, and discovery decisions together as requirements become concrete.
