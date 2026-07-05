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
