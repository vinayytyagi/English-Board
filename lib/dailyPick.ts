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

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededPick<T>(items: T[], seed: number, count: number): T[] {
  if (items.length === 0) return [];
  const rand = mulberry32(seed);
  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, items.length));
}

export function pickDailySet(seed: number, count = 4): PracticeItem[] {
  return seededPick(pool(), seed, count);
}
