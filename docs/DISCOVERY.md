# ui-ux-library — Product discovery

Status: local V1 implemented; content and external setup continue · Updated: 2026-10-29

The local V1 now implements both collections, browsing tools, account favorites, real email/password authentication, pending submissions, and owner review. Better Auth and Node.js SQLite are implementation choices; Google/email support and owner approval are user requirements. Google credentials, private owner bootstrap, the intended collection, and public deployment setup remain. Historical discovery answers are retained below; current implementation notes supersede earlier open technical choices.

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

**2026-10-29 clarification:** keep the original list idea for Useful Sites: entries expand within the list on hover, with beautiful animation, previews, and information. The site should be pleasant to look at and use. The implementation uses dark neutral surfaces, restrained violet accents, system type, keyboard/touch equivalents, and reduced-motion behavior; visual refinement remains possible.

### D-04 — What should design presets contain, and how should agents use them?

**Original question:** what should people and agents take away, which agents should be supported, and how should resources be accessed?

**Confirmed answer on 2026-10-28:** presets are rules for agents with built-in colors, like design templates, together with reusable animations, headers, “bottoms,” and other sections. This document interprets “bottoms” as footers. Full website code is not the sole assumed output. Codex comes first.

**Tentative preference:** agents should “just search automatically.” This describes desired convenience; it does not select structured manifests/static JSON, skill files, an API, MCP, or a bootstrap method. How Codex first discovers the library and retrieves usable content remains open.

### D-05 — What should ship first?

**Original question:** which of shader/design presets, agent reuse, or inspiration should work fully first?

**Confirmed answer on 2026-10-28:** ship the **inspiration browser first**, followed by the **agent-focused page**. Shader rendering, reusable asset exports, skills, and Codex integration belong to later work.

**2026-10-29 clarification:** the first release has two core browsing tabs/sections: Useful Sites and Inspiration. Both are implemented at `/` with section/query state; the agent-focused page remains later work.

### D-12 — Which list and preview relationship should the reference inform?

**Original question:** should this product expand entries within the original list, show a larger preview beside the list, or use another approach?

**Confirmed answer on 2026-10-29:** keep the **original compact scrollable list with expansion within the list** for Useful Sites. The reference's side-by-side preview is not selected. The desired quality is beautiful animation and styling with enjoyable usability. Expansion geometry and timing remain design details.

### D-13 — What content belongs in version one?

**Original question:** is version one only websites, or should it also include broader design resources and examples?

**Confirmed answer on 2026-10-29:** separate the two purposes into core browsing tabs/sections:

- **Useful Sites** — useful website links in the compact hover-expanding list.
- **Inspiration** — interesting designs/design solutions, short animation videos, and interactive website examples.

The implementation uses a responsive Inspiration grid with detail previews and explicit external source links, without live embeds. Short animation clips for inspiration are V1 content; reusable animations and agent design instructions remain later-phase resources. The starter contains 16 editable suggestions, including three original motion studies; the owner has not yet supplied the intended collection or specific X posts.

**Source clarification on 2026-10-29:** “design form X” means posts with interesting designs from X/Twitter. No automatic X import, API integration, or scraping is selected.

### D-17 — Does X mean X/Twitter?

**Confirmed answer on 2026-10-29:** yes, posts with interesting designs from Twitter. V1 uses source links and authored/approved previews; no X posts, automatic import, or social embeds are fabricated in the starter.

### D-11 — Who supplies the initial collection, and can visitors contribute?

**Confirmed answer on 2026-10-29:** the owner supplies the initial collection, and visitors can submit links in V1. The implemented form collects URL, title, description, section, and category; SQLite stores pending/approved/rejected status. The member account dialog shows their submissions. No media upload/import or external submission vendor is used.

### D-18 — Do submissions need review and an account?

**Confirmed answer on 2026-10-29:** submitters must be signed in, and submissions need the owner's approval before publication. This is implemented with real sessions, approved-only public queries, and owner-only decisions at `/review`. Unapproved entries stay private; members see only their own history. Owner access requires a verified identity matching private `OWNER_EMAIL`, with no first-user promotion.

### D-19 — Which sign-in methods should be supported?

**User-confirmed on 2026-10-29:** Google and email. **Implementation choice:** Better Auth with real email/password signup/sign-in and optional Google OAuth. Google needs provider credentials and an external exchange test; no email code/link, SMTP verification, or reset-email delivery is configured.

**Implemented default selected during development:** public browsing, with sign-in to save or submit. This remains distinct from the user's explicit account requirement for submissions.

### D-15 — Which browsing tools belong in V1?

**Selected under the user's delegation on 2026-10-29:** metadata search scoped to the active collection (name, description, tags, source/domain); category filters in both sections; an Inspiration-only content-type filter; Curated and Recently added sorting; private account-saved favorites and a Saved-only filter/view inside each section. Include clear filters, counts, no-results/empty states, and clear source/creator links.

Preserve the original Useful Sites list without another main tab or layout toggle. Defer folders/multiple saved collections, color filters, popularity analytics/rankings, advanced search/recommendations, sponsors, and automatic X import. Feature selection is delegated judgment, separate from the user's explicit Google/email choice.

## Reference observations — not approved scope

Reviewed on 2026-10-28: [Designeer's home page](https://designeer.xyz) presents sidebar navigation for Finds, Inspiration, Resources, Tools, and Portfolios, with a screenshot-led gallery, search, and category filters. Its [inspiration list view](https://designeer.xyz/inspiration?view=list) presents a compact scrollable list beside a larger preview area; a selected entry can show a title, short description, visit link, and an area labelled live preview.

These are historical reference observations, not this project's feature specification. The user has since selected the original in-list expansion for Useful Sites. Other observed reference features and listing content are not adopted automatically.

Reviewed again on 2026-10-29: [Designeer Inspiration](https://designeer.xyz/inspiration) and its search UI expose cross-category search, category controls, favorites, Curated/Recently added/A to Z/Most viewed/Most visited ordering, a color filter, list/tile switching, and folders. Account behavior and favorite syncing were not tested. The selected V1 set above deliberately uses only the relevant subset.

## Current implementation and setup

V1 UI, APIs, real sessions, SQLite persistence, account favorites, and owner review are implemented. The collection includes 10 useful sites, three original local MP4 studies/posters, and three linked interactive websites. Details and provenance are in [CONTENT.md](./CONTENT.md). These are starter suggestions, not the owner's supplied content.

Set the ignored local environment using `.env.example`. The exact owner address belongs only in private configuration; public docs contain no real owner email or password. The owner must run `pnpm owner:create` and choose their own password, or use a matching Google-verified identity after OAuth setup. No owner password was created as part of this implementation. See [BACKEND.md](./BACKEND.md).

Before public deployment, choose persistent hosting/storage, configure the stable origin/secret and Google project, review the initial collection/media rights, and finish the deployment/browser checks. Shader rendering and agent delivery remain later work.

## Follow-up decisions, in priority order

| ID | Topic | Questions to resolve | Why it matters |
| --- | --- | --- | --- |
| D-20 | Google and owner setup | Configure the Google project/callback and let the owner provision their private account. | Better Auth email/password is implemented; external credentials and the owner's password are not supplied. |
| D-14 | Intended collection and source media | Which owner-provided links/X posts should replace or extend the starter? Which preview media can be displayed with appropriate attribution/permission? | Current interactions use detail previews and source links; content remains editable. |
| D-07 | Content rights and access policy | What rights cover contributed preview media and later reusable assets/skills? Is monetization needed later? | Current browsing is public; no payment or media-import service exists. |
| D-09 | Production hosting | Where should the Node app and persistent SQLite volume run, and how will backups be handled? | Local SQLite is implemented; production storage/hosting is not configured. |
| D-08 | Technical constraints | Which browsers/devices must V1 support? Later, which graphics runtimes and mobile shader previews are acceptable? | Defines the V1 interaction matrix while keeping graphics decisions in their later phase. |
| D-10 | Success and ownership | What would make the inspiration browser useful at first release? Who maintains it, and what time/content-production constraints apply? | Sets validation criteria and sustainable scope. |
| D-16 | Codex discovery and packaging — later | How should Codex first discover the library? What should automatic search retrieve, and when? Which preset/section/animation formats and delivery mechanism will it understand? | Defines bootstrap and protocol without treating the tentative search preference as a technical choice. |
| D-06 | Customization — later | Which design rules/colors/parameters can be changed? Are bounded templates enough, or is authoring/sharing/saved work needed? | Defines reusable preset behavior without expanding V1. |

## Decision record

Distinguish direct user decisions from development choices. Earlier rows record discovery at that time; C-24–C-26 supersede the earlier open provider, storage, layout, and owner-provisioning details.

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
| C-19 | 2026-10-29 | Owner supplies the initial curated collection; visitors can submit links in V1 | Submission form/storage implemented; owner collection still awaited. |
| C-20 | 2026-10-29 | Visitor link submission requires a signed-in account | Implemented; public browsing is the development default. |
| C-21 | 2026-10-29 | Visitor submissions need owner approval before publication | Implemented with pending/approved/rejected status and owner-only review. |
| C-22 | 2026-10-29 | Support Google and email sign-in | Explicit user choice; C-24 records the implementation. Google external setup remains. |
| C-23 | 2026-10-29 | V1 uses scoped metadata search, category/type filters, Curated/Recently added sorting, private account favorites, Saved-only mode, clear states/counts, and source/creator links | Selected by the assistant under explicit user delegation, informed by direct reference review; see D-15. |
| C-24 | 2026-10-29 | Implement Better Auth email/password, optional Google OAuth, and Node.js SQLite persistence | Development choice implementing the user's account requirements; no SMTP/reset delivery or live Google exchange claimed. |
| C-25 | 2026-10-29 | Implement `/` with two query-driven collections and `/review` with owner moderation | Development choices: dark neutral/violet UI, responsive previews, public browsing, private saves, and real submission state. |
| C-26 | 2026-10-29 | Reserve the configured owner identity and provision it locally with `pnpm owner:create` | Verified exact-email owner gate; no first-user promotion, public bootstrap endpoint, or preset owner password. |

## Material open decisions

The local V1 choices are implemented rather than open proposals. Remaining setup is Google credentials/exchange verification, the owner's private password bootstrap, the intended collection and its rights, production hosting/storage, and final responsive/deployment validation. Visual/content refinement remains possible. Later-phase asset formats, Codex bootstrap/protocol, shader engine, licensing, and commercial reuse remain open.

## How answers become the specification

1. Capture the user's answers and references here.
2. Update the [PRD](./PRD.md) with the agreed audience, workflow, visual direction, requirements, and exclusions.
3. Update the [TRD](./TRD.md) with the architecture and implementation choices needed for that scope.
4. Resolve material open decisions before building the corresponding feature. Reversible project scaffolding can proceed independently.
