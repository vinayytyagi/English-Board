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
