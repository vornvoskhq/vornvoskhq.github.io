# Secure notification board plan

## Current backend status (deployed 2026-09-19)

The Convex backend is deployed and the public noticeboard now reads from it:

- public read endpoint (GET, CORS-restricted to this site):
  `https://glad-dalmatian-963.convex.site/public/posts`
- dashboard: https://dashboard.convex.dev/t/msudick02/openmatter-board
- **administration is CLI-only**: all write operations are internal functions
  in the private `openmatter-board` repository, callable only with deployment
  credentials — there is no public write path and no admin identity allowlist
  to maintain
- posting, unpublish/republish, and deletion have been exercised end-to-end;
  every action writes an audit record
- **admin page**: `/admin.html` on this site (noindex, not linked publicly).
  Paste the admin token per session — it stays in that browser tab only and is
  verified server-side on every request. The token lives in the private
  `openmatter-board` repo (`.env.admin`) and as a Convex env var.
- failed admin attempts are rate-limited server-side (5 per 15 minutes per
  origin+IP)
- **image uploads**: the admin page accepts an image per post (jpeg, png,
  webp, gif, avif; max 5 MiB). Files are stored in Convex storage, validated
  by magic-byte sniffing (declared type must match content), deduplicated by
  content hash, and served from `/storage/<id>` on the backend domain.
  Images are removed automatically when the last post referencing them is
  deleted; unreferenced uploads can be swept with `images:purgeUnreferenced`.
- comments remain hard-disabled in code until moderation and rate limiting are
  tested end-to-end

If the endpoint is unreachable, the noticeboard falls back to the bundled
static preview posts in `app.js`; no errors are shown to visitors.

Earlier stages below described the backend as planned; it is now live in the
read-only posture described above. Admin-authenticated posting and moderated
comments remain future stages.

## Release stages

### Stage 1 — public landing page

- Static GitHub Pages site.
- Curated notices only.
- No public post form.
- No comments.
- Zoho Webmail and Mail Admin links remain private administration tools.

### Stage 2 — authenticated publishing

Use Convex as a separate backend. The frontend may read only published records. Admin
mutations must require an authenticated identity that is present in an explicit admin
allowlist. The browser must never contain a Convex admin secret.

A post should contain only:

- short text with a server-enforced length limit;
- an optional HTTPS external URL validated server-side;
- an optional image stored through a controlled upload path;
- publication status and timestamps;
- an audit reference for the administrator action.

Images need MIME/type, byte-size, dimension, and filename restrictions. External links
should render with `noopener noreferrer` and should not be fetched server-side merely to
create previews.

### Stage 3 — moderated comments

Comments stay disabled until moderation is implemented. When enabled, require an
identity provider or verified email flow and enforce all of the following on the server:

- per-identity and per-IP rate limits;
- maximum length and link-count limits;
- duplicate/repetition detection;
- pending moderation by default;
- report, hide, delete, and block actions;
- an audit trail for moderation actions;
- escaped text rendering and safe URL handling;
- retention/deletion rules and a visible community policy.

Do not rely on a hidden field, client-side CAPTCHA, or JavaScript-only validation as spam
resistance. Those controls are bypassable.

## Convex implementation boundary

When the backend is added, keep the public client limited to generated read queries and
admin-authenticated mutations. Keep moderation policy in server functions, not in
`app.js`. The public site should expose no private `dft2`, `casmi`, machine, filesystem,
email credential, or research artifact path.

Before enabling comments, test unauthorized writes, oversized payloads, malformed URLs,
rapid submissions, duplicate posts/comments, deleted content, and account removal. Keep
a small set of manually selected research results and charts separate from the board
records so unfinished computational runs cannot become public accidentally.
