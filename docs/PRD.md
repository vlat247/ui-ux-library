# ui-ux-library — Product requirements

Version: 0.8 · Status: local V1 implemented; external setup remains · Updated: 2026-10-29

The first local V1 implements Inspiration, Useful Sites, accounts, saved finds, and owner-reviewed link submission. Requirements below describe the intended behavior; implementation notes do not claim that every acceptance check or external setup is complete. The agent-focused library remains later work. See [DISCOVERY.md](./DISCOVERY.md) for decisions, [TRD.md](./TRD.md) for architecture, and [BACKEND.md](./BACKEND.md) for account/owner setup.

## 1. What is confirmed

- Working project name: **ui-ux-library**.
- The application will use **Next.js**.
- The product will include **shaders and reusable design presets**; gradients were part of the initial brief.
- Design presets mean **rules for agents with built-in colors**, similar to design templates, plus reusable animations, headers, footers, and other sections. Presets are not limited to complete website code.
- It serves people finding inspiration and ready designs, including people building with coding agents. **Codex is the first supported agent** for the later agent-focused experience.
- **Version one has two core tabs/sections.** Useful Sites contains useful website links; Inspiration contains interesting designs, design solutions, short animation videos, and interactive website examples. Their display names and routes remain provisional.
- **Useful Sites keeps the original compact, scrollable list.** Hovering a website entry expands it within the list with beautiful animation, useful previews, and information about the site. A separate adjacent preview layout has not been selected.
- Inspiration is implemented as a responsive visual collection, separate from the Useful Sites list.
- Inspiration includes **posts with interesting designs from X/Twitter**. Automatic import, API access, and scraping are not selected.
- The owner supplies the intended initial collection; the app currently includes editable starter suggestions. Signed-in visitors submit a URL, title, description, section, and category. Submissions remain pending until owner approval.
- **Google and email sign-in are confirmed.** The local implementation uses Better Auth with email/password. Google OAuth is wired but requires external credentials and an end-to-end provider check.
- The site should be **pleasant to look at and use**. The implemented direction uses dark neutral surfaces, a restrained violet accent, system typography, and in-list expansion; visual refinement remains possible.
- **The inspiration browser is version one. The agent-focused page comes afterward.** Shader rendering, asset exports, skill delivery, and Codex integration are later-phase features.
- Users should be able to take useful resources from the library easily. The exact asset formats and transfer mechanisms are undecided.
- The user tentatively prefers agents to **search the library automatically**. Discovery protocol and how an agent first learns where and how to search are unresolved.
- The user supplied [designeer.xyz](https://designeer.xyz) as a reference. The original in-list expansion and separate sections now guide this product; other visual details remain open.

The local app uses public browsing with sign-in for private favorites and submission. Better Auth and Node.js SQLite provide real sessions and durable local state. Hosting, production storage, Google credentials, content ownership/reuse policy, and the owner's password bootstrap remain setup work. No paid tier, AI generation, automatic social import, or external media ingestion is implemented.

## Implemented scope and remaining setup

| Area | Local implementation | Setup or limitation |
| --- | --- | --- |
| Browsing | Two sections, scoped metadata search, categories/types, Curated/Recently added sort, counts, reset and empty states | Seed taxonomy/content is editable. |
| Useful Sites | Mouse-hover, keyboard-focus, and touch/click expansion within the original list | Final content and interaction QA remain reviewable. |
| Inspiration/media | Detail previews, explicit source actions, three original short videos with posters and native detail controls | External websites are linked, not embedded; no X posts are invented. |
| Accounts/saves | Real email/password signup/sign-in/sign-out; private account favorites and Saved filtering | Google needs credentials; no SMTP verification/reset delivery is configured. |
| Submissions/review | Pending submissions, member status history, owner-only approve/reject at `/review`, approved-only publication | Set private `OWNER_EMAIL` and provision the owner with `pnpm owner:create`; no owner password is supplied by the project. |
| Content | 16 starter entries: 10 useful sites, three original motion studies, three linked interactive sites | Replace/extend with the owner's collection; provenance is in [CONTENT.md](./CONTENT.md). |
| Deployment | Standard Next.js build/start and local SQLite | No public deployment; production needs a stable secret, origin, and persistent writable storage. |

## 2. Product direction

A library connecting visual inspiration with reusable designs, shaders, and instructions that people and coding agents can take into their projects.

**Proposed journeys to refine by phase:**

- **Version one — Useful Sites:** open the useful-links section → scroll the compact list → hover or focus an entry → inspect its in-list expansion → visit the source through an agreed click action.
- **Version one — Inspiration:** open the separate inspiration section → browse design solutions, short animation clips, and interactive website examples → inspect or play a selected example → open the original source through an agreed action.
- **Later — human reuse:** explore a design preset, section, animation, or shader → inspect its rules/preview and usage → optionally customize supported values → take the resource → use it in a project.
- **Later — Codex reuse:** discover a suitable design resource or skill → read its rules, colors, usage, and dependencies → retrieve the required assets/instructions → integrate and verify the result.

Copying code can support later reuse, but design rules, template colors, sections, animations, downloadable assets, and skills may also be relevant. Their exact formats are still open.

## 3. Decisions that shape the product

| Decision | Options to discuss | Current status |
| --- | --- | --- |
| Release order | Two-section inspiration browser first; agent-focused page afterward | Local inspiration V1 implemented; agent phase remains later |
| Product pillars | Shaders/design presets; agent-friendly resources/skills; curated inspiration list | Confirmed long-term direction |
| Audience | People finding inspiration and ready designs, including users of coding agents | Confirmed; Codex is the first agent supported later |
| Differentiation | A useful connection between inspiration, reusable designs, and agent use | Direction confirmed; selection standards and unique advantages need refinement |
| Version-one structure | Useful Sites and Inspiration in separate tabs/sections | Implemented at `/` through section query state; refinable |
| Visual direction | Pleasant browsing; reference: designeer.xyz | Implemented dark neutral/violet direction and system type; open to refinement |
| Content coverage | Useful links separately from interesting designs/solutions, short animation videos, and interactive website examples | Confirmed; exact entry taxonomy and launch content remain open |
| Useful Sites interaction | Compact list with in-place expansion and explicit source links | Implemented for hover, focus, and touch/click |
| Inspiration presentation | Responsive visual collection and detail dialog | Implemented; layout remains refinable |
| Interactive examples | Explicit links to original websites | Implemented without live embeds |
| Source reference | Design posts from X/Twitter | Confirmed source; no automatic import/API/scraping selected |
| Collection and submissions | Starter entries plus authenticated links with owner approval | Implemented SQLite workflow: pending/approved/rejected |
| Sign-in | Google and email | Better Auth email/password implemented; Google configuration and provider verification remain |
| Version-one tools | Collection-scoped metadata search, category/type filters, Curated/Recently added sort, private account favorites and Saved-only filter | Implemented from the delegated selection; content taxonomy remains editable |
| Browsing access | Public browsing; sign-in to save or submit | Implemented default chosen during development, distinct from explicit sign-in requirements |
| Preset definition | Agent rules with built-in colors, reusable animations, headers, footers, and other sections | Direction confirmed; exact packaging remains open |
| Later deliverable | Design rules, templates, sections, CSS/React code, shader source, assets, or skills | Open exact formats; full website code is not the sole assumed format |
| Later agent access | Automatic search preference; structured data, skill files, API, MCP, or another mechanism | Search preference tentative; protocol and bootstrap unresolved |
| Content sourcing | Original presets, adapted resources, website links, authored descriptions, and preview imagery | Open; ownership, permission, and attribution must be recorded |
| Distribution and access | Public website, repository, package; free/paid access and licensing | Open |

## 4. Phase and launch scope

### Current work — local V1 validation and setup

- Validate the implemented browse/save/submit/review journeys and responsive behavior.
- Configure the private environment and let the owner bootstrap their own account.
- Supply the intended collection, review content rights, and choose production hosting/storage before deployment.

### Version one — inspiration browser

The first release has two core browsing areas:

- **Useful Sites:** a compact, scrollable list of useful websites with animated in-list expansion, previews/information, and source navigation.
- **Inspiration:** a responsive visual collection of designs/design solutions, short animation videos, and linked interactive website examples, with detail previews.

The owner supplies initial content; signed-in visitors submit links for owner approval before publication. Under the user's delegation, V1 includes metadata search within the active collection, category filters, an Inspiration-only content-type filter, Curated/Recently added sorting, private account-saved favorites, and a Saved-only filter/view inside each section. Include clear/reset controls, counts, empty/no-results states, and source/creator links. This preserves the original Useful Sites list without another main tab or layout toggle.

**Implemented access default:** public browsing, with sign-in to save or submit. Email/password is operational locally through Better Auth; Google is conditional on provider credentials. SQLite stores accounts, favorites, and submissions. Short inspiration videos are V1 content; reusable animation assets and agent instructions remain later-phase resources.

### Later phase — agent-focused design library

Provide the agent-focused page and Codex reuse of design rules, built-in color templates, animations, sections, and eventually shader resources. Automatic discovery is a tentative user preference, not a selected protocol. Rendering shaders, exporting resources, delivering skills, and validating Codex integration are outside version one.

Defer folders/multiple saved collections, color filters, popularity tracking/rankings, advanced search/recommendations, sponsors, and automatic X import. An effect-authoring editor, payments, AI generation, and package distribution remain separate scope decisions. No shader renderer, asset export, or agent preset/skill delivery exists in V1.

## 5. First-release behavior

1. A visitor understands the distinction between Useful Sites and Inspiration and can switch between them.
2. In Useful Sites, they scroll the compact list; hovering an entry expands it within the list and explains what its website is about.
3. Equivalent keyboard/touch interaction exposes the same information.
4. In Inspiration, they browse interesting designs/solutions, inspect an interactive website example, or play a short animation clip with usable controls.
5. Inspiration cards open a detail preview with source context; external examples have a Visit source action. Useful Sites provides explicit website links. Original local studies are labelled as such.
6. They search/filter the active collection, choose Curated or Recently added order, and sign in to save entries or browse their Saved-only selection within either section.

Both sections live at `/` with shareable query state; owner review lives at `/review`. Keyboard and touch equivalents accompany hover expansion. These implementation choices may be refined without changing the two-section product direction.

## 6. Requirements and acceptance criteria

The phase column separates V1 requirements from later work. The status table above identifies implementation and setup limits; these criteria remain the validation checklist, not a claim that every case has passed.

| ID | Phase | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| P-01 | Later | Browse reusable designs and shaders | Each included resource has a stable identifier, name, category, preview or example, and documented usage. |
| P-02 | V1 | Search and filter the active collection | Metadata search matches name, description, tags, and source/domain within the active section. Both sections support category filters; Inspiration also filters by content type. Search/filters compose with Saved-only mode, expose result counts, can be cleared, and provide no-results/empty states. |
| P-03 | Later | Inspect a reusable resource | The design, section, animation, or effect can be inspected beyond a thumbnail, with its rules and prerequisites. |
| P-04 | Later | Customize supported parameters | Included controls have labels, bounded values, visible values, and reset. Preview and retrieved output reflect the same configuration. |
| P-05 | Later | Take a matching resource | Approved output contains the required rules/assets, selected values, dependencies, and usage instructions. A clean consumer project can reproduce it. |
| P-06 | Later | Understand integration and reuse | Each resource states its format, runtime needs, limitations, and agreed license before adoption. |
| P-07 | V1; later reuse | Use the interface accessibly | Browsing and source navigation work with a keyboard and accessible names. Focus and interface text remain visible. Any later controls and transfer feedback meet the same baseline. |
| P-08 | V1; later reuse | Control motion | In-list expansion and interface transitions respect reduced-motion preferences and preserve information without animation. Short clips follow P-19. Later reusable animated assets provide a pause or static alternative; essential information does not depend on motion. |
| P-09 | Later | Recover from shader limitations | Unsupported or failed graphics show an understandable fallback. Offscreen previews stop unnecessary rendering; removed previews release graphics resources. |
| P-10 | Later | Trust reusable output | Resource rules/source and preset values are reviewed and reproducible. Any preview and retrieved implementation use the same authored configuration. |
| P-11 | V1 | Explore Useful Sites | The Useful Sites section presents a compact scrollable list of entries with a title, source URL, description, and approved preview content. Hovering expands the entry within the list with animation and useful information. Source navigation follows the agreed explicit click action. |
| P-12 | V1 | Access inspiration without hover | Keyboard focus and touch/click reveal equivalent information. Expanded content does not trap navigation or obscure its active target. |
| P-13 | Later | Let Codex discover and retrieve resources | The selected access mechanism exposes stable IDs, descriptions, formats, design rules, dependencies, provenance, and licensing. Codex can retrieve and integrate a representative resource using documented steps. Automatic search, protocol, and bootstrap need separate definition. |
| P-14 | Later | Reuse agent design presets and skills | A preset can describe design rules and built-in colors, and identify its reusable sections or animations. Codex can retrieve complete instructions and companion assets in the selected format. Skill packaging and delivery remain open. |
| P-15 | V1 | Trust both content collections | Entries show clear original-source and creator links where recorded, identify their content type, and use accurate descriptions. Preview media has recorded provenance, attribution, and approved use. Missing media fails gracefully. A curation/maintenance workflow is recorded. |
| P-16 | V1 | Save private account favorites | Signed-in users can save/remove published entries and retrieve their saved selection in later sessions. Favorites are private to their account and stored in SQLite. Each section has Saved filtering with clear empty/sign-in states, without another main tab. |
| P-17 | V1 | Switch between core browsing sections | A visitor can reach Useful Sites and Inspiration through clearly labelled navigation with a visible active state and keyboard/touch access. Each section displays its intended collection; useful-site entries and design/motion examples remain distinguishable. Names and routes are provisional. |
| P-18 | V1 | Browse design and motion inspiration | Inspiration supports designs/design solutions, short animation clips, and interactive website examples as distinct content types in a responsive visual collection, with detail preview/source information. |
| P-19 | V1 | Play short clips accessibly | Clips provide accessible play/pause controls and sound control when audio exists, without unexpected audio. Playback pauses when offscreen or the page is hidden. Reduced motion uses a still/poster with deliberate playback; loading and playback failures preserve source access. |
| P-20 | V1 | Inspect interactive website examples | Entries identify the original website and offer an explicit source action from the preview. V1 links to external experiences rather than live-embedding them. |
| P-21 | V1 | Submit and approve a link | Signed-in visitors submit a URL, title, description, section, and category. Only the owner can approve publication; unapproved submissions are absent from public collections. Feedback distinguishes receipt from publication. Members can see their own pending/approved/rejected status; the owner can approve or reject. |
| P-22 | V1 | Sort a collection | Both sections support Curated and Recently added ordering. The selected order applies consistently with search, filters, and Saved-only mode. Curated order is authored; popularity tracking is not required. |
| P-23 | V1 | Sign in with Google or email | Email/password signup and sign-in support save/submit journeys through real Better Auth sessions. Google is enabled only with configured credentials and needs provider verification. Errors are understandable; no email delivery is simulated. |

## 7. Visual direction — reference supplied, details open

- **Reference:** [designeer.xyz](https://designeer.xyz), supplied by the user. Its adjacent-preview layout is not the selected direction for Useful Sites.
- **Confirmed interaction direction:** Useful Sites uses the original compact scrollable list, with entries expanding within the list on hover and showing useful previews/information. Inspiration is a separate tab/section for design and motion examples.
- **Quality goal:** beautiful styling and motion that make the site pleasant to look at, enjoyable to browse, and easy to use.
- **Theme and palette:** dark neutral OKLCH surfaces with restrained violet selection/focus accents; content provides color variety.
- **Typography and density:** compact system-sans interface with responsive controls and collections.
- **Motion:** separate the motion of the interface from animation inside resources.
- **Version-one previews:** original local MP4s/posters and illustrated covers for linked sites. Illustrated covers are not presented as screenshots. External examples open their source rather than a live embed.
- **Inspiration layout:** responsive visual grid with detail dialogs; Useful Sites preserves its expanding list.
- **Content tone and naming:** open.

## 8. Validation

Version-one validation should cover the inspiration journey:

- Can a visitor distinguish the two sections, switch between them, and find a relevant source?
- Is the Useful Sites list easy to scroll and inspect with pointer, keyboard, and touch? Does in-list expansion help without disrupting browsing?
- Can they inspect design solutions, control short clips, and understand how to open interactive website examples?
- Is the presentation pleasant and enjoyable while controls remain clear?
- Are descriptions accurate, sources easy to open, and missing media states understandable?
- Do scoped search, filters, sorting, and private favorites help visitors find and return to useful examples?

Record browse-to-source task completion, time to a relevant source, section/navigation mistakes, points of confusion, user feedback on browsing enjoyment, broken links, and media/playback failures. Set numerical targets after defining content and a baseline. Production analytics and associated data collection remain separate decisions.

Later-phase validation will check Codex discovery/retrieval/integration, faithful design rules and colors, exported output, shader fallbacks, and resource cleanup. Those checks do not block version one.

## 9. Version-one release exit criteria

- The two-section structure and selected browsing tools are represented; display names, Inspiration layout, preview media, and click behavior are agreed.
- Included V1 requirements pass their acceptance criteria; candidate features have explicit include/defer decisions.
- Curated entries have valid links, accurate descriptions, approved preview content, and recorded sourcing/attribution.
- Both sections work at agreed responsive sizes with pointer, keyboard, touch, and reduced motion.
- Clip controls, offscreen/hidden playback handling, and missing/failed media states are verified; content maintenance is documented.
- Interactive examples have an agreed source/embedding behavior with usable source access.
- Link submission requires sign-in, gives understandable feedback, and keeps unapproved entries out of public collections. Only the owner can approve publication; these boundaries are verified.
- Google/email sign-in, account-private favorites, Saved-only filters, and combined search/filter/sort behavior are verified.
- The version-one access model and required content rights are resolved.
- The chosen deployment passes the project build and required quality checks.
- Remaining limitations are documented. Agent delivery, Codex integration, shader rendering, exports, and skills are deferred rather than first-release gates.

## 10. Revision notes

| Version | Change |
| --- | --- |
| 0.1 | Initial discovery draft based on the brief; product choices and launch scope remain open. |
| 0.2 | Recorded the confirmed three pillars and audience; deferred visual direction and limited current work to setup/documentation. Agent protocol, launch priority, formats, licensing, and sourcing remain open. |
| 0.3 | 2026-10-28: confirmed inspiration browser as V1, agent page afterward, Codex first, and presets as design rules/colors plus reusable sections/animations. Recorded tentative automatic search and designeer.xyz reference without selecting a protocol or final design. |
| 0.4 | 2026-10-29: confirmed separate Useful Sites and Inspiration sections, original in-list expansion, design/solution/clip/interactive-example coverage, and enjoyable visual/motion quality. Names/routes, Inspiration layout, source phrase “design form X,” media sourcing, and browsing tools remain open. |
| 0.5 | 2026-10-29: confirmed X/Twitter design posts, owner-provided initial collection, and V1 visitor link submission. Submission fields, review/publication, guest/login, storage, and media display remain open. |
| 0.6 | 2026-10-29: confirmed sign-in for visitor submissions and owner approval before publication. Login methods, browsing access, storage, and detailed status/rejection UX remain open. |
| 0.7 | 2026-10-29: user confirmed Google/email sign-in and delegated V1 feature selection. Selected scoped search, category/type filters, Curated/Recently added sorting, private account favorites, Saved-only mode, clear states, and source/creator links. Public browsing is a proposed default; email flow and implementation remain open. |
| 0.8 | 2026-10-29: documented implemented local V1, Better Auth email/password, SQLite state, owner provisioning/review, real starter media, and remaining Google/deployment/content setup. Requirements and release verification remain distinct from implementation. |
