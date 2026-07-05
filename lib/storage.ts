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
