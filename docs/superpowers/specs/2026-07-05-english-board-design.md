# English Board — Design Spec

**Date:** 2026-07-05
**Owner:** Vinay
**Type:** Personal project
**Status:** Approved design → ready for implementation plan

---

## 1. Purpose

A clean, personal English & communication dashboard ("English Board") to help a
tech-startup founder practice speaking with confidence. It provides a **curated
library** of ready-to-use content (self-intros, situational phrases, wording
upgrades, phrase toolkit) and a **passive daily practice** flow (read aloud, mark
done, keep a streak).

**Explicitly out of scope for v1** (parked in `future.md`):
- Active mic / speech-to-text practice.
- Any runtime AI / API-key integration.

Content is **static and curated**, authored in the codebase. It is expanded over
time by editing typed data files (with Claude Code's help) — never via a runtime API.

---

## 2. Users & Access

- Single user (the founder). No accounts, no multi-user.
- Deployed to **Vercel** (free) with a private URL; usable on **laptop + phone**.
- **Password gate:** a single shared passcode `vinay` protects the whole app.
  - Implemented via Next.js middleware: unauthenticated requests redirect to a
    `/login` screen; correct password sets an auth cookie; all routes gated.
  - The password lives in an env var (`APP_PASSWORD`, default `vinay`) — not
    hardcoded in a component. This is light protection for personal content, not
    high security.

---

## 3. App Structure (tabs)

Navigation: left sidebar on desktop, bottom tab bar on mobile.

1. **🏠 Home** — greeting, today's practice set, streak counter, quick links to tabs.
2. **🙋 Intros** — self-introduction scripts by context (Investor, Customer/Client,
   Networking, Hiring a candidate, Podcast/Panel, Casual "what do you do?"). Each
   has **Short (~10s) / Medium (~30s) / Long (~60s)** versions, read-aloud ready.
3. **🎯 Situations** — "what to say, when" for founder scenarios: Idea pitch,
   Sales/demo call, Team meeting/standup, Giving feedback, Politely disagreeing,
   Negotiating, Asking for something, Following up, Handling tough questions,
   Networking small talk. Each = go-to lines/mini-scripts + short **do's & don'ts**.
4. **✨ Better Wording** — **weak → strong swaps** (e.g. "I think maybe" →
   "I'm confident that", "just wanted to" → "I'd like to", filler removal) and a
   list of **simple-but-effective power words** with example usage.
5. **🧰 Phrase Toolkit** — functional phrase banks: Agreeing, Disagreeing,
   Clarifying, Buying time, Transitioning, Giving an opinion, Politely softening,
   Summarizing, Ending a conversation.
6. **🔥 Daily Practice** — auto-picked set of a few items (intros/phrases/
   situations). **Teleprompter view** (large readable text) to read aloud, then
   **"Practiced ✓"** advances the streak.

---

## 4. Content Data Model

All content lives in typed data files under `data/`, so expansion = appending
objects to arrays. No database, no API.

- `data/intros.ts`
  ```ts
  type Intro = {
    id: string
    context: string        // "Investor", "Customer", ...
    short: string
    medium: string
    long: string
    tags?: string[]
  }
  ```
- `data/situations.ts`
  ```ts
  type Situation = {
    id: string
    title: string          // "Politely disagree"
    lines: string[]        // ready go-to lines / mini-scripts
    dos?: string[]
    donts?: string[]
    tags?: string[]
  }
  ```
- `data/wording.ts`
  ```ts
  type Swap = { id: string; weak: string; strong: string; note?: string }
  type PowerWord = { id: string; word: string; meaning: string; example: string }
  ```
- `data/toolkit.ts`
  ```ts
  type PhraseGroup = { id: string; fn: string; phrases: string[] } // fn = "Disagreeing"
  ```

Each tab renders from its data file. Adding content later never touches UI code.

**v1 seed content:** a solid starter set per tab (roughly 6 intros ×3 versions,
~10 situations, ~15 wording swaps + ~15 power words, ~9 phrase groups). Enough to
be genuinely useful on day one; grown over time.

---

## 5. Progress / Practice Tracking

- **`localStorage` only** — no backend, no login. Private to the device/browser.
- Tracked: current streak, last-practiced date, count of practices, which items
  marked practiced today.
- Home shows streak + "practiced today?" state. Streak increments once per day on
  first completed practice; resets if a day is missed.

---

## 6. Tech Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui** for clean, rounded, whitespace-heavy UI matching
  the reference image (soft shadows, rounded cards, pill buttons).
- **Deploy:** Vercel (free).
- **State:** React state + `localStorage`; no server state, no DB.
- **Auth:** Next.js middleware + cookie (see §2).

---

## 7. Visual / Design System

- **All colors defined globally** as the single source of truth — CSS variables in
  `app/globals.css` (e.g. `--color-bg`, `--color-surface`, `--color-text`,
  `--color-muted`, `--color-accent`, `--color-accent-fg`, `--color-border`),
  surfaced through the Tailwind theme so components reference tokens, never raw
  hex. Changing the theme = editing one place.
- **Palette:** neutral light background, white surfaces, one **violet/indigo
  accent** (matching the reference image), muted grey secondary text.
- **Typography:** clean sans-serif; oversized readable text in the teleprompter.
- **Layout:** generous whitespace, rounded cards, soft shadows. Desktop = left
  sidebar; mobile = bottom tab bar.
- Light mode for v1; dark mode is an easy follow-up (tokens make it trivial).

---

## 8. Non-Goals (v1)

- No mic / speech recognition (see `future.md`).
- No AI/API at runtime.
- No accounts, database, or multi-user.
- No search (can be added later; Approach 3 idea).

---

## 9. Success Criteria

- Opens on phone + laptop behind the `vinay` passcode.
- All 6 tabs render curated content cleanly, matching the reference aesthetic.
- Daily Practice teleprompter works; marking practiced updates a persistent streak.
- Adding new content later = appending to a `data/*.ts` file, no UI changes.
