# ui-ux-library — Product requirements

Version: 0.2 · Status: discovery draft · Updated: 2026-10-27

This document separates the confirmed product direction from proposed implementation requirements. The current phase is project setup and documentation; product screens, demos, and the final visual design are outside this phase. See [DISCOVERY.md](./DISCOVERY.md) for the decision record and [TRD.md](./TRD.md) for the technical design.

## 1. What is confirmed

- Working project name: **ui-ux-library**.
- The application will use **Next.js**.
- The product will include **shaders and reusable design presets**; gradients were part of the initial brief.
- It serves people finding inspiration and ready designs, including people building with coding agents. **Coding agents must be able to use the library's resources and skills.**
- It will curate useful inspiration websites in **one compact, scrollable list**. Hovering a website should animate an enlarged preview that explains what the site is about.
- Users should be able to take useful resources from the library easily. The exact asset formats and transfer mechanisms are undecided.
- **For now, set up the project.** The user will describe the visual direction later.

The three confirmed pillars are reusable visual resources, agent-friendly reuse, and curated inspiration. Their launch priority, depth, and content are undecided. No account system, paid tier, AI generation capability, or backend is required by the current brief.

## 2. Product direction

A library connecting visual inspiration with reusable designs, shaders, and instructions that people and coding agents can take into their projects.

**Proposed journeys to refine:**

- **Human reuse:** explore a design or shader → inspect its preview and usage → optionally customize supported values → take the resource → use it in a project.
- **Agent reuse:** discover a suitable resource or skill → read structured usage and dependencies → retrieve the required assets/instructions → integrate and verify the result.
- **Inspiration:** scroll the compact website list → hover or focus an entry → inspect its animated enlarged preview and description → visit the source website.

Copying code can support these journeys, but it does not define the entire product. Downloadable assets, design instructions, and skills may also be relevant. Their format is still open.

## 3. Decisions that shape the product

| Decision | Options to discuss | Current status |
| --- | --- | --- |
| Product pillars | Shaders/design presets; agent-friendly resources/skills; curated inspiration list | Confirmed; first-release priority and depth remain open |
| Audience | People finding inspiration and ready designs, including users of coding agents; agents as consumers | Confirmed; specific personas and supported agents remain open |
| Differentiation | A useful connection between inspiration, reusable designs, and agent use | Direction confirmed; selection standards and unique advantages need refinement |
| Visual direction | References, typography, palette, density, and detailed motion | Deferred by the user until after setup |
| Deliverable | CSS, React/Next.js components, shader source, design assets, instructions, or skills | Open |
| Agent access | Structured manifests/static JSON, downloadable skill files, MCP, or another mechanism | Open; no protocol selected |
| Content sourcing | Original presets, adapted resources, website links, authored descriptions, and preview imagery | Open; ownership, permission, and attribution must be recorded |
| Distribution and access | Public website, repository, package; free/paid access and licensing | Open |

## 4. Phase and launch scope

### Current phase — confirmed

- Establish a maintainable Next.js project structure and a neutral placeholder home page.
- Record product direction, open decisions, and technical boundaries in the PRD, discovery notes, and TRD.
- Leave concrete product UI, shaders, demo pages, and final styling for a later implementation phase.

### Launch scope — still to decide

The eventual product includes all three pillars. Choose the first complete path before implementation: a small shader/design collection with agent-readable reuse, the inspiration list first, or a thin end-to-end release across all three. Collection size, preview depth, customization, and supported export formats are pending.

An editor for authoring effects from scratch, accounts, saved collections, community submissions, payments, AI generation, and package distribution are separate scope decisions. They are not implied by making the library useful to coding agents.

## 5. Proposed first-release behavior

1. A visitor understands where to find shaders/design presets, agent resources, and inspiration websites.
2. They inspect a selected resource, see a useful preview, and learn what they can take and how to use it.
3. They copy or retrieve the approved output format; a coding agent can obtain equivalent resource instructions and dependencies through the selected access mechanism.
4. Where customization is included, the retrieved result matches the selected values and can return to the authored preset.
5. In the inspiration list, scrolling reveals useful sites; hovering an entry expands its preview with animation and shows its description. Opening a source site is an explicit action.
6. The selected design or shader can be reproduced in a clean consumer project using its stated prerequisites.

The navigation, number of screens, expansion geometry, and final animation are deferred design decisions. Keyboard and touch equivalents are proposed below so the inspiration interaction does not depend on hover alone.

## 6. Proposed requirements and acceptance criteria

All requirements below are **proposed for scope confirmation**. Their acceptance criteria describe how to verify an approved implementation; they do not claim that it exists today.

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| P-01 | Browse an authored resource collection | Each launch shader or design preset has a stable identifier, name, category, and preview. A visitor can inspect its usage. Empty and unavailable states are understandable. |
| P-02 | Narrow the collection | A visitor can filter by the agreed launch categories and clear the filter. Search is included only if the collection warrants it. |
| P-03 | Inspect a usable preview | The effect can be inspected beyond its gallery thumbnail. Preview controls and content stay usable at the agreed mobile and desktop sizes. |
| P-04 | Customize supported parameters | Controls have labels, bounded values, and visible current values. Changes update the preview, and reset restores the authored preset. The supported controls are explicit for each resource. |
| P-05 | Take a matching resource | The agreed copy/download output includes the required assets, selected parameter values, dependencies, and usage instructions. Transfer success or failure is communicated. A clean consumer project reproduces the selected resource using those instructions. |
| P-06 | Understand integration needs | A resource states its output format, runtime requirements, relevant browser limitations, and the agreed license before a user adopts it. Unresolved licensing prevents a public release of affected resources. |
| P-07 | Use the interface accessibly | Browsing, controls, reset, and copy work with a keyboard and accessible names. Focus is visible; interface text remains readable against effects; feedback is available to assistive technology. |
| P-08 | Control animation | Animated resources respect reduced-motion preferences and provide a pause or static alternative. Essential information does not depend on animation. Effects are reviewed for distracting flashes. |
| P-09 | Recover from rendering limitations | A failed or unsupported shader shows an explanatory fallback while navigation and source access remain usable. Shader previews stop unnecessary rendering when hidden and release graphics resources when removed. |
| P-10 | Trust the collection | Each resource has reviewed source and a reproducible preset. Previews and copied implementations derive from the same parameter values; visible metadata accurately describes the resource. |
| P-11 | Explore curated inspiration websites | A compact list scrolls through authored website entries. Each has a title, source URL, description, and approved preview content. Hovering an entry animates an enlarged preview and reveals what the site is about; following its source link requires an explicit action. Exact layout and animation await visual direction. |
| P-12 | Access inspiration without hover | Keyboard focus and a touch action reveal equivalent preview information. Focus remains visible; expanded content does not trap navigation. Reduced motion preserves the information with a restrained or static transition. This interaction is proposed for accessibility. |
| P-13 | Let coding agents discover and retrieve resources | The chosen mechanism exposes stable resource identifiers, descriptions, supported output formats, usage instructions, dependencies, provenance, and licensing. A representative supported agent can find and integrate a resource without undocumented steps. Protocol and supported agents remain open. |
| P-14 | Reuse design skills and instructions | For any launch skill or instruction asset, a user or supported agent can retrieve its complete documented contents and required companion assets. The package's purpose, compatibility, and license are explicit. Skill format, installation, and delivery remain open. |

## 7. Visual direction — deferred

- The user will supply visual direction later. No visual answers are needed for the setup phase.
- **Confirmed interaction direction:** a compact scrollable inspiration list with beautifully animated expansion on hover, showing what each website is about.
- **Desired impression and references:** pending the later design discussion.
- **Theme and palette:** open; gradients in the content do not determine the interface theme.
- **Typography and density:** open.
- **Motion:** separate the motion of the interface from animation inside resources.
- **Preview composition:** decide whether effects appear as full surfaces, small swatches, or realistic usage examples.
- **Content tone and naming:** open.

## 8. Validation

After the launch scope is agreed, validation should cover the selected human and agent journeys:

- Can they identify a useful resource and explain what the product offers?
- Can they find and take a useful shader, design preset, or skill without assistance?
- Can a supported coding agent discover, retrieve, and integrate a resource from its documented access mechanism?
- Does retrieved output reproduce the chosen appearance in a clean project?
- Does the inspiration list make it easy to inspect and visit relevant websites with pointer, keyboard, and touch input?
- Which integration details or controls are missing?
- Do keyboard, reduced-motion, mobile, and unsupported-renderer experiences remain usable?

Record task completion, time to a working integration, agent retrieval/integration failures, points of confusion, rendering failures, and transfer failures during the agreed validation method. Set numerical targets after defining the launch scope and baseline. Production analytics and any associated data collection are separate decisions.

## 9. Release exit criteria

- The primary job, audience, visual direction, and launch scope are explicitly agreed.
- Included requirements have passed their acceptance criteria; deferred items are recorded.
- All launch resources have complete metadata, reviewed provenance and licensing, accurate previews, and verified output.
- Included inspiration entries have valid source links, accurate descriptions, and approved preview content.
- The selected agent access path is documented and verified with a representative supported agent.
- The core journey works at the agreed responsive sizes and input methods.
- Motion preferences, shader fallbacks, and resource cleanup have been checked on the agreed browser/device matrix.
- The chosen deployment passes the project build and required quality checks.
- Remaining limitations and usage prerequisites are documented.

## 10. Revision notes

| Version | Change |
| --- | --- |
| 0.1 | Initial discovery draft based on the brief; product choices and launch scope remain open. |
| 0.2 | Recorded the confirmed three pillars and audience; deferred visual direction and limited current work to setup/documentation. Agent protocol, launch priority, formats, licensing, and sourcing remain open. |
