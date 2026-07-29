# ARCHITECTURE — WriteOrDie

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules (no UI library — keep it minimal)
- **Storage:** localStorage (no backend)
- **Routing:** React Router v6
- **State Management:** React Context + useReducer (one context for documents)

## Folder Structure

```
writeordie/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── TASKS.md
│   └── CONVENTIONS.md
└── src/
    ├── main.tsx                     # Entry point
    ├── App.tsx                      # Router + catch-all redirect
    ├── vite-env.d.ts                # Vite client types
    ├── index.css                    # Global styles (dark theme, resets)
    ├── types/
    │   └── document.ts              # WritingDocument interface
    ├── context/
    │   └── DocumentContext.tsx       # Document state + localStorage sync
    ├── hooks/
    │   ├── useTimer.ts              # Countdown timer (supports resume)
    │   ├── useWordCount.ts          # Word counting + progress
    │   └── useFullscreen.ts         # Fullscreen API (standard + webkit)
    ├── lib/
    │   ├── storage.ts               # localStorage helpers + STORAGE_KEY
    │   └── format.ts                # Shared formatDuration helper
    ├── pages/
    │   ├── DocumentList.tsx
    │   ├── DocumentList.module.css
    │   ├── SessionSetup.tsx
    │   ├── SessionSetup.module.css
    │   ├── Editor.tsx
    │   ├── Editor.module.css
    │   ├── DocumentView.tsx
    │   └── DocumentView.module.css
    └── components/
        ├── TimerDisplay.tsx
        ├── TimerDisplay.module.css
        ├── WordCountDisplay.tsx
        ├── WordCountDisplay.module.css
        ├── CompletionSummary.tsx
        └── CompletionSummary.module.css
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
| `*` | Navigate to `/` | Catch-all 404 redirect |

## Key Design Decisions

1. **localStorage over IndexedDB:** Simpler API, sufficient for single-user text storage. Documents are small.

2. **CSS Modules over Tailwind/styled-components:** Minimal setup, no build config, scoped by default.

3. **React Context over Redux/Zustand:** One piece of global state (document list). A single context with useReducer is sufficient.

4. **Plain textarea over contentEditable/ProseMirror:** No formatting needed. A textarea is predictable, accessible, and has zero edge cases.

5. **Fullscreen API as primary lock mechanism:** The browser Fullscreen API combined with `beforeunload`, Escape key interception, and hidden navigation creates the strongest possible lock within browser constraints.

## Lock Mechanism Details

The editor implements these layers for the active session:

1. `enterFullscreen()` on session start (via `useFullscreen` hook)
2. `fullscreenchange` listener — if user exits fullscreen during active session, re-request after 500ms debounce to prevent rate-limit loops
3. `beforeunload` handler — shows browser-native close confirmation
4. `keydown` handler — intercepts Escape (re-enter fullscreen), Ctrl+W, Ctrl+F4, Alt+F4
5. No visible navigation UI — status bar only, no back button or links
6. Auto-save via context dispatch every 10 seconds (crash recovery)

### Goal Reached Flow

When a target is hit (timer expires or word count goal met):

1. All lock handlers (beforeunload, keydown, fullscreen re-entry) are removed
2. Fullscreen **remains active** — the user stays in the editor
3. A banner appears at the top:
   - **Green** (success): "Goal reached! You can keep writing or finish." — word count was met
   - **Red** (failed): "Time's up! You didn't reach the target. Keep writing or finish." — both targets were set, timer expired before word count was met
4. The textarea stays editable — the user can keep writing
5. Clicking "Finish Session": exits fullscreen, saves the document (with all words including post-goal), and shows the CompletionSummary overlay
6. Fullscreen does not re-enter after this point

## State Management

- Context initializes state from `getDocuments()` (localStorage) at construction time — no async load effect needed
- Every dispatch (ADD, UPDATE, DELETE) triggers a `useEffect` that writes the full document array to localStorage
- `STORAGE_KEY` is exported from `storage.ts` only; all consumers import it from there

## Timer Resume

The `useTimer` hook accepts an optional `startTimestamp` (the document's `createdAt`). On mount, it computes wall-clock elapsed time and subtracts from `timerMinutes * 60`. This means resuming a crashed session picks up where the timer should be, not from the full duration.
