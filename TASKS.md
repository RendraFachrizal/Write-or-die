# TASKS — WriteOrDie

## Phase 1: MVP

### Task 1 — Project Scaffold
**Create:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
**Do:** Initialize a React + Vite + TypeScript project. Install dependencies: `react`, `react-dom`, `react-router-dom`. Set up Vite config. Set up React Router in App.tsx with placeholder routes for `/`, `/new`, `/write/:id`, `/view/:id`.
**Done when:** `npm run dev` serves the app, navigating to each route shows a placeholder page name, no TypeScript or lint errors.

---

### Task 2 — Types and Storage Layer
**Create:** `src/types/document.ts`, `src/lib/storage.ts`
**Do:** Define the `WritingDocument` interface. Build storage helpers: `getDocuments()`, `getDocument(id)`, `saveDocument(doc)`, `deleteDocument(id)`. All read/write to localStorage under a single key `writeordie_documents`. Include JSON parse/stringify with error handling.
**Done when:** Storage helpers can be imported and called. Types compile. Manual test in browser console: save a doc, retrieve it, delete it.

---

### Task 3 — Document Context
**Create:** `src/context/DocumentContext.tsx`
**Do:** Create a React Context + useReducer for document state. Actions: `LOAD_DOCUMENTS`, `ADD_DOCUMENT`, `UPDATE_DOCUMENT`, `DELETE_DOCUMENT`. Provider loads from localStorage on mount, syncs to localStorage on every dispatch. Export a `useDocuments()` hook.
**Done when:** Wrapping the app in the provider works. Calling `useDocuments()` from a component returns the state and dispatch. No TypeScript errors.

---

### Task 4 — Document List Page
**Create:** `src/pages/DocumentList.tsx`, `src/pages/DocumentList.module.css`
**Do:** Build the home page. Show all documents from context sorted by `createdAt` descending. Each row shows: title, word count, date (formatted), and duration. Show an empty state message when no documents exist. "New Document" button navigates to `/new`.
**Done when:** Page renders with empty state. After manually adding a document to localStorage, it appears in the list. "New Document" button navigates to `/new`.

---

### Task 5 — Session Setup Page
**Create:** `src/pages/SessionSetup.tsx`, `src/pages/SessionSetup.module.css`
**Do:** Build the session configuration form. Fields: title (text, defaults to "Untitled — {today's date}"), timer (number input, minutes, optional), word count goal (number input, optional). Validate: at least one of timer or word count must be set. Timer minimum is 1 minute. Word count minimum is 1. On submit: create a new `WritingDocument` in context with status `in-progress`, then navigate to `/write/:id`.
**Done when:** Form renders, validation works (try submitting with nothing set — shows error). Submitting with valid input creates a document and navigates to the editor route.

---

### Task 6 — Editor Page (Basic)
**Create:** `src/pages/Editor.tsx`, `src/pages/Editor.module.css`
**Do:** Build the locked editor page — just the textarea and display elements first, no lock mechanics yet. Load the document by ID from context. Full-viewport textarea for writing. Display live word count (count words in content on every change). Display countdown timer if `timerMinutes` is set (use `setInterval`). Display progress bar toward word count goal if set.
**Done when:** Navigating to `/write/:id` shows the editor. Typing updates the word count in real time. Timer counts down. Progress bar reflects word count progress. No lock behavior yet.

---

### Task 7 — Timer Hook
**Create:** `src/hooks/useTimer.ts`
**Do:** Extract timer logic into a custom hook. `useTimer(minutes)` returns `{ secondsRemaining, isExpired, formattedTime }`. Uses `setInterval` internally. Cleans up on unmount. If `minutes` is null, returns `{ secondsRemaining: null, isExpired: false }`.
**Done when:** Hook works in the Editor. Timer displays correctly, counts down, and `isExpired` becomes `true` when it hits zero.

---

### Task 8 — Word Count Hook
**Create:** `src/hooks/useWordCount.ts`
**Do:** Extract word counting logic. `useWordCount(content, goal)` returns `{ wordCount, isGoalMet, progressPercent }`. Word counting: split on whitespace, filter empty strings. If `goal` is null, `isGoalMet` is always false and `progressPercent` is null.
**Done when:** Hook returns accurate counts. Progress percentage is correct. `isGoalMet` flips to `true` at the right count.

---

### Task 9 — Fullscreen Hook
**Create:** `src/hooks/useFullscreen.ts`
**Do:** Wrap the Fullscreen API. `useFullscreen()` returns `{ enterFullscreen, exitFullscreen, isFullscreen }`. `enterFullscreen` calls `document.documentElement.requestFullscreen()`. Listen to `fullscreenchange` to track state. Handle API differences between browsers (webkit prefix).
**Done when:** Calling `enterFullscreen()` puts the page in fullscreen. `isFullscreen` reflects actual state. `exitFullscreen` works.

---

### Task 10 — Lock Mechanics
**Edit:** `src/pages/Editor.tsx`
**Do:** Wire up all lock behavior:
1. Call `enterFullscreen()` on mount.
2. On `fullscreenchange`: if user exits fullscreen and session is not complete, immediately re-enter fullscreen.
3. Add `beforeunload` handler to prevent tab close.
4. Add `keydown` handler: block Escape (re-enter fullscreen), preventDefault on Ctrl+W, Ctrl+F4.
5. Hide all navigation — no back button, no links, no way out.
6. Auto-save document content to localStorage every 10 seconds.
**Done when:** Starting a session enters fullscreen. Pressing Escape re-enters fullscreen. Closing the tab shows the browser warning. No visible way to leave. Content auto-saves.

---

### Task 11 — Session Completion
**Create:** `src/components/CompletionSummary.tsx`
**Edit:** `src/pages/Editor.tsx`
**Do:** Detect session completion: `isExpired || isGoalMet`. When complete:
1. Stop the timer.
2. Remove all lock handlers (`beforeunload`, `keydown`).
3. Exit fullscreen.
4. Save final document to context with status `completed`, `actualWordCount`, `actualDurationSeconds`, `completedAt`.
5. Show CompletionSummary overlay: words written, time elapsed, "Back to Documents" button.
**Done when:** Reaching the word count goal or timer expiry triggers completion. Lock is removed. Summary displays correct stats. Clicking "Back to Documents" navigates to `/`.

---

### Task 12 — Document View Page
**Create:** `src/pages/DocumentView.tsx`, `src/pages/DocumentView.module.css`
**Do:** Build a read-only view for completed documents. Load document by ID from context. Show title, content (preserving whitespace/newlines), word count, date, and duration. "Back" button to return to document list.
**Done when:** Clicking a document in the list navigates to this page. Content displays correctly. Back button works.

---

### Task 13 — Timer and Word Count Display Components
**Create:** `src/components/TimerDisplay.tsx`, `src/components/WordCountDisplay.tsx`
**Do:** Extract timer display and word count display into reusable components. TimerDisplay: shows formatted time (MM:SS), pulses or changes color in last 60 seconds. WordCountDisplay: shows "X / Y words" with progress bar, bar fills based on percentage, turns green at 100%.
**Done when:** Components render in the editor. Timer shows correct format. Progress bar animates smoothly.

---

### Task 14 — Styling Pass
**Edit:** All `.module.css` files, add `src/index.css` for global styles
**Do:** Apply a cohesive minimal design. Dark background, high-contrast text for the editor (reduce eye strain during long sessions). Clean sans-serif font. Document list styled as a simple table/cards. Session setup as a centered form. Editor is full-viewport with only the textarea and minimal status bar. No UI frameworks — hand-written CSS only.
**Done when:** All pages have consistent, clean styling. Editor feels focused and distraction-free. No unstyled elements. Responsive enough to not break at reasonable desktop sizes (1024px+).

---

### Task 15 — Edge Cases and Polish
**Edit:** `src/pages/Editor.tsx`, `src/pages/SessionSetup.tsx`, `src/context/DocumentContext.tsx`
**Do:**
1. Handle crash recovery: if a document has status `in-progress` when the app loads, offer to resume or discard it.
2. Handle invalid routes: navigating to `/write/bad-id` redirects to `/`.
3. Handle empty content: don't count whitespace-only content toward word count.
4. Prevent creating a new session while one is `in-progress`.
5. Add document deletion from the document list (with confirmation).
**Done when:** All edge cases handled. Crash recovery works (close tab mid-session, reopen, get prompted). Invalid IDs redirect. Delete works with confirmation.

---

## Phase 2 (Future — not part of MVP)

- Dashboard page with writing streaks, total words, session history graph
- Export documents as markdown or plain text
- Customizable themes (dark/light/sepia)
- Sound effects on completion
- Keyboard shortcut reference
