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
