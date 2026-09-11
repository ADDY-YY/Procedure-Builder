# Architecture

Procedure Builder stores one schema-versioned structured document for every draft. The editor, validation, preview, HTML export, and project backup consume that model; HTML is never stored as the authoring format.

`lib/builder/model.ts` contains the canonical types, factory functions, validation, and `schemaVersion`. `lib/builder/config.ts` defines document types and field group order. `lib/builder/templates/procedure.ts` holds the procedure template renderer and its design tokens. Each future template needs matching structure configuration and rendering configuration.

Procedure steps may include lower-alpha substeps. The procedure editor keeps a short local edit history (up to 50 changes) for undo and redo, and its search filters sections, steps, and substeps without changing the saved document.

Drafts live in browser IndexedDB under the `procedure-builder` database. A session recovery copy protects unsaved typing between automatic saves. A future API can replace the repository functions without changing the model, editor, validation, or renderers.

Planned output adapters are preview/HTML, DOCX, PDF, and Freshservice. They must each render directly from the structured model.
