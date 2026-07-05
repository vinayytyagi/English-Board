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
