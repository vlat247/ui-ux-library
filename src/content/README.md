# Authored content

`entries.ts` contains the V1 starter collection for Inspiration and Useful Sites,
using the contract in `src/features/discovery/types.ts`. See `docs/CONTENT.md` for
source verification and original preview provenance. Approved submissions are
added by the server store; pending and rejected submissions stay private.

`library.ts` reserves serializable metadata for future gradients, shaders, and
design presets. That collection intentionally starts empty.

Keep runtime components, browser APIs, and graphics libraries out of these
modules. Reusable source belongs in `src/registry/`; UI for inspecting it belongs
in `src/components/previews/` or the relevant feature folder.

Before publishing reusable presets, extend their initial types with agreed export formats,
dependencies, source references, license/provenance, and preview media. A content
entry is not publishable just because it satisfies the initial TypeScript type.

These records can later feed human-facing pages and machine-readable manifests.
An API, installable skill, package registry, and MCP service have not been chosen.
