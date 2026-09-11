# Adding a document type

1. Obtain the approved template and document its structure, field classifications, media rules, and visual design tokens.
2. Add a versioned configuration entry in `lib/builder/config.ts`.
3. Extend the canonical model only when a reusable existing field type cannot represent the template.
4. Add a renderer that consumes the structured model directly.
5. Add validation and representative tests.
6. Update architecture, configuration, validation, rendering, and release documentation.
