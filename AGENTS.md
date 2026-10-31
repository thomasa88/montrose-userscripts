# AGENTS.md

## What this repo is

Static browser workarounds for `app.montrose.io`. There is no app, package
manager, build step, or test suite; do not add a toolchain for a one-file
change.

## Files

- `montrose-small-screen.user.js` — primary userscript. Keep
  `@run-at document-start`.
- `montrose-small-screen.bookmarklet.txt` — canonical bookmarklet URL.
- `montrose-small-screen.bookmarklet.html` — drag-to-bookmarks installer. Its
  `a.bookmarklet` `href` is an HTML-escaped copy of the `.txt` file.
- `README.md` — user-facing install and usage docs.

When changing bookmarklet behavior, update the `.txt` and regenerate the HTML
`href` (escape `&`, `<`, `>`, `"`, `'`). Do not hand-edit the escaped URL; after
decoding, it must match the `.txt` exactly.

## The bypass (do not regress it)

The gate is client-side only: desktop styling is gated by
`@media (min-width: 1024px)`, and JS breakpoints use `window.innerWidth`. The
"use the app" screen is still rendered but CSS-hidden at desktop width.

The fix is forcing `<meta name="viewport" content="width=1024">`, the site's
desktop breakpoint, so CSS and JS both see a desktop viewport. Hiding the
overlay alone is not enough: the app stays in its mobile layout. User-agent
spoofing is unnecessary.

The viewport meta is server-rendered and may be parsed after
`document-start`. Keep the `MutationObserver` that pins it rather than patching
once, so later head changes cannot undo the fix. The last-resort fallback finds
the blocking layer via App Store/Google Play links; do not match Stylex classes
(`x...`) or Swedish UI text, both are build/localization-specific.

## Verification

There are no automated checks. `/login` does not render the mobile block; it
lives in the authenticated layout. Without credentials, verify on `/login` that
a mobile-emulated page (e.g. 390x844) gets `window.innerWidth === 1024` and
`matchMedia('(min-width: 1024px)').matches === true`, then use a local mock or
the site CSS to check that the block is hidden and desktop layout rules apply.

## VCS

This is a Jujutsu repo (`.jj/`). Use `jj` for version-control operations; avoid
destructive `git` commands.
