# Secure notification board plan

The landing page currently uses a local, read-only preview in `app.js`. This is
intentional: GitHub Pages cannot securely host admin writes, moderation, rate limiting,
or private credentials.

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
