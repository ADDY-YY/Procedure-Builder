# Rendering and exports

Preview and HTML export call the same renderer for the active document type. The procedure renderer mirrors the approved procedure template’s header, magenta section bars, teal knowledge panels, orange subcategories, important-information styling, and IF/THEN table.

Project Backup exports the canonical schema-versioned JSON. DOCX, PDF, and Freshservice adapters remain planned work and must be implemented as direct renderers from the structured model. They must not be built from exported HTML.

The current Export document control offers standalone HTML, a Word-compatible `.doc` download, browser Print to PDF, and a Freshservice clipboard copy. Each option uses the same validated template article shown in the live preview. Native DOCX, direct PDF, and direct Freshservice adapters remain the next export milestone.
