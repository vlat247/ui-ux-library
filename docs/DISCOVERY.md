# ui-ux-library — Product discovery

Status: product direction recorded; current phase is setup · Updated: 2026-10-27

The user has clarified the product pillars and audience. The user will explain the visual direction later; no design answers are needed to finish project setup. Follow-up decisions below are a record for future work, not a request to answer them now.

## First discussion — answered or deferred

### D-01 — What is the main job?

**Original question:** should the main job be browsing and copying effects, creating in an editor, or exploring a broad UI kit?

**Confirmed answer:** the library should contain shaders and design presets that people can easily take into their work. It should also offer agent-usable design resources and skills, plus a curated list of useful websites for inspiration.

This is broader than a code-copy gallery. The first-release priority across the three pillars and the depth of customization remain open. A visual editor has not been requested.

### D-02 — Who is it for, and why would they choose it?

**Original question:** who will use it, and what should make it useful compared with existing libraries?

**Confirmed answer:** people taking inspiration and ready designs with shaders, including people building with coding agents. Coding agents must be able to use the library. Specific supported agents, personas, and competitive differentiation can be refined later.

### D-03 — What should it look and feel like?

**Original question:** what should the visual mood, layout, typography, theme, and motion feel like?

**Confirmed interaction idea:** put useful inspiration websites in one compact scrollable list. Hovering a website should animate it getting larger and show what that site is about.

**Deferred by the user:** the overall look will be described later. For now, set up the project. The hover interaction is product direction, not a finalized screen or animation specification. Equivalent keyboard/touch access and reduced-motion behavior are proposed accessibility requirements.

## Current phase boundary

Set up the Next.js project structure and product/technical documents with a neutral placeholder home page. Do not implement product screens, shaders, demo pages, or a final visual design in this phase.

## Follow-up decisions, in priority order

| ID | Topic | Questions to resolve | Why it matters |
| --- | --- | --- | --- |
| D-04 | Output and agent access | What should people and agents take away: CSS, React/Next.js components, GLSL, design assets, instructions, or skills? Which agents should be supported? Should access use structured manifests/static JSON, downloadable skill files, MCP, or another mechanism? | Determines resource packaging and access; no protocol is selected yet. |
| D-05 | Launch priority and content | Which pillar should work fully first: shader/design presets, agent reuse, or inspiration? What belongs in the initial collection, and how much should ship across the other pillars? | Establishes a manageable first release without dropping the confirmed product direction. |
| D-06 | Customization | Which settings should users change? Are bounded presets enough, or do they need freeform editing, import, undo, sharing, or saved work? | Separates a library detail view from a creation tool. |
| D-07 | Access and license | Is the initial product free, paid, or undecided? Can people and agents reuse assets commercially? Will source code be public? What license covers resources and skills? | Determines distribution and what may legally ship. |
| D-08 | Technical constraints | Which browsers/devices must work? Are WebGL or other graphics dependencies acceptable? Are mobile shader previews essential? Any accessibility or performance constraints beyond a usable baseline? | Defines shader support, fallbacks, and the verification matrix. |
| D-09 | Hosting and persistence | Where should it deploy? Is it a public site or initially local/private? Does launch need accounts, saved presets, shared links, or a database? | Avoids choosing infrastructure before persistence is needed. |
| D-10 | Success and ownership | What would make the first release useful to you? Who will create and maintain the collection? Are there time, budget, or content-production constraints? | Sets validation criteria and a sustainable content scope. |
| D-11 | Inspiration sourcing | Who selects the sites and writes descriptions? How will preview imagery be sourced, licensed, attributed, and refreshed? Should previews be authored images, captured screenshots, or another approved format? | Defines content operations and avoids assuming permission to copy website content. |
| D-12 | Later visual brief | When the user is ready, record reference sites, preferred theme, typography, density, and the detailed expansion animation. | Directs interface implementation after setup; intentionally deferred now. |

## Decision record

Only record a decision here after it is agreed. Suggestions in the PRD are not decisions.

| ID | Date | Decision | Evidence/status |
| --- | --- | --- | --- |
| C-01 | 2026-10-27 | Working name: ui-ux-library | Initial user brief; final naming remains open. |
| C-02 | 2026-10-27 | Application stack: Next.js | Initial user brief. |
| C-03 | 2026-10-27 | Include shaders and reusable design presets; gradients were part of the initial brief | User clarification; exact launch collection and depth remain open. |
| C-04 | 2026-10-27 | Serve people seeking inspiration and ready designs, including users of coding agents; coding agents must use the library | User clarification; supported agents and access mechanism remain open. |
| C-05 | 2026-10-27 | Include reusable design resources and skills that are easy to take | User clarification; asset/skill formats and distribution remain open. |
| C-06 | 2026-10-27 | Curate useful inspiration sites in a compact scrollable list with animated enlargement and a site description on hover | User clarification; final styling, preview sourcing, and exact animation remain open. |
| C-07 | 2026-10-27 | Current phase is project setup; user will provide the look later | Explicit user direction; no product UI or final visual design in this phase. |

## Material open decisions

Launch priority and scope, asset/export formats, agent protocol and supported agents, content sourcing/provenance, licensing and commercial reuse, and deployment remain unresolved. None blocks neutral project scaffolding. Resolve each before building or publicly releasing the affected feature.

## How answers become the specification

1. Capture the user's answers and references here.
2. Update the [PRD](./PRD.md) with the agreed audience, workflow, visual direction, requirements, and exclusions.
3. Update the [TRD](./TRD.md) with the architecture and implementation choices needed for that scope.
4. Resolve material open decisions before building the corresponding feature. Reversible project scaffolding can proceed independently.
