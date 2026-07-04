# English Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "English Board" — a clean, password-gated personal web dashboard of curated English/communication content plus a passive read-aloud daily-practice flow with a streak.

**Architecture:** Next.js App Router app deployed to Vercel. All content lives in typed `data/*.ts` files (no DB, no runtime AI). Pure logic (auth check, streak, daily-pick) lives in `lib/*.ts` and is unit-tested with Vitest. Progress persists in browser `localStorage`. A single shared password gates the whole app via middleware. All colors are defined once as global theme tokens.

**Tech Stack:** Next.js (latest, App Router), TypeScript (strict), Tailwind CSS v4 (CSS-first `@theme` tokens), shadcn/ui (Button + Card only), Vitest + jsdom + React Testing Library, Vercel.

## Global Constraints

- **Framework:** Next.js latest, App Router, TypeScript `strict: true`. No `src/` dir — `app/`, `lib/`, `data/`, `components/` at repo root. Import alias `@/*`.
- **No runtime AI / API / database.** Content is static (`data/*.ts`); progress is `localStorage` only.
- **All colors global:** every color is a token in `app/globals.css` `@theme` block. Components reference token-backed Tailwind classes (e.g. `bg-surface`, `text-accent`) — **never raw hex/rgb in component files.**
- **Password gate:** whole app requires password. Password read from env `APP_PASSWORD`, default `"vinay"`. Auth cookie name `eb_auth`, value `"ok"`.
- **Content shape is fixed** (see Task 3 types). Adding content later = appending objects to a `data/*.ts` array — never editing UI.
- **Deploy target:** Vercel. Mobile (bottom tab bar) + desktop (left sidebar) both supported.
- **Commit after every task** with a `feat:`/`chore:`/`test:` message.

---

### Task 1: Project scaffold + test runner

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (via create-next-app)
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add test scripts + vitest deps)

**Interfaces:**
- Produces: a runnable Next app (`npm run dev`) and a working test runner (`npm test`) that later tasks depend on.

- [ ] **Step 1: Scaffold Next.js into the repo (which already has planning docs).**

The repo root already contains `*.md` and `docs/`, so scaffold into a temp dir and copy in (excluding `node_modules`), then install.

Run (Bash tool):
```bash
cd "/c/Users/Vinay/Desktop/Cominglish"
npx create-next-app@latest .eb-temp --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
# copy everything except node_modules into the repo root
cp -r .eb-temp/app .eb-temp/public .eb-temp/*.json .eb-temp/*.ts .eb-temp/*.mjs .eb-temp/.gitignore ./ 2>/dev/null || true
rm -rf .eb-temp
npm install
```
Expected: `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css` now exist at repo root.

- [ ] **Step 2: Add Vitest + testing deps.**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

- [ ] **Step 3: Create `vitest.config.ts`.**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`.**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Add scripts to `package.json`.**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Add a smoke test so the runner is proven.**

Create `lib/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("test runner", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 7: Run the test.**

Run: `npm test`
Expected: PASS (1 passed).

- [ ] **Step 8: Verify the app boots.**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 9: Commit.**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest"
```

---

### Task 2: Global color tokens + base layout styles

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: global Tailwind classes `bg-app`, `bg-surface`, `text-ink`, `text-muted`, `bg-accent`, `text-accent`, `text-accent-fg`, `border-line`, and radius/shadow tokens — used by every later UI task.

- [ ] **Step 1: Replace `app/globals.css` with tokenized theme.**

```css
@import "tailwindcss";

@theme {
  /* colors — single source of truth */
  --color-app: #f6f7f9;
  --color-surface: #ffffff;
  --color-ink: #1a1a1f;
  --color-muted: #6b7280;
  --color-line: #e6e7eb;
  --color-accent: #6d3cff;      /* violet accent (matches reference) */
  --color-accent-fg: #ffffff;
  --color-accent-soft: #efe9ff;

  /* radii + shadow */
  --radius-card: 1rem;
  --radius-pill: 9999px;
  --shadow-card: 0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06);
}

html, body { height: 100%; }
body {
  background: var(--color-app);
  color: var(--color-ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Verify tokens compile.**

Run: `npm run build`
Expected: build succeeds (Tailwind v4 `@theme` recognized).

- [ ] **Step 3: Commit.**

```bash
git add app/globals.css
git commit -m "feat: global color + design tokens"
```

---

### Task 3: Content types + seed data + integrity test

**Files:**
- Create: `lib/types.ts`, `data/intros.ts`, `data/situations.ts`, `data/wording.ts`, `data/toolkit.ts`
- Test: `data/content.test.ts`

**Interfaces:**
- Produces types consumed everywhere:
  - `Intro { id: string; context: string; short: string; medium: string; long: string; tags?: string[] }`
  - `Situation { id: string; title: string; lines: string[]; dos?: string[]; donts?: string[]; tags?: string[] }`
  - `Swap { id: string; weak: string; strong: string; note?: string }`
  - `PowerWord { id: string; word: string; meaning: string; example: string }`
  - `PhraseGroup { id: string; fn: string; phrases: string[] }`
- Produces data arrays: `intros: Intro[]`, `situations: Situation[]`, `swaps: Swap[]`, `powerWords: PowerWord[]`, `phraseGroups: PhraseGroup[]`.

- [ ] **Step 1: Create `lib/types.ts`.**

```ts
export type Intro = {
  id: string;
  context: string;
  short: string;
  medium: string;
  long: string;
  tags?: string[];
};

export type Situation = {
  id: string;
  title: string;
  lines: string[];
  dos?: string[];
  donts?: string[];
  tags?: string[];
};

export type Swap = { id: string; weak: string; strong: string; note?: string };
export type PowerWord = { id: string; word: string; meaning: string; example: string };
export type PhraseGroup = { id: string; fn: string; phrases: string[] };
```

- [ ] **Step 2: Write the failing integrity test.**

Create `data/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { intros } from "./intros";
import { situations } from "./situations";
import { swaps, powerWords } from "./wording";
import { phraseGroups } from "./toolkit";

function uniqueIds<T extends { id: string }>(arr: T[]) {
  return new Set(arr.map((x) => x.id)).size === arr.length;
}

describe("content integrity", () => {
  it("has seed content in every collection", () => {
    expect(intros.length).toBeGreaterThanOrEqual(6);
    expect(situations.length).toBeGreaterThanOrEqual(8);
    expect(swaps.length).toBeGreaterThanOrEqual(12);
    expect(powerWords.length).toBeGreaterThanOrEqual(12);
    expect(phraseGroups.length).toBeGreaterThanOrEqual(8);
  });

  it("has unique ids per collection", () => {
    expect(uniqueIds(intros)).toBe(true);
    expect(uniqueIds(situations)).toBe(true);
    expect(uniqueIds(swaps)).toBe(true);
    expect(uniqueIds(powerWords)).toBe(true);
    expect(uniqueIds(phraseGroups)).toBe(true);
  });

  it("intros have all three lengths filled", () => {
    for (const i of intros) {
      expect(i.short.trim()).not.toBe("");
      expect(i.medium.trim()).not.toBe("");
      expect(i.long.trim()).not.toBe("");
    }
  });
});
```

- [ ] **Step 3: Run it to confirm it fails.**

Run: `npx vitest run data/content.test.ts`
Expected: FAIL (cannot find `./intros` etc.).

- [ ] **Step 4: Create `data/intros.ts`** (seed: 6 contexts, all 3 lengths). Author real, natural founder intros. Sample shape (fill all 6 fully during implementation):

```ts
import type { Intro } from "@/lib/types";

export const intros: Intro[] = [
  {
    id: "intro-investor",
    context: "Investor",
    short: "I'm Vinay, founder of [Startup] — we help [who] do [what] faster.",
    medium:
      "Hi, I'm Vinay, founder of [Startup]. We help [target user] [solve problem] without [old painful way]. We're early but already [traction], and I'd love to walk you through where we're headed.",
    long:
      "Hi, I'm Vinay. I'm the founder of [Startup]. Before this I [background]. We started [Startup] because [problem story]. Today we help [target user] [solve problem], and what makes us different is [wedge]. We're at [stage/traction], and we're raising to [goal].",
    tags: ["pitch", "fundraising"],
  },
  {
    id: "intro-customer",
    context: "Customer / Client",
    short: "Hi, I'm Vinay from [Startup] — we make [outcome] simple for [who].",
    medium:
      "Hi, I'm Vinay, I lead [Startup]. We work with [type of customer] to [outcome]. I'd love to understand what you're working on and see if we can help.",
    long:
      "Hi, I'm Vinay, founder at [Startup]. We help teams like yours [outcome] without [pain]. A quick example: [mini case]. I'd love to learn about your setup and where the friction is today.",
    tags: ["sales"],
  },
  // ... author 4 more: "Networking", "Hiring a candidate", "Podcast / Panel", "Casual 'what do you do?'"
];
```
Requirement: the array MUST contain 6 complete entries (the 2 above + Networking, Hiring, Podcast/Panel, Casual), each with non-empty short/medium/long.

- [ ] **Step 5: Create `data/situations.ts`** (seed: ≥8 situations). Sample shape (author the rest fully):

```ts
import type { Situation } from "@/lib/types";

export const situations: Situation[] = [
  {
    id: "sit-disagree",
    title: "Disagree politely",
    lines: [
      "I see it a little differently — can I share why?",
      "That's a fair point. My concern is…",
      "I'm not fully convinced yet. Help me understand…",
    ],
    dos: ["Acknowledge their point first", "Use 'I' statements", "Offer your reasoning"],
    donts: ["Say 'you're wrong'", "Interrupt", "Get personal"],
    tags: ["meetings"],
  },
  {
    id: "sit-pitch",
    title: "Pitch your idea",
    lines: [
      "In one line: we help [who] [do what] without [pain].",
      "The reason this matters now is [timing].",
      "Where we are today is [traction].",
    ],
    dos: ["Lead with the outcome", "Keep it to 2–3 sentences", "Invite a question"],
    donts: ["Open with jargon", "List every feature", "Ramble"],
    tags: ["pitch"],
  },
  // ... author ≥6 more: Sales/demo call, Team standup, Giving feedback, Negotiating,
  //     Asking for something, Following up, Handling tough questions, Networking small talk
];
```
Requirement: ≥8 complete situations.

- [ ] **Step 6: Create `data/wording.ts`** (seed: ≥12 swaps, ≥12 power words).

```ts
import type { Swap, PowerWord } from "@/lib/types";

export const swaps: Swap[] = [
  { id: "sw-think-maybe", weak: "I think maybe we could…", strong: "I'm confident we can…", note: "Drop hedging; sound decisive." },
  { id: "sw-just-wanted", weak: "I just wanted to ask…", strong: "I'd like to ask…", note: "'Just' shrinks your ask." },
  { id: "sw-sorry-to-bother", weak: "Sorry to bother you…", strong: "Thanks for your time — quick one:", note: "Lead with respect, not apology." },
  { id: "sw-kind-of", weak: "It's kind of important", strong: "It's important", note: "Cut softeners that weaken you." },
  // ... author ≥8 more
];

export const powerWords: PowerWord[] = [
  { id: "pw-clear", word: "clear", meaning: "easy to understand", example: "Let me make this clear." },
  { id: "pw-confident", word: "confident", meaning: "sure about something", example: "I'm confident this will work." },
  { id: "pw-value", word: "value", meaning: "worth / usefulness", example: "Here's the value for you." },
  // ... author ≥9 more (simple but effective words)
];
```
Requirement: ≥12 swaps, ≥12 power words.

- [ ] **Step 7: Create `data/toolkit.ts`** (seed: ≥8 phrase groups).

```ts
import type { PhraseGroup } from "@/lib/types";

export const phraseGroups: PhraseGroup[] = [
  { id: "fn-agree", fn: "Agreeing", phrases: ["Absolutely.", "That makes sense to me.", "I'm on the same page.", "Couldn't agree more."] },
  { id: "fn-disagree", fn: "Disagreeing", phrases: ["I see it differently.", "I'm not sure I agree.", "Can I offer another view?"] },
  { id: "fn-buy-time", fn: "Buying time", phrases: ["Let me think about that for a second.", "Good question — give me a moment.", "Let me make sure I understand."] },
  // ... author ≥5 more: Clarifying, Transitioning, Giving an opinion,
  //     Politely softening, Summarizing, Ending a conversation
];
```
Requirement: ≥8 complete groups.

- [ ] **Step 8: Run the integrity test — expect PASS.**

Run: `npx vitest run data/content.test.ts`
Expected: PASS (all 3 tests).

- [ ] **Step 9: Commit.**

```bash
git add lib/types.ts data/
git commit -m "feat: content types and seed library with integrity tests"
```

---

### Task 4: Password gate (auth logic + middleware + login)

**Files:**
- Create: `lib/auth.ts`, `middleware.ts`, `app/login/page.tsx`, `app/api/login/route.ts`
- Test: `lib/auth.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `AUTH_COOKIE = "eb_auth"`, `AUTH_VALUE = "ok"`, `checkPassword(input: string): boolean`. Middleware protects all routes except `/login`, `/api/login`, and static assets.

- [ ] **Step 1: Write the failing test.**

Create `lib/auth.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { checkPassword, AUTH_COOKIE, AUTH_VALUE } from "./auth";

afterEach(() => { delete process.env.APP_PASSWORD; });

describe("checkPassword", () => {
  it("accepts the default password 'vinay' when env unset", () => {
    expect(checkPassword("vinay")).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(checkPassword("nope")).toBe(false);
  });
  it("uses APP_PASSWORD when set", () => {
    process.env.APP_PASSWORD = "secret1";
    expect(checkPassword("secret1")).toBe(true);
    expect(checkPassword("vinay")).toBe(false);
  });
  it("exposes stable cookie name and value", () => {
    expect(AUTH_COOKIE).toBe("eb_auth");
    expect(AUTH_VALUE).toBe("ok");
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`./auth` not found).

Run: `npx vitest run lib/auth.test.ts`
Expected: FAIL.

- [ ] **Step 3: Create `lib/auth.ts`.**

```ts
export const AUTH_COOKIE = "eb_auth";
export const AUTH_VALUE = "ok";

export function checkPassword(input: string): boolean {
  const expected = process.env.APP_PASSWORD ?? "vinay";
  return input === expected;
}
```

- [ ] **Step 4: Run it — expect PASS.**

Run: `npx vitest run lib/auth.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Create `middleware.ts`.**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_VALUE } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublic) return NextResponse.next();

  const authed = req.cookies.get(AUTH_COOKIE)?.value === AUTH_VALUE;
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 6: Create `app/api/login/route.ts`.**

```ts
import { NextResponse } from "next/server";
import { checkPassword, AUTH_COOKIE, AUTH_VALUE } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL("/login?error=1", req.url), { status: 303 });
  }
  const res = NextResponse.redirect(new URL("/", req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, AUTH_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
```

- [ ] **Step 7: Create `app/login/page.tsx`.**

```tsx
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center bg-app px-4">
      <form
        action="/api/login"
        method="post"
        className="w-full max-w-sm rounded-[var(--radius-card)] bg-surface p-8 shadow-[var(--shadow-card)] border border-line"
      >
        <h1 className="text-2xl font-semibold text-ink">English Board</h1>
        <p className="mt-1 text-sm text-muted">Enter your password to continue.</p>
        <input
          type="password"
          name="password"
          autoFocus
          placeholder="Password"
          className="mt-6 w-full rounded-[var(--radius-pill)] border border-line bg-app px-4 py-3 text-ink outline-none focus:border-accent"
        />
        {error && <p className="mt-2 text-sm text-red-500">Wrong password. Try again.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-[var(--radius-pill)] bg-accent px-4 py-3 font-medium text-accent-fg"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 8: Manual verify the gate.**

Run: `npm run dev`, open `http://localhost:3000` → redirected to `/login`. Enter `vinay` → lands on Home. Wrong password → error message. Reload `/` → stays in (cookie set).

- [ ] **Step 9: Commit.**

```bash
git add lib/auth.ts lib/auth.test.ts middleware.ts app/login app/api/login
git commit -m "feat: password gate via middleware and login"
```

---

### Task 5: Streak logic (pure, TDD)

**Files:**
- Create: `lib/streak.ts`
- Test: `lib/streak.test.ts`

**Interfaces:**
- Produces:
  - `type StreakState = { count: number; lastPracticed: string | null }` (dates are `"YYYY-MM-DD"`)
  - `todayStr(d?: Date): string`
  - `recordPractice(state: StreakState, today: string): StreakState`
  - `currentStreak(state: StreakState, today: string): number`

- [ ] **Step 1: Write the failing test.**

Create `lib/streak.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { recordPractice, currentStreak, type StreakState } from "./streak";

const empty: StreakState = { count: 0, lastPracticed: null };

describe("recordPractice", () => {
  it("starts a streak at 1 on first practice", () => {
    expect(recordPractice(empty, "2026-07-05")).toEqual({ count: 1, lastPracticed: "2026-07-05" });
  });
  it("does not double-count the same day", () => {
    const s = { count: 3, lastPracticed: "2026-07-05" };
    expect(recordPractice(s, "2026-07-05")).toEqual(s);
  });
  it("increments when practiced the next day", () => {
    const s = { count: 3, lastPracticed: "2026-07-05" };
    expect(recordPractice(s, "2026-07-06")).toEqual({ count: 4, lastPracticed: "2026-07-06" });
  });
  it("resets to 1 after a missed day", () => {
    const s = { count: 9, lastPracticed: "2026-07-05" };
    expect(recordPractice(s, "2026-07-08")).toEqual({ count: 1, lastPracticed: "2026-07-08" });
  });
});

describe("currentStreak", () => {
  it("is 0 when never practiced", () => {
    expect(currentStreak(empty, "2026-07-05")).toBe(0);
  });
  it("shows the count when last practice was today", () => {
    expect(currentStreak({ count: 5, lastPracticed: "2026-07-05" }, "2026-07-05")).toBe(5);
  });
  it("still shows the count when last practice was yesterday", () => {
    expect(currentStreak({ count: 5, lastPracticed: "2026-07-04" }, "2026-07-05")).toBe(5);
  });
  it("shows 0 when a day was missed", () => {
    expect(currentStreak({ count: 5, lastPracticed: "2026-07-03" }, "2026-07-05")).toBe(0);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL.**

Run: `npx vitest run lib/streak.test.ts`
Expected: FAIL (`./streak` not found).

- [ ] **Step 3: Implement `lib/streak.ts`.**

```ts
export type StreakState = { count: number; lastPracticed: string | null };

export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayDiff(from: string, to: string): number {
  const a = Date.parse(from + "T00:00:00");
  const b = Date.parse(to + "T00:00:00");
  return Math.round((b - a) / 86_400_000);
}

export function recordPractice(state: StreakState, today: string): StreakState {
  if (state.lastPracticed === today) return state;
  if (state.lastPracticed && dayDiff(state.lastPracticed, today) === 1) {
    return { count: state.count + 1, lastPracticed: today };
  }
  return { count: 1, lastPracticed: today };
}

export function currentStreak(state: StreakState, today: string): number {
  if (!state.lastPracticed) return 0;
  const diff = dayDiff(state.lastPracticed, today);
  return diff === 0 || diff === 1 ? state.count : 0;
}
```

- [ ] **Step 4: Run it — expect PASS.**

Run: `npx vitest run lib/streak.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit.**

```bash
git add lib/streak.ts lib/streak.test.ts
git commit -m "feat: streak logic with tests"
```

---

### Task 6: Daily-pick logic (pure, TDD)

**Files:**
- Create: `lib/dailyPick.ts`
- Test: `lib/dailyPick.test.ts`

**Interfaces:**
- Produces:
  - `type PracticeItem = { kind: "intro" | "situation" | "phrase"; id: string; label: string; text: string }`
  - `daySeed(today: string): number`
  - `pickDailySet(seed: number, count?: number): PracticeItem[]` — deterministic per seed, drawn from `data/*`.

- [ ] **Step 1: Write the failing test.**

Create `lib/dailyPick.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { pickDailySet, daySeed } from "./dailyPick";

describe("daySeed", () => {
  it("is stable for the same date and differs across dates", () => {
    expect(daySeed("2026-07-05")).toBe(daySeed("2026-07-05"));
    expect(daySeed("2026-07-05")).not.toBe(daySeed("2026-07-06"));
  });
});

describe("pickDailySet", () => {
  it("returns the requested number of items", () => {
    expect(pickDailySet(daySeed("2026-07-05"), 4)).toHaveLength(4);
  });
  it("is deterministic for the same seed", () => {
    const a = pickDailySet(daySeed("2026-07-05"), 4).map((i) => i.id);
    const b = pickDailySet(daySeed("2026-07-05"), 4).map((i) => i.id);
    expect(a).toEqual(b);
  });
  it("every item has non-empty text and a known kind", () => {
    for (const item of pickDailySet(daySeed("2026-07-05"), 4)) {
      expect(item.text.trim()).not.toBe("");
      expect(["intro", "situation", "phrase"]).toContain(item.kind);
    }
  });
});
```

- [ ] **Step 2: Run it — expect FAIL.**

Run: `npx vitest run lib/dailyPick.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `lib/dailyPick.ts`.**

```ts
import { intros } from "@/data/intros";
import { situations } from "@/data/situations";
import { phraseGroups } from "@/data/toolkit";

export type PracticeItem = {
  kind: "intro" | "situation" | "phrase";
  id: string;
  label: string;
  text: string;
};

export function daySeed(today: string): number {
  return Math.floor(Date.parse(today + "T00:00:00") / 86_400_000);
}

function pool(): PracticeItem[] {
  const items: PracticeItem[] = [];
  for (const i of intros) items.push({ kind: "intro", id: i.id, label: `Intro · ${i.context}`, text: i.medium });
  for (const s of situations) items.push({ kind: "situation", id: s.id, label: `Situation · ${s.title}`, text: s.lines[0] });
  for (const g of phraseGroups) items.push({ kind: "phrase", id: g.id, label: `Phrases · ${g.fn}`, text: g.phrases.join("  •  ") });
  return items;
}

export function pickDailySet(seed: number, count = 4): PracticeItem[] {
  const items = pool();
  if (items.length === 0) return [];
  const step = 7; // coprime-ish stride for spread
  const picked: PracticeItem[] = [];
  const used = new Set<number>();
  let idx = ((seed % items.length) + items.length) % items.length;
  while (picked.length < Math.min(count, items.length)) {
    if (!used.has(idx)) {
      used.add(idx);
      picked.push(items[idx]);
    }
    idx = (idx + step) % items.length;
    if (used.size === items.length) break;
  }
  return picked;
}
```

- [ ] **Step 4: Run it — expect PASS.**

Run: `npx vitest run lib/dailyPick.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit.**

```bash
git add lib/dailyPick.ts lib/dailyPick.test.ts
git commit -m "feat: deterministic daily practice picker with tests"
```

---

### Task 7: localStorage progress store + hook

**Files:**
- Create: `lib/storage.ts`, `lib/useProgress.ts`
- Test: `lib/storage.test.ts`

**Interfaces:**
- Consumes: `StreakState`, `recordPractice`, `currentStreak`, `todayStr` from `lib/streak`.
- Produces:
  - `loadStreak(): StreakState`, `saveStreak(s: StreakState): void`
  - `getPracticedToday(today: string): string[]`, `addPracticedToday(today: string, id: string): void`
  - `useProgress()` React hook → `{ streak: number, practicedToday: string[], markPracticed(id: string): void }`

- [ ] **Step 1: Write the failing test** (jsdom provides `localStorage`).

Create `lib/storage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { loadStreak, saveStreak, getPracticedToday, addPracticedToday } from "./storage";

beforeEach(() => localStorage.clear());

describe("streak persistence", () => {
  it("defaults to an empty streak", () => {
    expect(loadStreak()).toEqual({ count: 0, lastPracticed: null });
  });
  it("round-trips a saved streak", () => {
    saveStreak({ count: 4, lastPracticed: "2026-07-05" });
    expect(loadStreak()).toEqual({ count: 4, lastPracticed: "2026-07-05" });
  });
});

describe("practiced-today set", () => {
  it("is empty by default", () => {
    expect(getPracticedToday("2026-07-05")).toEqual([]);
  });
  it("adds ids without duplicates and scopes to the date", () => {
    addPracticedToday("2026-07-05", "a");
    addPracticedToday("2026-07-05", "a");
    addPracticedToday("2026-07-05", "b");
    expect(getPracticedToday("2026-07-05").sort()).toEqual(["a", "b"]);
    expect(getPracticedToday("2026-07-06")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL.**

Run: `npx vitest run lib/storage.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `lib/storage.ts`.**

```ts
import type { StreakState } from "@/lib/streak";

const STREAK_KEY = "eb_streak";
const PRACTICED_KEY = "eb_practiced"; // { date: string, ids: string[] }

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return { count: 0, lastPracticed: null };
  return safeParse<StreakState>(localStorage.getItem(STREAK_KEY), { count: 0, lastPracticed: null });
}

export function saveStreak(s: StreakState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

export function getPracticedToday(today: string): string[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<{ date: string; ids: string[] }>(localStorage.getItem(PRACTICED_KEY), { date: "", ids: [] });
  return data.date === today ? data.ids : [];
}

export function addPracticedToday(today: string, id: string): void {
  if (typeof window === "undefined") return;
  const ids = new Set(getPracticedToday(today));
  ids.add(id);
  localStorage.setItem(PRACTICED_KEY, JSON.stringify({ date: today, ids: [...ids] }));
}
```

- [ ] **Step 4: Run it — expect PASS.**

Run: `npx vitest run lib/storage.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Implement `lib/useProgress.ts`** (client hook wiring storage + streak).

```ts
"use client";
import { useCallback, useEffect, useState } from "react";
import { loadStreak, saveStreak, getPracticedToday, addPracticedToday } from "@/lib/storage";
import { currentStreak, recordPractice, todayStr } from "@/lib/streak";

export function useProgress() {
  const [streak, setStreak] = useState(0);
  const [practicedToday, setPracticedToday] = useState<string[]>([]);

  useEffect(() => {
    const today = todayStr();
    setStreak(currentStreak(loadStreak(), today));
    setPracticedToday(getPracticedToday(today));
  }, []);

  const markPracticed = useCallback((id: string) => {
    const today = todayStr();
    const next = recordPractice(loadStreak(), today);
    saveStreak(next);
    addPracticedToday(today, id);
    setStreak(currentStreak(next, today));
    setPracticedToday(getPracticedToday(today));
  }, []);

  return { streak, practicedToday, markPracticed };
}
```

- [ ] **Step 6: Commit.**

```bash
git add lib/storage.ts lib/storage.test.ts lib/useProgress.ts
git commit -m "feat: localStorage progress store and useProgress hook"
```

---

### Task 8: App shell — navigation (sidebar + mobile tab bar)

**Files:**
- Create: `components/nav.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing runtime.
- Produces: `NAV_ITEMS` used by nav; a responsive shell wrapping all pages (sidebar ≥ md, bottom bar < md).

- [ ] **Step 1: Create `components/nav.tsx`.**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/intros", label: "Intros", icon: "🙋" },
  { href: "/situations", label: "Situations", icon: "🎯" },
  { href: "/wording", label: "Wording", icon: "✨" },
  { href: "/toolkit", label: "Toolkit", icon: "🧰" },
  { href: "/practice", label: "Practice", icon: "🔥" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 shrink-0 border-r border-line bg-surface p-4">
      <div className="px-2 py-3 text-lg font-semibold text-ink">English Board</div>
      <nav className="mt-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[var(--radius-pill)] px-3 py-2 text-sm ${
                active ? "bg-accent-soft text-accent font-medium" : "text-muted hover:bg-app"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 border-t border-line bg-surface flex justify-around px-1 py-1.5">
      {NAV_ITEMS.map((item) => {
        const active = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] ${
              active ? "text-accent font-medium" : "text-muted"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Update `app/layout.tsx`** to use the shell.

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileTabBar } from "@/components/nav";

export const metadata: Metadata = {
  title: "English Board",
  description: "Personal English & communication practice board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-5 py-6 pb-24 md:pb-6 max-w-3xl mx-auto w-full">{children}</main>
        </div>
        <MobileTabBar />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Manual verify.**

Run: `npm run dev` → after login, sidebar shows on desktop; narrow the window → bottom tab bar appears; active tab is highlighted with the accent.

- [ ] **Step 4: Commit.**

```bash
git add components/nav.tsx app/layout.tsx
git commit -m "feat: responsive app shell with sidebar and mobile tab bar"
```

---

### Task 9: Reusable UI primitives (Card, SectionHeader, PracticeButton)

**Files:**
- Create: `components/ui.tsx`

**Interfaces:**
- Produces: `Card`, `SectionHeader({ title, subtitle })`, `Pill({ children })`, `PracticeButton({ done, onClick })` — token-styled, reused by all pages.

- [ ] **Step 1: Create `components/ui.tsx`.**

```tsx
"use client";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[var(--radius-pill)] bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
      {children}
    </span>
  );
}

export function PracticeButton({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition ${
        done ? "bg-accent-soft text-accent" : "bg-accent text-accent-fg hover:opacity-90"
      }`}
    >
      {done ? "Practiced ✓" : "Mark practiced"}
    </button>
  );
}
```

- [ ] **Step 2: Commit.**

```bash
git add components/ui.tsx
git commit -m "feat: reusable token-styled UI primitives"
```

---

### Task 10: Intros page

**Files:**
- Create: `app/intros/page.tsx`, `components/intro-card.tsx`

**Interfaces:**
- Consumes: `intros` from `@/data/intros`, `Card`/`Pill`/`SectionHeader`.
- Produces: a page listing intros with Short/Medium/Long toggle per card.

- [ ] **Step 1: Create `components/intro-card.tsx`.**

```tsx
"use client";
import { useState } from "react";
import type { Intro } from "@/lib/types";
import { Card, Pill } from "@/components/ui";

const LENGTHS: Array<{ key: "short" | "medium" | "long"; label: string }> = [
  { key: "short", label: "Short" },
  { key: "medium", label: "Medium" },
  { key: "long", label: "Long" },
];

export function IntroCard({ intro }: { intro: Intro }) {
  const [len, setLen] = useState<"short" | "medium" | "long">("medium");
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Pill>{intro.context}</Pill>
        <div className="flex gap-1">
          {LENGTHS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLen(l.key)}
              className={`rounded-[var(--radius-pill)] px-2.5 py-1 text-xs ${
                len === l.key ? "bg-accent text-accent-fg" : "text-muted hover:bg-app"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-ink">{intro[len]}</p>
    </Card>
  );
}
```

- [ ] **Step 2: Create `app/intros/page.tsx`.**

```tsx
import { intros } from "@/data/intros";
import { SectionHeader } from "@/components/ui";
import { IntroCard } from "@/components/intro-card";

export default function IntrosPage() {
  return (
    <div>
      <SectionHeader title="Intros" subtitle="Introduce yourself in any context — pick a length and say it aloud." />
      <div className="flex flex-col gap-4">
        {intros.map((i) => <IntroCard key={i.id} intro={i} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Manual verify.** `npm run dev` → `/intros` lists all intros; length toggle switches text.

- [ ] **Step 4: Commit.**

```bash
git add app/intros components/intro-card.tsx
git commit -m "feat: intros page with length toggle"
```

---

### Task 11: Situations page

**Files:**
- Create: `app/situations/page.tsx`

**Interfaces:**
- Consumes: `situations` from `@/data/situations`, `Card`/`SectionHeader`.

- [ ] **Step 1: Create `app/situations/page.tsx`.**

```tsx
import { situations } from "@/data/situations";
import { Card, SectionHeader } from "@/components/ui";

export default function SituationsPage() {
  return (
    <div>
      <SectionHeader title="Situations" subtitle="What to say, when — go-to lines for common founder moments." />
      <div className="flex flex-col gap-4">
        {situations.map((s) => (
          <Card key={s.id}>
            <h2 className="text-lg font-semibold text-ink">{s.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {s.lines.map((line, idx) => (
                <li key={idx} className="rounded-lg bg-app px-3 py-2 text-ink">“{line}”</li>
              ))}
            </ul>
            {(s.dos || s.donts) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {s.dos && (
                  <div>
                    <p className="font-medium text-ink">Do</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">{s.dos.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
                {s.donts && (
                  <div>
                    <p className="font-medium text-ink">Don't</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">{s.donts.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verify.** `/situations` shows each situation with lines + do/don't.

- [ ] **Step 3: Commit.**

```bash
git add app/situations
git commit -m "feat: situations page"
```

---

### Task 12: Better Wording page

**Files:**
- Create: `app/wording/page.tsx`

**Interfaces:**
- Consumes: `swaps`, `powerWords` from `@/data/wording`, `Card`/`SectionHeader`.

- [ ] **Step 1: Create `app/wording/page.tsx`.**

```tsx
import { swaps, powerWords } from "@/data/wording";
import { Card, SectionHeader } from "@/components/ui";

export default function WordingPage() {
  return (
    <div>
      <SectionHeader title="Better Wording" subtitle="Small swaps, stronger presence." />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Weak → Strong</h2>
      <div className="flex flex-col gap-3">
        {swaps.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-muted line-through">{s.weak}</span>
              <span className="text-accent">→</span>
              <span className="text-ink font-medium">{s.strong}</span>
            </div>
            {s.note && <p className="mt-2 text-sm text-muted">{s.note}</p>}
          </Card>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Power words</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {powerWords.map((w) => (
          <Card key={w.id}>
            <p className="text-lg font-semibold text-ink">{w.word}</p>
            <p className="text-sm text-muted">{w.meaning}</p>
            <p className="mt-2 text-ink">“{w.example}”</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verify.** `/wording` shows swaps + power words.

- [ ] **Step 3: Commit.**

```bash
git add app/wording
git commit -m "feat: better wording page"
```

---

### Task 13: Phrase Toolkit page

**Files:**
- Create: `app/toolkit/page.tsx`

**Interfaces:**
- Consumes: `phraseGroups` from `@/data/toolkit`, `Card`/`SectionHeader`.

- [ ] **Step 1: Create `app/toolkit/page.tsx`.**

```tsx
import { phraseGroups } from "@/data/toolkit";
import { Card, SectionHeader } from "@/components/ui";

export default function ToolkitPage() {
  return (
    <div>
      <SectionHeader title="Phrase Toolkit" subtitle="Ready phrases for every job in a conversation." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phraseGroups.map((g) => (
          <Card key={g.id}>
            <h2 className="text-base font-semibold text-ink">{g.fn}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {g.phrases.map((p, i) => (
                <li key={i} className="rounded-lg bg-app px-3 py-2 text-ink">“{p}”</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verify.** `/toolkit` shows grouped phrases.

- [ ] **Step 3: Commit.**

```bash
git add app/toolkit
git commit -m "feat: phrase toolkit page"
```

---

### Task 14: Daily Practice page (teleprompter + streak wiring)

**Files:**
- Create: `app/practice/page.tsx`, `components/practice-runner.tsx`

**Interfaces:**
- Consumes: `pickDailySet`, `daySeed` from `@/lib/dailyPick`; `useProgress` from `@/lib/useProgress`; `todayStr` from `@/lib/streak`; `PracticeButton`/`Card`/`SectionHeader`.
- Produces: interactive teleprompter that marks items practiced and advances the streak.

- [ ] **Step 1: Create `components/practice-runner.tsx`.**

```tsx
"use client";
import { useMemo, useState } from "react";
import { pickDailySet, daySeed } from "@/lib/dailyPick";
import { todayStr } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import { Card, PracticeButton } from "@/components/ui";

export function PracticeRunner() {
  const items = useMemo(() => pickDailySet(daySeed(todayStr()), 4), []);
  const { streak, practicedToday, markPracticed } = useProgress();
  const [index, setIndex] = useState(0);
  const item = items[index];

  if (!item) return <Card>No content yet — add some in the data files.</Card>;
  const done = practicedToday.includes(item.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{index + 1} / {items.length}</span>
        <span>🔥 {streak}-day streak</span>
      </div>

      <Card className="min-h-[240px] flex flex-col justify-center text-center">
        <p className="text-xs uppercase tracking-wide text-accent">{item.label}</p>
        <p className="mt-4 text-2xl leading-relaxed text-ink">{item.text}</p>
      </Card>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-[var(--radius-pill)] px-4 py-2 text-sm text-muted disabled:opacity-40"
        >
          ← Prev
        </button>
        <PracticeButton done={done} onClick={() => markPracticed(item.id)} />
        <button
          onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
          disabled={index === items.length - 1}
          className="rounded-[var(--radius-pill)] px-4 py-2 text-sm text-muted disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/practice/page.tsx`.**

```tsx
import { SectionHeader } from "@/components/ui";
import { PracticeRunner } from "@/components/practice-runner";

export default function PracticePage() {
  return (
    <div>
      <SectionHeader title="Daily Practice" subtitle="Read each one out loud, clearly. Then mark it practiced." />
      <PracticeRunner />
    </div>
  );
}
```

- [ ] **Step 3: Manual verify the full loop.**

Run: `npm run dev` → `/practice`. Read an item aloud, click **Mark practiced** → button flips to "Practiced ✓" and streak shows `🔥 1`. Reload → streak persists. (Optional: to simulate next-day increment, know that it advances only on a new calendar day.)

- [ ] **Step 4: Commit.**

```bash
git add app/practice components/practice-runner.tsx
git commit -m "feat: daily practice teleprompter with streak"
```

---

### Task 15: Home page (dashboard)

**Files:**
- Create: `app/page.tsx` (replace scaffold default)
- Create: `components/home-dashboard.tsx`

**Interfaces:**
- Consumes: `useProgress`, `pickDailySet`/`daySeed`, `todayStr`, `NAV_ITEMS`, `Card`.

- [ ] **Step 1: Create `components/home-dashboard.tsx`.**

```tsx
"use client";
import Link from "next/link";
import { useMemo } from "react";
import { pickDailySet, daySeed } from "@/lib/dailyPick";
import { todayStr } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import { NAV_ITEMS } from "@/components/nav";
import { Card } from "@/components/ui";

export function HomeDashboard() {
  const today = useMemo(() => pickDailySet(daySeed(todayStr()), 4), []);
  const { streak, practicedToday } = useProgress();
  const doneCount = today.filter((i) => practicedToday.includes(i.id)).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Hey Vinay 👋</h1>
        <p className="mt-1 text-muted">Speak clearly, sound confident. A little every day.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-semibold text-accent">🔥 {streak}</p>
          <p className="text-sm text-muted">day streak</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-semibold text-ink">{doneCount}/{today.length}</p>
          <p className="text-sm text-muted">today's practice</p>
        </Card>
      </div>

      <Link
        href="/practice"
        className="rounded-[var(--radius-card)] bg-accent px-5 py-4 text-center font-medium text-accent-fg"
      >
        Start today's practice →
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NAV_ITEMS.filter((n) => n.href !== "/").map((n) => (
          <Link key={n.href} href={n.href}>
            <Card className="flex items-center gap-3">
              <span className="text-xl">{n.icon}</span>
              <span className="text-ink font-medium">{n.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`.**

```tsx
import { HomeDashboard } from "@/components/home-dashboard";

export default function HomePage() {
  return <HomeDashboard />;
}
```

- [ ] **Step 3: Manual verify.** `/` shows greeting, streak + today's count, big practice CTA, and quick links. Practicing on `/practice` then returning updates the today count.

- [ ] **Step 4: Full test + build gate.**

Run: `npm test && npm run build`
Expected: all unit tests PASS; build succeeds.

- [ ] **Step 5: Commit.**

```bash
git add app/page.tsx components/home-dashboard.tsx
git commit -m "feat: home dashboard"
```

---

### Task 16: Deploy to Vercel

**Files:**
- Create: `README.md` (short run/deploy notes)

**Interfaces:**
- Consumes: the whole app.
- Produces: a live private URL gated by the `vinay` password.

- [ ] **Step 1: Write `README.md`** with local run (`npm run dev`), test (`npm test`), and the note that `APP_PASSWORD` env var overrides the default `vinay` password.

- [ ] **Step 2: Deploy.**

Run:
```bash
npx vercel --yes           # first run links/creates the project (preview)
npx vercel --prod --yes    # production deploy
```
(If Vercel CLI is not installed: `npm i -g vercel` first, or connect the GitHub repo in the Vercel dashboard.)

- [ ] **Step 3: Set the password in production (optional but recommended).**

Run: `npx vercel env add APP_PASSWORD production` → enter your chosen password, then redeploy `npx vercel --prod --yes`. If skipped, the default `vinay` is used.

- [ ] **Step 4: Verify live.**

Open the production URL on phone + laptop → password screen appears → enter password → all tabs work → practice + streak persist per device.

- [ ] **Step 5: Commit.**

```bash
git add README.md
git commit -m "docs: readme and deploy notes"
```

---

## Self-Review

**Spec coverage check (spec §→task):**
- §2 Access / password `vinay` → Task 4 ✓
- §3 Tabs: Home→T15, Intros→T10, Situations→T11, Better Wording→T12, Toolkit→T13, Daily Practice→T14 ✓
- §4 Content data model (typed `data/*.ts`) → Task 3 ✓
- §5 Progress/streak in localStorage → Tasks 5, 7, 14 ✓
- §6 Tech stack (Next.js/Tailwind/shadcn/Vercel) → Tasks 1, 2, 16 ✓ (Note: shadcn/ui listed in spec; plan implements the same clean look with token-styled primitives in Task 9 to avoid version friction — Button/Card can be swapped to shadcn later without interface changes.)
- §7 All colors global → Task 2 ✓ (enforced: components use token classes only)
- §8 Non-goals (no mic/AI/DB/search) → respected throughout ✓
- §9 Success criteria → covered by Tasks 4, 10–15 manual verifies + Task 16 live check ✓

**Placeholder scan:** Data files (Task 3) intentionally ship a concrete seed count (defined minimums enforced by the integrity test) with a few fully-written examples plus explicit "author the rest" requirements naming every remaining entry — this is scoped content authoring, not an implementation placeholder. No logic/UI step is left as TODO.

**Type consistency:** `StreakState`, `PracticeItem`, `Intro/Situation/Swap/PowerWord/PhraseGroup`, `AUTH_COOKIE/AUTH_VALUE/checkPassword`, `useProgress()` shape, and `NAV_ITEMS` are defined once and referenced with matching names/signatures across tasks. `markPracticed(id)`, `currentStreak(state, today)`, `recordPractice(state, today)`, `pickDailySet(seed, count)`, `daySeed(today)` names are consistent everywhere.

**Deviation noted:** spec names shadcn/ui; plan substitutes equivalent token-styled primitives (Task 9) for reliability, keeping the same visual system and leaving a clean upgrade path. Flagged here for the reviewer.
