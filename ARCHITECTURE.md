# ARCHITECTURE — WriteOrDie

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules (no UI library — keep it minimal)
- **Storage:** localStorage (no backend)
- **Routing:** React Router v6
- **State Management:** React Context + useReducer (one context for documents)
- **Testing:** Vitest + React Testing Library

## Folder Structure

```
writeordie/
├── public/
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Router setup
│   ├── types/
│   │   └── document.ts           # Document type definition
│   ├── context/
│   │   └── DocumentContext.tsx    # Document state + localStorage sync
│   ├── hooks/
│   │   ├── useTimer.ts           # Countdown timer logic
│   │   ├── useWordCount.ts       # Word counting logic
│   │   └── useFullscreen.ts      # Fullscreen API wrapper
│   ├── lib/
│   │   └── storage.ts            # localStorage read/write helpers
│   ├── pages/
│   │   ├── DocumentList.tsx      # Home — list all documents
│   │   ├── DocumentList.module.css
│   │   ├── SessionSetup.tsx      # Set timer + word count
│   │   ├── SessionSetup.module.css
│   │   ├── Editor.tsx            # Locked writing editor
│   │   ├── Editor.module.css
│   │   ├── DocumentView.tsx      # Read-only view of completed doc
│   │   └── DocumentView.module.css
│   └── components/
│       ├── TimerDisplay.tsx       # Countdown timer component
│       ├── WordCountDisplay.tsx   # Live word count + progress
│       └── CompletionSummary.tsx  # Post-session stats overlay
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
├── PRD.md
├── ARCHITECTURE.md
└── TASKS.md
```

## Data Model

```typescript
interface WritingDocument {
  id: string;                  // crypto.randomUUID()
  title: string;
  content: string;
  wordCountGoal: number | null;  // null if not set
  timerMinutes: number | null;   // null if not set
  actualWordCount: number;
  actualDurationSeconds: number;
  status: 'in-progress' | 'completed';
  createdAt: string;           // ISO timestamp
  completedAt: string | null;  // ISO timestamp
}
```

## Routes

| Route | Component | Description |
|---|---|---|
| `/` | DocumentList | Home — shows all documents |
| `/new` | SessionSetup | Configure new session |
| `/write/:id` | Editor | Locked writing session |
| `/view/:id` | DocumentView | Read-only view |

## Key Design Decisions

1. **localStorage over IndexedDB:** Simpler API, sufficient for single-user text storage. Documents are small. If storage limits become an issue, migrate to IndexedDB in Phase 2.

2. **CSS Modules over Tailwind/styled-components:** Minimal setup, no build config, scoped by default. The app has ~4 pages and ~3 components — a utility framework would be overhead.

3. **React Context over Redux/Zustand:** One piece of global state (document list). A single context with useReducer is sufficient and adds no dependencies.

4. **Plain textarea over contentEditable/ProseMirror:** No formatting needed. A textarea is predictable, accessible, and has zero edge cases. Rich text is explicitly out of scope.

5. **Fullscreen API as primary lock mechanism:** The browser Fullscreen API combined with `beforeunload`, Escape key interception, and hidden navigation creates the strongest possible lock within browser constraints. True process-level locking is impossible from a web app.

## Lock Mechanism Details

The editor implements these layers:

1. `document.documentElement.requestFullscreen()` on session start
2. `document.onfullscreenchange` listener — if user exits fullscreen, immediately re-request it
3. `window.onbeforeunload` — shows browser-native "are you sure?" dialog
4. `document.onkeydown` — intercept Escape, Ctrl+W, Ctrl+F4, Alt+F4 (where possible)
5. No visible UI elements for navigation until session completes
6. Auto-save content to localStorage every 10 seconds during session (crash recovery)
