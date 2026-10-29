# ui-ux-library — Product discovery

Status: two core browsing areas recorded; discovery continues · Updated: 2026-10-29

The user has confirmed Google/email sign-in and delegated selection of useful V1 browsing tools. The selected set is recorded below, alongside the two core areas and authenticated, owner-approved submissions. Names/routes remain provisional. Current work is discovery and specification; email flow, provider, source-media display, entry actions, hosting, and styling remain open.

## First discussion — answered or deferred

### D-01 — What is the main job?

**Original question:** should the main job be browsing and copying effects, creating in an editor, or exploring a broad UI kit?

**Confirmed answer:** the library should contain shaders and design presets that people can easily take into their work. It should also offer agent-usable design resources and skills, plus a curated list of useful websites for inspiration.

**2026-10-28 clarification:** the inspiration browser is version one; the agent-focused page comes afterward. This remains broader than a code-copy gallery in its long-term direction. Depth of customization is open, and a visual editor has not been requested.

**2026-10-29 clarification:** version one separates a useful-websites list from a collection of interesting designs, design solutions, short animation videos, and interactive website examples. It is broader than a resource directory alone.

### D-02 — Who is it for, and why would they choose it?

**Original question:** who will use it, and what should make it useful compared with existing libraries?

**Confirmed answer:** people taking inspiration and ready designs with shaders, including people building with coding agents. Coding agents must be able to use the later library experience. **Codex is the first supported agent**, confirmed on 2026-10-28. More specific personas, other agent support, and competitive differentiation can be refined later.

### D-03 — What should it look and feel like?

**Original question:** what should the visual mood, layout, typography, theme, and motion feel like?

**Confirmed interaction idea:** put useful inspiration websites in one compact scrollable list. Hovering a website should animate it getting larger and show what that site is about.

**2026-10-28 reference:** the user supplied [designeer.xyz](https://designeer.xyz) and wants something similar.

**2026-10-29 clarification:** keep the original list idea for Useful Sites: entries expand within the list on hover, with beautiful animation, previews, and information. The site should be pleasant to look at and use. Palette, typography, and exact motion timing are not yet selected. Equivalent keyboard/touch access and reduced-motion behavior are proposed accessibility requirements.

### D-04 — What should design presets contain, and how should agents use them?

**Original question:** what should people and agents take away, which agents should be supported, and how should resources be accessed?

**Confirmed answer on 2026-10-28:** presets are rules for agents with built-in colors, like design templates, together with reusable animations, headers, “bottoms,” and other sections. This document interprets “bottoms” as footers. Full website code is not the sole assumed output. Codex comes first.

**Tentative preference:** agents should “just search automatically.” This describes desired convenience; it does not select structured manifests/static JSON, skill files, an API, MCP, or a bootstrap method. How Codex first discovers the library and retrieves usable content remains open.

### D-05 — What should ship first?

**Original question:** which of shader/design presets, agent reuse, or inspiration should work fully first?

**Confirmed answer on 2026-10-28:** ship the **inspiration browser first**, followed by the **agent-focused page**. Shader rendering, reusable asset exports, skills, and Codex integration belong to later work.

**2026-10-29 clarification:** the first release has two core browsing tabs/sections: Useful Sites and Inspiration. Core content and browsing tools are resolved below; entry behavior and media delivery remain open.

### D-12 — Which list and preview relationship should the reference inform?

**Original question:** should this product expand entries within the original list, show a larger preview beside the list, or use another approach?

**Confirmed answer on 2026-10-29:** keep the **original compact scrollable list with expansion within the list** for Useful Sites. The reference's side-by-side preview is not selected. The desired quality is beautiful animation and styling with enjoyable usability. Expansion geometry and timing remain design details.

### D-13 — What content belongs in version one?

**Original question:** is version one only websites, or should it also include broader design resources and examples?

**Confirmed answer on 2026-10-29:** separate the two purposes into core browsing tabs/sections:

- **Useful Sites** — useful website links in the compact hover-expanding list.
- **Inspiration** — interesting designs/design solutions, short animation videos, and interactive website examples.

These names and routes are working labels. The Inspiration layout is not selected as a feed or grid. Interactive website examples do not by themselves imply a live embed. Short animation clips for inspiration are V1 content; reusable animations and agent design instructions remain later-phase resources.

**Source clarification on 2026-10-29:** “design form X” means posts with interesting designs from X/Twitter. No automatic X import, API integration, or scraping is selected.

### D-17 — Does X mean X/Twitter?

**Confirmed answer on 2026-10-29:** yes, posts with interesting designs from Twitter. Displaying source links, previews, or embeds remains a separate decision.

### D-11 — Who supplies the initial collection, and can visitors contribute?

**Confirmed answer on 2026-10-29:** the owner supplies the initial collection, and visitors have an option to submit links in V1. The follow-up answer below resolves submission access and publication; fields, storage, and detailed status UX remain open. No external submission service is selected.

### D-18 — Do submissions need review and an account?

**Confirmed answer on 2026-10-29:** submitters must be signed in, and submissions need the owner's approval before publication. Unapproved submissions stay out of public collections, and only the owner can approve them. Provider/storage choices, status labels, and rejection UX remain open. Sign-in options and the proposed browsing-access default follow below.

### D-19 — Which sign-in methods should be supported?

**User-confirmed on 2026-10-29:** Google and email. Email/password versus an email code or link, and the auth provider, remain open.

**Assistant-proposed default:** public browsing, with sign-in to save favorites or submit links. Public browsing was not explicitly confirmed by the user.

### D-15 — Which browsing tools belong in V1?

**Selected under the user's delegation on 2026-10-29:** metadata search scoped to the active collection (name, description, tags, source/domain); category filters in both sections; an Inspiration-only content-type filter; Curated and Recently added sorting; private account-saved favorites and a Saved-only filter/view inside each section. Include clear filters, counts, no-results/empty states, and clear source/creator links.

Preserve the original Useful Sites list without another main tab or layout toggle. Defer folders/multiple saved collections, color filters, popularity analytics/rankings, advanced search/recommendations, sponsors, and automatic X import. Feature selection is delegated judgment, separate from the user's explicit Google/email choice.

## Reference observations — not approved scope

Reviewed on 2026-10-28: [Designeer's home page](https://designeer.xyz) presents sidebar navigation for Finds, Inspiration, Resources, Tools, and Portfolios, with a screenshot-led gallery, search, and category filters. Its [inspiration list view](https://designeer.xyz/inspiration?view=list) presents a compact scrollable list beside a larger preview area; a selected entry can show a title, short description, visit link, and an area labelled live preview.

These are historical reference observations, not this project's feature specification. The user has since selected the original in-list expansion for Useful Sites. Other observed reference features and listing content are not adopted automatically.

Reviewed again on 2026-10-29: [Designeer Inspiration](https://designeer.xyz/inspiration) and its search UI expose cross-category search, category controls, favorites, Curated/Recently added/A to Z/Most viewed/Most visited ordering, a color filter, list/tile switching, and folders. Account behavior and favorite syncing were not tested. The selected V1 set above deliberately uses only the relevant subset.

## Current work boundary

Continue discovery and update the product/technical documents against the existing Next.js foundation. Keep the neutral placeholder while the version-one brief is clarified. Product screens, final visual design, and browsing interactions follow this specification work; shader rendering and agent integration follow version one.

## Follow-up decisions, in priority order

| ID | Topic | Questions to resolve | Why it matters |
| --- | --- | --- | --- |
| D-20 | Email flow and provider — V1 | Should email sign-in use a password, one-time code, or link? Which auth provider fits the chosen hosting/storage? | Resolves implementation of the confirmed Google/email options. Public browsing remains a proposed default. |
| D-14 | Entry actions and media — V1 | Does selecting an entry open details or visit its source? How should Useful Sites behave on touch? Where will short clips come from, and should they play from hosted files or embeds? Should interactive examples link out or also have live embeds? | Resolves navigation and media delivery while preserving the confirmed in-list expansion and content categories. |
| D-07 | Access and license | Is version one free/public, gated, paid, or undecided? What rights cover preview media? Later, what license covers design resources/skills and commercial reuse? | Resolves publication and access needs separately for each phase. |
| D-09 | Hosting and persistence | Where should it deploy, and which storage should support accounts, private favorites, and submissions? | Chooses infrastructure for the selected persistent capabilities; no vendor is selected. |
| D-08 | Technical constraints | Which browsers/devices must V1 support? Later, which graphics runtimes and mobile shader previews are acceptable? | Defines the V1 interaction matrix while keeping graphics decisions in their later phase. |
| D-10 | Success and ownership | What would make the inspiration browser useful at first release? Who maintains it, and what time/content-production constraints apply? | Sets validation criteria and sustainable scope. |
| D-16 | Codex discovery and packaging — later | How should Codex first discover the library? What should automatic search retrieve, and when? Which preset/section/animation formats and delivery mechanism will it understand? | Defines bootstrap and protocol without treating the tentative search preference as a technical choice. |
| D-06 | Customization — later | Which design rules/colors/parameters can be changed? Are bounded templates enough, or is authoring/sharing/saved work needed? | Defines reusable preset behavior without expanding V1. |

## Decision record

Distinguish direct user decisions from selections made under the user's delegation. Proposed defaults remain labelled as proposals.

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
| C-14 | 2026-10-29 | V1 separates Useful Sites and Inspiration into core browsing tabs/sections | Structure confirmed; names, routes, and exact navigation treatment remain provisional. |
| C-15 | 2026-10-29 | Useful Sites uses the original compact scrollable list, with entries expanding within the list on hover | Resolves the earlier original-list versus adjacent-preview question. Useful previews/information and beautiful motion are intended; detailed geometry/timing remain open. |
| C-16 | 2026-10-29 | Inspiration includes interesting designs/design solutions, short animation videos, and interactive website examples | Core categories confirmed. Feed/grid layout, clip sources, and link-only versus embedded examples remain open. |
| C-17 | 2026-10-29 | The product should be pleasant to look at and use, with beautiful styling and animation | Quality goal confirmed; palette, typography, and detailed motion remain open. |
| C-18 | 2026-10-29 | Inspiration includes design posts from X/Twitter | Resolves the earlier X wording; no automatic import/API/scraping selected. |
| C-19 | 2026-10-29 | Owner supplies the initial curated collection; visitors can submit links in V1 | Submission access and approval subsequently resolved by C-20/C-21; fields and storage remain open. |
| C-20 | 2026-10-29 | Visitor link submission requires a signed-in account | Confirmed; sign-in options subsequently resolved by C-22. Provider and browsing access remain open. |
| C-21 | 2026-10-29 | Visitor submissions need owner approval before publication | Confirmed; detailed review/status/rejection UX remains open. |
| C-22 | 2026-10-29 | Support Google and email sign-in | Explicit user choice; email/password versus code/link and provider remain open. |
| C-23 | 2026-10-29 | V1 uses scoped metadata search, category/type filters, Curated/Recently added sorting, private account favorites, Saved-only mode, clear states/counts, and source/creator links | Selected by the assistant under explicit user delegation, informed by direct reference review; see D-15. |

## Material open decisions

Release order, Codex as the first later-phase agent, core browsing areas/content, X/Twitter source, authenticated owner-approved submissions, Google/email sign-in, and the delegated V1 browsing-tool selection are resolved. Email flow/provider, the proposed public-browsing default, submission fields/storage/status UX, source-media display, entry actions, hosting, and final styling remain open. Later-phase formats, Codex bootstrap/protocol, licensing, and commercial reuse remain open without blocking V1.

## How answers become the specification

1. Capture the user's answers and references here.
2. Update the [PRD](./PRD.md) with the agreed audience, workflow, visual direction, requirements, and exclusions.
3. Update the [TRD](./TRD.md) with the architecture and implementation choices needed for that scope.
4. Resolve material open decisions before building the corresponding feature. Reversible project scaffolding can proceed independently.
