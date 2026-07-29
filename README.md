# WriteOrDie

A minimalist writing app that locks you into a fullscreen editor until you hit your target.

WriteOrDie forces commitment — set a timer or word count goal, and the app keeps you in a distraction-free editor until you finish. No quitting, no switching tabs, no backing out.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** CSS Modules
- **Storage:** localStorage (no backend)
- **Routing:** React Router v6
- **State:** React Context + useReducer

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## How It Works

1. **Create a session** — set a title, timer, and/or word count goal
2. **Start writing** — the app enters fullscreen and locks you in
3. **Hit your target** — the session ends when the timer expires or you reach your word count
4. **Review** — browse completed documents in the list

### Lock Mechanism

- Enters browser Fullscreen API — exiting fullscreen re-enters it
- Blocks tab close via `beforeunload` handler
- Intercepts Escape, Ctrl+W, and Ctrl+F4
- No visible navigation until the session completes
- Auto-saves content every 10 seconds (crash recovery)

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Router setup
├── index.css                   # Global styles (dark theme)
├── types/
│   └── document.ts             # WritingDocument interface
├── context/
│   └── DocumentContext.tsx      # Document state + localStorage sync
├── hooks/
│   ├── useTimer.ts             # Countdown timer
│   ├── useWordCount.ts         # Word counting + progress
│   └── useFullscreen.ts        # Fullscreen API wrapper
├── lib/
│   ├── storage.ts              # localStorage helpers
│   └── format.ts               # Shared formatting utilities
├── pages/
│   ├── DocumentList.tsx        # Home — list all documents
│   ├── SessionSetup.tsx        # New session form
│   ├── Editor.tsx              # Locked writing editor
│   └── DocumentView.tsx        # Read-only document view
└── components/
    ├── TimerDisplay.tsx        # Timer with pulse warning
    ├── WordCountDisplay.tsx     # Word count + progress bar
    └── CompletionSummary.tsx    # Post-session stats overlay
```

## Documentation

- [Product Requirements](./docs/PRD.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Task List](./docs/TASKS.md)
- [Conventions](./docs/CONVENTIONS.md)
# Write-or-die
