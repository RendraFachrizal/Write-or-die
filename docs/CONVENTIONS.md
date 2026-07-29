# CONVENTIONS — WriteOrDie

- All storage access goes through `src/lib/storage.ts`.
- `STORAGE_KEY` is defined and exported from `src/lib/storage.ts` only. Import it, never redeclare.
- Use CSS Modules for all styling. No UI libraries.
- Plain textarea for editor, no rich text.
- Use `crypto.randomUUID()` for document IDs.
- Shared formatting utilities go in `src/lib/format.ts`.
- Dates use `new Date().toLocaleDateString()` at render time, not at module scope.
- Context state is initialized synchronously from `getDocuments()`, not via a load effect.