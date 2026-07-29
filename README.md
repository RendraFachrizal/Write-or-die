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

## Documentation

- [Product Requirements](./docs/PRD.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Task List](./docs/TASKS.md)
- [Conventions](./docs/CONVENTIONS.md)
