# AGENTS — WriteOrDie

Stack: React + Vite + TypeScript. Styling: CSS Modules. Storage: localStorage. Routing: React Router v6. State: React Context + useReducer. No backend. See docs/ARCHITECTURE.md for full details. Current status: Phase 1 MVP complete.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type-check (tsc) + production build (vite)
npm run preview  # Preview production build
```

## Key Conventions

- All storage goes through `src/lib/storage.ts`. Import `STORAGE_KEY` from there, never redeclare.
- CSS Modules for all styling. No UI libraries.
- Plain textarea for editor, no rich text.
- `crypto.randomUUID()` for document IDs.
- Shared formatting in `src/lib/format.ts`.
- Dates use `new Date().toLocaleDateString()` at render time, not at module scope.
- Context initializes state synchronously from `getDocuments()`.

## Verification

After changes, run `npm run build` to type-check and verify the build succeeds.
