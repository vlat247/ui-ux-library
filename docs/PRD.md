# ui-ux-library — Product requirements

Version: 0.3 · Status: discovery draft · Updated: 2026-10-28

This document separates confirmed direction from proposed requirements. Version one will be the inspiration browser; the agent-focused page follows later. Current work is discovery and specification; product UI implementation follows. See [DISCOVERY.md](./DISCOVERY.md) for the decision record and [TRD.md](./TRD.md) for the technical design.

## 1. What is confirmed

- Working project name: **ui-ux-library**.
- The application will use **Next.js**.
- The product will include **shaders and reusable design presets**; gradients were part of the initial brief.
- Design presets mean **rules for agents with built-in colors**, similar to design templates, plus reusable animations, headers, footers, and other sections. Presets are not limited to complete website code.
- It serves people finding inspiration and ready designs, including people building with coding agents. **Codex is the first supported agent** for the later agent-focused experience.
- It will curate useful inspiration websites in **one compact, scrollable list**. Hovering a website should animate an enlarged preview that explains what the site is about.
- **The inspiration browser is version one. The agent-focused page comes afterward.** Shader rendering, asset exports, skill delivery, and Codex integration are later-phase features.
- Users should be able to take useful resources from the library easily. The exact asset formats and transfer mechanisms are undecided.
- The user tentatively prefers agents to **search the library automatically**. Discovery protocol and how an agent first learns where and how to search are unresolved.
- The user supplied [designeer.xyz](https://designeer.xyz) as a reference and wants something similar. Which visual, content, or interaction aspects to use remains open; the reference does not approve a copied design.

The long-term pillars remain reusable visual resources, agent-friendly reuse, and curated inspiration. Launch priority is now decided; exact version-one content and behavior are still being clarified. No account system, paid tier, AI generation capability, or backend is required by the current brief.

## 2. Product direction

A library connecting visual inspiration with reusable designs, shaders, and instructions that people and coding agents can take into their projects.

**Proposed journeys to refine by phase:**

- **Version one — inspiration:** scroll the compact curated list → hover or focus an entry → inspect its enlarged preview and description → visit the source website through an agreed click action.
- **Later — human reuse:** explore a design preset, section, animation, or shader → inspect its rules/preview and usage → optionally customize supported values → take the resource → use it in a project.
- **Later — Codex reuse:** discover a suitable design resource or skill → read its rules, colors, usage, and dependencies → retrieve the required assets/instructions → integrate and verify the result.

Copying code can support later reuse, but design rules, template colors, sections, animations, downloadable assets, and skills may also be relevant. Their exact formats are still open.

## 3. Decisions that shape the product

| Decision | Options to discuss | Current status |
| --- | --- | --- |
| Release order | Inspiration browser first; agent-focused page afterward | Confirmed; detailed version-one scope remains open |
| Product pillars | Shaders/design presets; agent-friendly resources/skills; curated inspiration list | Confirmed long-term direction |
| Audience | People finding inspiration and ready designs, including users of coding agents | Confirmed; Codex is the first agent supported later |
| Differentiation | A useful connection between inspiration, reusable designs, and agent use | Direction confirmed; selection standards and unique advantages need refinement |
| Visual direction | Reference: designeer.xyz; typography, palette, density, and detailed motion | Reference confirmed; desired aspects and original visual treatment remain open |
| Inspiration coverage | Websites only, or websites alongside broader design resources | Open; useful websites are confirmed, broader inclusion is not |
| Inspiration interaction | Enlarged hover preview with description | Direction confirmed; preview media, placement, and click behavior remain open |
| Version-one tools | Search, categories/filters, favorites, and collection persistence | Open; none is implied by the release priority |
| Preset definition | Agent rules with built-in colors, reusable animations, headers, footers, and other sections | Direction confirmed; exact packaging remains open |
| Later deliverable | Design rules, templates, sections, CSS/React code, shader source, assets, or skills | Open exact formats; full website code is not the sole assumed format |
| Later agent access | Automatic search preference; structured data, skill files, API, MCP, or another mechanism | Search preference tentative; protocol and bootstrap unresolved |
| Content sourcing | Original presets, adapted resources, website links, authored descriptions, and preview imagery | Open; ownership, permission, and attribution must be recorded |
| Distribution and access | Public website, repository, package; free/paid access and licensing | Open |

## 4. Phase and launch scope

### Current work — discovery and documentation

- Use the existing Next.js setup and neutral placeholder as the foundation.
- Record the newly confirmed priority, preset definition, first agent, reference, and open decisions.
- Clarify version-one content and interaction before implementing product screens or final styling.

### Version one — inspiration browser

The first release focuses on the compact curated inspiration list, scrolling, expanding previews, site descriptions, and source navigation. The exact resource coverage, preview content, click behavior, search/filters, favorites, content sourcing, access model, and final presentation remain open.

### Later phase — agent-focused design library

Provide the agent-focused page and Codex reuse of design rules, built-in color templates, animations, sections, and eventually shader resources. Automatic discovery is a tentative user preference, not a selected protocol. Rendering shaders, exporting resources, delivering skills, and validating Codex integration are outside version one.

An editor for authoring effects from scratch, accounts, community submissions, payments, AI generation, and package distribution remain separate scope decisions. Favorites and persistence also require explicit version-one scope confirmation.

## 5. Proposed first-release behavior

1. A visitor understands that the first release helps them explore curated inspiration.
2. They scroll the compact list and identify entries worth inspecting.
3. Hovering an entry animates a larger preview and explains what its website is about.
4. Equivalent keyboard/touch interaction exposes the preview information.
5. They follow the source through the agreed explicit click action. Whether an entry first opens details or directly opens the website remains a decision.
6. If search, filters, or favorites are included after clarification, their behavior supports the same browse-to-source journey.

The navigation, number of screens, expansion geometry, and final animation are deferred design decisions. Keyboard and touch equivalents are proposed below so the inspiration interaction does not depend on hover alone.

## 6. Proposed requirements and acceptance criteria

All criteria below are **proposed for scope confirmation**. The phase column distinguishes first-release requirements from later capabilities; nothing here claims implementation. Version-one candidates need an explicit inclusion decision.

| ID | Phase | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| P-01 | Later | Browse reusable designs and shaders | Each included resource has a stable identifier, name, category, preview or example, and documented usage. |
| P-02 | V1 candidate | Search or filter inspiration | If included, the agreed search/filter controls return matching entries, can be cleared, and show an understandable no-results state. Fields and categories remain open. |
| P-03 | Later | Inspect a reusable resource | The design, section, animation, or effect can be inspected beyond a thumbnail, with its rules and prerequisites. |
| P-04 | Later | Customize supported parameters | Included controls have labels, bounded values, visible values, and reset. Preview and retrieved output reflect the same configuration. |
| P-05 | Later | Take a matching resource | Approved output contains the required rules/assets, selected values, dependencies, and usage instructions. A clean consumer project can reproduce it. |
| P-06 | Later | Understand integration and reuse | Each resource states its format, runtime needs, limitations, and agreed license before adoption. |
| P-07 | V1; later reuse | Use the interface accessibly | Browsing and source navigation work with a keyboard and accessible names. Focus and interface text remain visible. Any later controls and transfer feedback meet the same baseline. |
| P-08 | V1; later reuse | Control motion | Preview expansion respects reduced-motion preferences and preserves information without animation. Later animated assets provide a pause or static alternative; essential information does not depend on motion. |
| P-09 | Later | Recover from shader limitations | Unsupported or failed graphics show an understandable fallback. Offscreen previews stop unnecessary rendering; removed previews release graphics resources. |
| P-10 | Later | Trust reusable output | Resource rules/source and preset values are reviewed and reproducible. Any preview and retrieved implementation use the same authored configuration. |
| P-11 | V1 | Explore curated inspiration websites | A compact list scrolls through entries with a title, source URL, description, and approved preview content. Hovering animates an enlarged preview and reveals what the site is about. Source navigation follows the agreed explicit click action. |
| P-12 | V1 | Access inspiration without hover | Keyboard focus and an agreed touch action reveal equivalent information. Expanded content does not trap navigation or obscure its active target. This is a proposed accessibility requirement. |
| P-13 | Later | Let Codex discover and retrieve resources | The selected access mechanism exposes stable IDs, descriptions, formats, design rules, dependencies, provenance, and licensing. Codex can retrieve and integrate a representative resource using documented steps. Automatic search, protocol, and bootstrap need separate definition. |
| P-14 | Later | Reuse agent design presets and skills | A preset can describe design rules and built-in colors, and identify its reusable sections or animations. Codex can retrieve complete instructions and companion assets in the selected format. Skill packaging and delivery remain open. |
| P-15 | V1 | Trust inspiration entries | Included links work; descriptions accurately identify the source; preview imagery has recorded provenance and approved use. Missing previews fail gracefully. A maintenance owner/workflow is recorded. |
| P-16 | V1 candidate | Save favorites | If included, users can save/remove entries and understand where the selection persists. Storage, cross-device behavior, and whether an account is needed remain open; favorites are not yet committed scope. |

## 7. Visual direction — reference supplied, details open

- **Reference:** [designeer.xyz](https://designeer.xyz), supplied by the user as something similar to the intended product. Desired aspects still need clarification; no claims about its contents or features are adopted here.
- **Confirmed interaction direction:** a compact scrollable inspiration list with beautifully animated expansion on hover, showing what each website is about.
- **Reference intent:** clarify whether similarity means layout, compact browsing, resource coverage, previews, motion, or overall visual mood.
- **Theme and palette:** open; gradients in the content do not determine the interface theme.
- **Typography and density:** open.
- **Motion:** separate the motion of the interface from animation inside resources.
- **Version-one preview composition:** screenshot, video, authored image, or another format; source, placement, timing, and touch behavior remain open.
- **Content tone and naming:** open.

## 8. Validation

Version-one validation should cover the inspiration journey:

- Can a visitor identify the collection's purpose and find a relevant source?
- Is the compact list easy to scroll, inspect, and navigate with pointer, keyboard, and touch?
- Does preview expansion make the site easier to understand without disrupting browsing?
- Are descriptions accurate, sources easy to open, and missing preview states understandable?
- If included, do search, filters, and favorites help complete the same task?

Record browse-to-source task completion, time to a relevant source, navigation mistakes, points of confusion, broken links, and preview failures. Set numerical targets after defining content and a baseline. Production analytics and associated data collection remain separate decisions.

Later-phase validation will check Codex discovery/retrieval/integration, faithful design rules and colors, exported output, shader fallbacks, and resource cleanup. Those checks do not block version one.

## 9. Version-one release exit criteria

- Website/resource coverage, reference intent, preview media, click behavior, and included browsing tools are agreed.
- Included V1 requirements pass their acceptance criteria; candidate features have explicit include/defer decisions.
- Curated entries have valid links, accurate descriptions, approved preview content, and recorded sourcing/attribution.
- The inspiration journey works at agreed responsive sizes with pointer, keyboard, touch, and reduced motion.
- Missing/failed previews and empty states remain usable; content maintenance is documented.
- The version-one access model and required content rights are resolved.
- The chosen deployment passes the project build and required quality checks.
- Remaining limitations are documented. Agent delivery, Codex integration, shader rendering, exports, and skills are deferred rather than first-release gates.

## 10. Revision notes

| Version | Change |
| --- | --- |
| 0.1 | Initial discovery draft based on the brief; product choices and launch scope remain open. |
| 0.2 | Recorded the confirmed three pillars and audience; deferred visual direction and limited current work to setup/documentation. Agent protocol, launch priority, formats, licensing, and sourcing remain open. |
| 0.3 | 2026-10-28: confirmed inspiration browser as V1, agent page afterward, Codex first, and presets as design rules/colors plus reusable sections/animations. Recorded tentative automatic search and designeer.xyz reference without selecting a protocol or final design. |
