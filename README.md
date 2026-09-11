# Procedure Builder

A local-first structured knowledge document editor. React, TypeScript, Tailwind CSS, and Next.js-compatible App Router components, running on the supplied Vinext/Vite runtime. No authentication, API, or database is required.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by the server. For production compilation: `npm run build`.

## What is included

- Dashboard with document type cards, search, filters, saved drafts, recent documents, open, duplicate, and delete.
- Procedure, How-To, FAQ, and Reference Guide editors driven by document type configuration.
- Nested procedure sections, numbered and reorderable steps, lower-alpha substeps, screenshots, notes, warnings, exceptions, prerequisites, sources, and IF / THEN decisions.
- In-editor procedure search plus undo and redo controls, including Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z.
- Basic Markdown formatting through toolbar buttons: bold, italic, links, bullets, and numbered lists.
- Live preview and validated HTML generation, copy, preview, and download.
- IndexedDB-backed local drafts with automatic save, manual save, a session recovery copy, and a one-time migration for legacy browser drafts. Incomplete drafts are allowed.
- Agent 1 JSON import with escaped underscore normalization. Unstructured decisions remain original text until manually converted. Original imported JSON is always retained, and unmatched fields and metadata remain in the review section.
- JSON backups, a finished example, and sample imports.

## Architecture

`lib/builder/model.ts` defines structured documents, steps, decisions, factories, and validation. HTML is never the primary storage format.

`lib/builder/config.ts` defines versioned document types, field groups, and field classifications. Add or reorganize ordinary repeatable fields here. A novel control type needs its own reusable editor component.

`components/builder/fields.tsx` contains shared fields, formatting controls, repeatable lists, collapsible cards, and reorder controls. `procedure-editor.tsx` owns section and step editing. `app/page.tsx` coordinates dashboard, editor, and dialogs.

`lib/builder/render.ts` is the separate HTML renderer used by both live preview and export. It escapes user text, allows only safe link/image protocols, and emits semantic HTML with modest inline styling. The rich text subset does not accept raw HTML.

`lib/builder/import.ts` maps Agent 1 JSON without inferring missing content. Source metadata and unknown properties remain recoverable in the draft and exported JSON archive. Unmapped review data is intentionally not inserted into the article export.

`lib/builder/storage.ts` provides the IndexedDB draft repository and session recovery. To connect a future database, replace its load/save operations with an asynchronous API while keeping the structured model and renderer unchanged.

## Examples

- `public/examples/agent-1.json`: two nested procedure sections, original and structured decisions, and migration concerns.
- `public/examples/procedure-document.json`: finished structured Procedure Builder document.
- `public/examples/procedure-export.html`: finished standalone HTML export.

Use “Open example” on the dashboard to edit the example; save it to add it to drafts.

## Validation and limitations

The workflow test covers creating two sections, multiple steps, notes, decisions, reordering, preview/export, save/reload, unsafe input escaping, draft duplication, escaped underscores, raw decision preservation, and import hierarchy. Run `npm test`.

Drafts belong to this browser and origin. Clearing browser data removes them. Save JSON backups for important work. Screenshots are limited to 1.5 MB each; total localStorage capacity varies. Uploaded images are embedded as data URLs; external knowledge editors may strip them, so host images separately when required. Clipboard copy requires browser permission / a secure context. There is no remote synchronization.

A feature-detected, read-only WebMCP tool exposes the current structured document and validation results when supported. Ordinary browsers do not require this experimental API.
