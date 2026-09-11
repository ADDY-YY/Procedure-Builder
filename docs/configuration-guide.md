# Configuration guide

Document configuration is defined in `lib/builder/config.ts`. A document type supplies its label, description, ordered field groups, and field labels. The model stores repeatable fields by configuration key, allowing future document types to reuse editor components.

Template-dependent sections, requiredness, structural minimums, media permissions, and output styles must be documented alongside their approved template before implementation. Do not add a template-defined field or rule only in a renderer.
