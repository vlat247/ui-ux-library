# Starter content and media

Updated: 2026-10-29

The owner has not supplied the initial collection yet. The 16 entries in `src/content/entries.ts` are editable starter suggestions: 10 Useful Sites, three original motion studies, and three external interactive-website examples. They are not a copy of Designeer's collection, visitor submissions, or an implied owner endorsement. There are no invented X/Twitter posts, creator identities, saves, views, or popularity counts.

## Provenance

Descriptions are newly written summaries of the primary sources below. External sites are linked, not embedded or downloaded. Their abstract preview artwork is original UI art, not a screenshot, logo, captured video, or reproduction of the linked website. Source names and optional creator fields identify the linked publisher; they do not imply a partnership. Use permission and attribution must be reviewed before adding third-party images, videos, or posts.

`publishedAt` records editorial inclusion in this starter on 2026-10-29, not a claim about an external site's publication date. IDs/slugs and per-section `curatedOrder` are stable; change the entries as the owner supplies the real collection. Categories are editorial labels for this library.

## Primary-source checks

Checked on 2026-10-29. A reachable source and accurate description do not guarantee its future uptime or test every interactive feature.

| Entry | Primary source | Basis for the description |
| --- | --- | --- |
| HOVERSTAT.ES | [hoverstat.es](https://www.hoverstat.es/) | Editorial website selections with commentary about interactions and design details. |
| Minimal Gallery | [minimal.gallery](https://minimal.gallery/) | Curated website gallery, templates, and creative tools. |
| Siteinspire | [siteinspire.com](https://www.siteinspire.com/) | Design showcase with style/type/subject/platform categories and designer/studio attribution. |
| Mobbin | [mobbin.com](https://mobbin.com/) | Reference library of shipped mobile/web screens and product design examples. |
| Codrops | [Codrops](https://tympanus.net/codrops/) | Front-end tutorials, creative demos, and design/development case studies. |
| Google Fonts | [Font browser](https://fonts.google.com/), [official overview](https://developers.google.com/fonts) | Font library and web integration; the font browser is JavaScript-driven. No font files are bundled here. |
| Typewolf | [typewolf.com](https://www.typewolf.com/) | Identified fonts from website examples, font lists, and typography resources. |
| Easing Functions | [easings.net](https://easings.net/) | Easing previews and CSS/mathematical references; the page credits Andrey Sitnik and Ivan Solovev. |
| cubic-bezier.com | [cubic-bezier.com](https://cubic-bezier.com/) | Curve editing, preview/compare, copying values; the page credits Lea Verou. |
| Learn Responsive Design | [web.dev course](https://web.dev/learn/design/) | Course sections covering layout, type, images, accessibility, and interaction. |
| Lusion | [lusion.co](https://lusion.co/) | Studio describes its design, motion, 3D, and interactive-web work. |
| Bruno Simon | [bruno-simon.com](https://bruno-simon.com/) | Portfolio introduces a driveable 3D world and documents its controls and creator. |
| Active Theory | [activetheory.net](https://activetheory.net/) | Primary site's title identifies creative digital experiences; text access returns a JavaScript-required shell. Its full interactive presentation was not tested. |

Godly redirected to a different domain during this check; Awwwards timed out. Neither is seeded as a verified entry. The replacements are Typewolf and cubic-bezier.com.

## Original motion studies

`scripts/generate-previews.py` authors three procedural loops for this project: **Chromatic ribbons**, **Orbital study**, and **Type in motion**. The MP4s and their JPEG posters live in `public/previews/`. They are original studies rather than recordings of an external artist's website or a claimed X post. Their creator is `ui-ux-library`, and their source link returns to the local Inspiration collection.

Verified delivery: each clip is 720 × 480, 24 fps, 96 frames, four seconds, H.264/yuv420p with fast-start metadata and no audio. Encoded files are about 90 KB (ribbons), 84 KB (orbit), and 162 KB (type); matching JPEG posters are 28–42 KB. All clips decode successfully. Posters and quarter-cycle frames were visually inspected, and loop-boundary motion was checked against an ordinary frame step. A full regeneration reproduced all six files byte-for-byte (matching SHA-256 hashes).

Posters provide a still fallback for reduced motion and paused/loading states. The deterministic generator records its dependencies and invocation; keep it with the media so edits remain reproducible. Font choice for the typography study is a local system-font dependency, not a bundled web font.

Playback, accessible controls, offscreen pausing, and attribution rendering belong to the app; the media files do not implement them. No external page scraping, X API, media ingestion, or submission publication is performed by this seed.
