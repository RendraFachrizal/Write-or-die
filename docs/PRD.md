# PRD — WriteOrDie

## Overview

WriteOrDie is a minimalist writing app that forces you to finish what you start. You create a document, set a timer and/or word count goal, and the app locks you into a fullscreen distraction-free editor until you hit your target.

## Problem

Existing note-taking and writing apps make it trivially easy to quit, switch tabs, or get distracted mid-session. There is no enforcement mechanism for writing commitment.

## Target User

Solo writer (yourself) who wants to build a consistent writing habit through forced accountability.

## User Stories

1. **As a writer**, I want to see a list of all my past documents so I can review what I've written.
2. **As a writer**, I want to create a new document and set a timer (minutes) and/or a word count goal before I start writing.
3. **As a writer**, I want to be locked into a fullscreen, distraction-free editor once I start a session so I cannot quit early.
4. **As a writer**, I want to see a live countdown timer and live word count while I write so I know my progress.
5. **As a writer**, I want the session to notify me when I reach my word count goal OR the timer runs out, and let me keep writing until I'm ready to finish.
6. **As a writer**, I want my document to auto-save while I write so I never lose work in case of a crash.
7. **As a writer**, I want to be able to open and read (but not session-lock) a completed document from the document list.

## Functional Requirements

### Document List (Home Screen)
- Display all saved documents sorted by most recent
- Show title, word count, date, and session duration for each
- "New Document" button to start a new session
- Click a document to view it (read-only)

### Session Setup
- Title field (required, defaults to "Untitled" + date)
- Timer input (minutes, minimum 1, optional)
- Word count goal input (minimum 1, optional)
- At least one of timer or word count must be set
- "Start Writing" button

### Locked Editor
- Enters browser Fullscreen API on start
- Fullscreen stays active until the user clicks "Finish Session"
- Plain text editor (textarea), no formatting
- Live word count display
- Live countdown timer display (if timer was set)
- Progress bar showing % toward word count goal
- Blocked interactions:
  - `beforeunload` event prevents tab/window close
  - Escape key is intercepted (re-enters fullscreen instead of exiting)
  - No navigation elements visible
  - No close/back/home buttons until goal is met
- When a target is reached:
  - Lock handlers (beforeunload, key intercepts) are removed
  - Fullscreen remains active
  - A banner appears at the top of the editor:
    - Green: "Goal reached! You can keep writing or finish." (word count met)
    - Red: "Time's up! You didn't reach the target. Keep writing or finish." (both targets set, timer expired before word count met)
  - The user can keep typing freely
  - A "Finish Session" button is available
- On "Finish Session":
  - Document saves to localStorage with final word count and duration
  - Fullscreen exits
  - User is shown a completion summary (words written, time elapsed)
  - "Back to Documents" button appears

### Data Persistence
- All data stored in localStorage
- Document model: `{ id, title, content, wordCountGoal, timerMinutes, actualWordCount, actualDuration, createdAt, completedAt }`

## Non-Functional Requirements

- App loads in under 1 second
- No external API calls
- No authentication
- Desktop-first (no mobile optimization)
- Works in Chrome and Firefox

## Out of Scope (Phase 2+)

- Dashboard with writing statistics and graphs
- Rich text / markdown formatting
- Tags, folders, or document organization
- User accounts or cloud sync
- Export to PDF/markdown/etc.
- Collaboration or sharing
- Mobile-responsive design
- Themes or customization
