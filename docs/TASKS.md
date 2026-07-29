# TASKS — WriteOrDie

## Phase 1: MVP — Complete

All 15 tasks are done. Post-MVP bug fixes and hardening items are listed below.

### Task 1 — Project Scaffold ✅
**Create:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
**Do:** Initialize a React + Vite + TypeScript project. Install dependencies: `react`, `react-dom`, `react-router-dom`. Set up Vite config. Set up React Router in App.tsx with placeholder routes for `/`, `/new`, `/write/:id`, `/view/:id`.

---

### Task 2 — Types and Storage Layer ✅
**Create:** `src/types/document.ts`, `src/lib/storage.ts`
**Do:** Define the `WritingDocument` interface. Build storage helpers: `getDocuments()`, `getDocument(id)`, `saveDocument(doc)`, `deleteDocument(id)`. JSON parse/stringify with error handling.

---

### Task 3 — Document Context ✅
**Create:** `src/context/DocumentContext.tsx`
**Do:** Create a React Context + useReducer. Actions: `ADD_DOCUMENT`, `UPDATE_DOCUMENT`, `DELETE_DOCUMENT`. State initialized from localStorage at construction time. Syncs to localStorage on every dispatch. Export `useDocuments()`.

---

### Task 4 — Document List Page ✅
**Create:** `src/pages/DocumentList.tsx`, `src/pages/DocumentList.module.css`
**Do:** Home page showing all documents sorted by `createdAt` descending. Each row: title, word count, date, duration. Empty state message. "New Document" navigates to `/new`.

---

### Task 5 — Session Setup Page ✅
**Create:** `src/pages/SessionSetup.tsx`, `src/pages/SessionSetup.module.css`
**Do:** Session configuration form. Title (defaults to today's date), timer (minutes, optional), word count goal (optional). Validation: at least one required, min 1 each. Submitting creates document and navigates to `/write/:id`. Blocks new session while one is in-progress.

---

### Task 6 — Editor Page (Basic) ✅
**Create:** `src/pages/Editor.tsx`, `src/pages/Editor.module.css`
**Do:** Full-viewport textarea, live word count, countdown timer, progress bar. Redirects invalid IDs to `/`.

---

### Task 7 — Timer Hook ✅
**Create:** `src/hooks/useTimer.ts`
**Do:** `useTimer(minutes, startTimestamp?)` returns `{ secondsRemaining, isExpired, formattedTime }`. Accepts optional `startTimestamp` for crash-resume (computes elapsed wall-clock time).

---

### Task 8 — Word Count Hook ✅
**Create:** `src/hooks/useWordCount.ts`
**Do:** `useWordCount(content, goal)` returns `{ wordCount, isGoalMet, progressPercent }`. Splits on whitespace, filters empty strings.

---

### Task 9 — Fullscreen Hook ✅
**Create:** `src/hooks/useFullscreen.ts`
**Do:** `useFullscreen()` returns `{ enterFullscreen, exitFullscreen, isFullscreen }`. Handles standard + webkit prefixes.

---

### Task 10 — Lock Mechanics ✅
**Edit:** `src/pages/Editor.tsx`
**Do:** Fullscreen on mount, re-enter on escape (500ms debounce), beforeunload handler, keydown blocker (Escape, Ctrl+W, Ctrl+F4), no navigation UI, auto-save every 10s via context dispatch.

---

### Task 11 — Session Completion ✅
**Create:** `src/components/CompletionSummary.tsx`
**Edit:** `src/pages/Editor.tsx`
**Do:** Detects `isExpired || isGoalMet`. Saves final document (status completed, word count, duration). Exits fullscreen. Shows CompletionSummary overlay.

---

### Task 12 — Document View Page ✅
**Create:** `src/pages/DocumentView.tsx`, `src/pages/DocumentView.module.css`
**Do:** Read-only view. Title, content (pre-wrap), word count, date, duration. Back button. Redirects bad IDs to `/`.

---

### Task 13 — Display Components ✅
**Create:** `src/components/TimerDisplay.tsx`, `src/components/WordCountDisplay.tsx`
**Do:** TimerDisplay: MM:SS, pulses red in last 60s. WordCountDisplay: "X / Y words", progress bar, green at 100%.

---

### Task 14 — Styling Pass ✅
**Create:** `src/index.css`
**Edit:** All `.module.css` files
**Do:** Dark theme (`#0d0d0d` bg, `#e0e0e0` text), system font stack, consistent button/input styling, distraction-free editor.

---

### Task 15 — Edge Cases and Polish ✅
**Edit:** `src/pages/Editor.tsx`, `src/pages/SessionSetup.tsx`, `src/pages/DocumentList.tsx`, `src/context/DocumentContext.tsx`
**Do:**
1. Crash recovery: banner with Resume/Discard for in-progress docs
2. Invalid routes: Editor and DocumentView redirect to `/`
3. Empty content: whitespace-only not counted
4. Prevent duplicate sessions: SessionSetup blocks form when in-progress doc exists
5. Document deletion: × button with `window.confirm()`
6. Catch-all route: unknown paths redirect to `/`

---

## Bug Fixes & Hardening (Post-MVP)

| # | Issue | Fix |
|---|---|---|
| 1 | Data wipe on load | Context initialized from `getDocuments()` at construction time |
| 2 | Auto-save race | Auto-save dispatches through context, not raw localStorage |
| 3 | Duplicate STORAGE_KEY | Exported from `storage.ts`, imported everywhere else |
| 4 | Timer deps expression | Extracted `isRunning` variable for clean deps array |
| 5 | Timer reset on resume | `useTimer` accepts `startTimestamp`, computes elapsed time |
| 6 | Duplicated formatDuration | Moved to `src/lib/format.ts`, imported by 3 consumers |
| 7 | Stale default date | `new Date().toLocaleDateString()` computed at render time |
| 8 | No catch-all route | `<Route path="*">` redirects to `/` |
| 9 | Fullscreen re-request loop | 500ms `setTimeout` debounce with cleanup |
| 10 | Discard without confirmation | `window.confirm()` before discarding in-progress session |

---

## Feedback Fixes

| # | Issue | Fix |
|---|---|---|
| 1 | Escape exits fullscreen before typing | Lock handlers now depend only on `doc` and `goalReached` — not on `content` or other changing state. Keydown listener attached on mount immediately. |
| 2 | Fullscreen persists after session ends | Separated `goalReached` and `sessionEnded` states. Fullscreen re-entry effect checks both flags. Fullscreen only exits on explicit "Finish Session" click. |
| 3 | Session ends abruptly | Goal reached now shows a non-intrusive banner (green/red based on context) with keep-writing and "Finish Session" options. Lock handlers removed. Fullscreen stays active until user finishes. |
| 4 | Resume not working | Discard button now has `window.confirm()`. Remaining resume pipeline was already correctly wired (context sync, auto-save, timer resume). |

---

## Phase 2 (Future)

- Dashboard page with writing streaks, total words, session history graph
- Export documents as markdown or plain text
- Customizable themes (dark/light/sepia)
- Sound effects on completion
- Keyboard shortcut reference
