# Local V1 verification

Checked on 2026-10-29 using Node.js 24 and pnpm 10.29.3.

- ESLint with zero warnings and Next.js route generation/TypeScript checking pass.
- All 14 discovery/backend tests pass against isolated temporary SQLite storage.
- The production build passes. Tailwind uses the documented PostCSS integration;
  live CSS changes were verified after replacing the loader that served stale styles.
- Browser smoke checks covered search/reset, section switching, expanded resource
  context, collapse focus restoration, native video playback, and paused previews
  after closing a detail dialog.
- A disposable browser database verified real member email sign-in, save continuation,
  saved state after reload, submission receipt and pending status, member/guest review
  gates, owner approval, and appearance of approved content in the public collection.
- Layouts were visually checked at 1280px, and in 390px/768px same-origin frames.
  Mobile expansion and accessible naming of the icon-only Saved control were checked.
- The 4-second local video decoded and played without a media error. Original media
  generation/provenance is documented separately in CONTENT.md.

Temporary QA pages and fixtures are not application content. The project database
contains no QA users or submissions. The real owner password has not been created.

Google's external OAuth exchange remains untested without provider credentials.
Reduced-motion/offscreen/hidden-page behavior has implementation coverage but still
needs a broader manual accessibility/device pass before public release. Production
hosting, persistent storage, account email delivery, and the owner's launch collection
are not configured by these local checks.
