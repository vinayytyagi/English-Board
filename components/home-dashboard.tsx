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
