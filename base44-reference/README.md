# Base44 landing-page mockup (reference only)

Exported 2026-09-19 from the Base44 project (`6aaeebc7...`) built as a
"Sense Signal" landing mockup for the sensors/art non-profit direction.

- **Isolated reference.** Not part of the live site. `index.html` at the repo
  root remains the canonical landing page; nothing here is linked from the nav.
- Source: Base44 editor read-only code viewer (direct `/code` API export is
  blocked on the free plan: `412 App does not support direct file reads`).
- 105 files: `src/pages/Home.jsx` composes the landing (`Hero`,
  `ArchiveOfMatter`, `Collaboratory`, `Dispatch`, `ResearchPapers`,
  `ArtGallery`, `LegacyLedger`, `DataFooter`), plus shadcn `ui` set, auth
  pages, `base44/functions` (checkout + webhook starters), and configs.
- Non-breaking spaces from the Base44 viewer were normalized to ASCII spaces.
- To run it standalone: `npm install && npm run dev` (Vite + React); requires
  Base44 backend credentials for auth/data features — landing visuals render
  without them.

Do not publish secrets here. Anything adapted into the live static site should
be copied deliberately file-by-file, not by deploying this folder as-is.
