import { describe, it, expect } from "vitest";
import { pickDailySet, daySeed, seededPick } from "./dailyPick";

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

describe("seededPick", () => {
  it("terminates and returns the correct count with no duplicates across pool sizes 0..50", () => {
    for (let n = 0; n <= 50; n++) {
      const arr = Array.from({ length: n }, (_, i) => i);
      const picked = seededPick(arr, 12345, 4);
      expect(picked).toHaveLength(Math.min(4, n));
      expect(new Set(picked).size).toBe(picked.length);
    }
  });

  it("is deterministic for a fixed seed across pool sizes", () => {
    for (let n = 0; n <= 50; n++) {
      const arr = Array.from({ length: n }, (_, i) => i);
      const a = seededPick(arr, 999, 4);
      const b = seededPick(arr, 999, 4);
      expect(a).toEqual(b);
    }
  });

  it("returns [] for an empty pool", () => {
    expect(seededPick([], 1, 4)).toEqual([]);
  });
});
