# ui-ux-library — Product discovery

Status: inspiration-first direction recorded; discovery continues · Updated: 2026-10-28

The user has clarified the release order, preset meaning, and first supported agent, and supplied a product reference. Current work is discovery and specification; product UI implementation follows. The next discussion should resolve the inspiration browser's content and interactions.

## First discussion — answered or deferred

### D-01 — What is the main job?

**Original question:** should the main job be browsing and copying effects, creating in an editor, or exploring a broad UI kit?

**Confirmed answer:** the library should contain shaders and design presets that people can easily take into their work. It should also offer agent-usable design resources and skills, plus a curated list of useful websites for inspiration.

**2026-10-28 clarification:** the inspiration browser is version one; the agent-focused page comes afterward. This remains broader than a code-copy gallery in its long-term direction. Depth of customization is open, and a visual editor has not been requested.

### D-02 — Who is it for, and why would they choose it?

**Original question:** who will use it, and what should make it useful compared with existing libraries?

**Confirmed answer:** people taking inspiration and ready designs with shaders, including people building with coding agents. Coding agents must be able to use the later library experience. **Codex is the first supported agent**, confirmed on 2026-10-28. More specific personas, other agent support, and competitive differentiation can be refined later.

### D-03 — What should it look and feel like?

**Original question:** what should the visual mood, layout, typography, theme, and motion feel like?

**Confirmed interaction idea:** put useful inspiration websites in one compact scrollable list. Hovering a website should animate it getting larger and show what that site is about.

**2026-10-28 reference:** the user supplied [designeer.xyz](https://designeer.xyz) and wants something similar. Which aspects should carry over remains unanswered. The earlier hover idea is still product direction, not a finalized screen or animation specification. Equivalent keyboard/touch access and reduced-motion behavior are proposed accessibility requirements.

### D-04 — What should design presets contain, and how should agents use them?

**Original question:** what should people and agents take away, which agents should be supported, and how should resources be accessed?

**Confirmed answer on 2026-10-28:** presets are rules for agents with built-in colors, like design templates, together with reusable animations, headers, “bottoms,” and other sections. This document interprets “bottoms” as footers. Full website code is not the sole assumed output. Codex comes first.

**Tentative preference:** agents should “just search automatically.” This describes desired convenience; it does not select structured manifests/static JSON, skill files, an API, MCP, or a bootstrap method. How Codex first discovers the library and retrieves usable content remains open.

### D-05 — What should ship first?

**Original question:** which of shader/design presets, agent reuse, or inspiration should work fully first?

**Confirmed answer on 2026-10-28:** ship the **inspiration browser first**, followed by the **agent-focused page**. Shader rendering, reusable asset exports, skills, and Codex integration belong to later work. Exact version-one coverage and browsing tools remain open.

## Reference observations — not approved scope

Reviewed on 2026-10-28: [Designeer's home page](https://designeer.xyz) presents sidebar navigation for Finds, Inspiration, Resources, Tools, and Portfolios, with a screenshot-led gallery, search, and category filters. Its [inspiration list view](https://designeer.xyz/inspiration?view=list) presents a compact scrollable list beside a larger preview area; a selected entry can show a title, short description, visit link, and an area labelled live preview.

These observations help frame questions. They do not confirm which features, content categories, or styling the user wants, and do not establish hover behavior. Do not import the reference's listing content into this project.

## Current work boundary

Continue discovery and update the product/technical documents against the existing Next.js foundation. Keep the neutral placeholder while the version-one brief is clarified. Product screens, final visual design, and browsing interactions follow this specification work; shader rendering and agent integration follow version one.

## Follow-up decisions, in priority order

| ID | Topic | Questions to resolve | Why it matters |
| --- | --- | --- | --- |
| D-12 | Reference intent — V1 | Which parts of Designeer matter: navigation, compact list, gallery, adjacent preview, resource coverage, motion, or overall mood? Should this product expand entries within the list as originally described, show a preview beside it, or another approach? | Converts a reference into a specific original design brief without assuming all its features. |
| D-13 | Collection coverage — V1 | Is version one only inspiration websites, or should it also list design resources/tools, portfolios, or other useful links? Which categories and example entries belong at launch? | Defines the content taxonomy and first-release scope. |
| D-14 | Preview and click behavior — V1 | Should previews be screenshots, short clips, authored images, or live pages? On hover/focus, where do they appear? Does clicking open details first or visit the source? What is the touch equivalent? | Resolves the central browsing interaction, media requirements, and mobile behavior. |
| D-15 | Browsing tools — V1 | Are search, category filters, and favorites needed in the first version? If favorites are included, should they remain on one device or sync? | Selects core tools and avoids assuming persistence or accounts. |
| D-11 | Inspiration sourcing — V1 | Who curates links and descriptions? How will preview media be sourced, licensed, attributed, and refreshed? Who maintains broken links? | Defines content operations and approved preview use. |
| D-07 | Access and license | Is version one free/public, gated, paid, or undecided? What rights cover preview media? Later, what license covers design resources/skills and commercial reuse? | Resolves publication and access needs separately for each phase. |
| D-09 | Hosting and persistence | Where should it deploy? Does the confirmed version-one toolset need persistence? | Chooses infrastructure from the actual first-release requirements. |
| D-08 | Technical constraints | Which browsers/devices must V1 support? Later, which graphics runtimes and mobile shader previews are acceptable? | Defines the V1 interaction matrix while keeping graphics decisions in their later phase. |
| D-10 | Success and ownership | What would make the inspiration browser useful at first release? Who maintains it, and what time/content-production constraints apply? | Sets validation criteria and sustainable scope. |
| D-16 | Codex discovery and packaging — later | How should Codex first discover the library? What should automatic search retrieve, and when? Which preset/section/animation formats and delivery mechanism will it understand? | Defines bootstrap and protocol without treating the tentative search preference as a technical choice. |
| D-06 | Customization — later | Which design rules/colors/parameters can be changed? Are bounded templates enough, or is authoring/sharing/saved work needed? | Defines reusable preset behavior without expanding V1. |

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
| C-08 | 2026-10-28 | Inspiration browser is V1; agent-focused page follows afterward | Confirmed release priority, superseding the earlier open-priority question. |
| C-09 | 2026-10-28 | Codex is the first supported agent | Confirmed; other agents are not committed scope. Integration belongs to the later agent phase. |
| C-10 | 2026-10-28 | Presets contain agent rules and built-in colors, like design templates, plus reusable animations, headers, footers, and other sections | Confirmed direction; exact formats remain open. |
| C-11 | 2026-10-28 | Tentative preference for automatic agent search | User said “just search automatically I guess”; protocol, retrieval contract, and bootstrap are unresolved. |
| C-12 | 2026-10-28 | designeer.xyz is a product reference | User wants something similar; desired aspects are not yet confirmed. |
| C-13 | 2026-10-28 | Current work continues product clarification | Product UI implementation follows the version-one specification. |

## Material open decisions

Release order and the first supported agent are resolved. Version-one reference intent, websites versus broader resources, preview/click behavior, search/filters/favorites, sourcing, access, and hosting remain open. Later-phase resource formats, Codex bootstrap/protocol, licensing, and commercial reuse also remain open. Resolve each before building or publicly releasing the affected feature; later agent and shader decisions do not block the inspiration-first release.

## How answers become the specification

1. Capture the user's answers and references here.
2. Update the [PRD](./PRD.md) with the agreed audience, workflow, visual direction, requirements, and exclusions.
3. Update the [TRD](./TRD.md) with the architecture and implementation choices needed for that scope.
4. Resolve material open decisions before building the corresponding feature. Reversible project scaffolding can proceed independently.
