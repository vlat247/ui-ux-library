# Authored content

`library.ts` holds serializable metadata for gradients, shaders, and design
presets. `inspiration.ts` holds curated website descriptions and links. Both
collections intentionally start empty while launch content is being defined.

Keep runtime components, browser APIs, and graphics libraries out of these
modules. Reusable source belongs in `src/registry/`; UI for inspecting it belongs
in `src/components/previews/` or the relevant feature folder.

Before publication, extend the initial types with the agreed export formats,
dependencies, source references, license/provenance, and preview media. A content
entry is not publishable just because it satisfies the initial TypeScript type.

These records can later feed human-facing pages and machine-readable manifests.
An API, installable skill, package registry, and MCP service have not been chosen.
