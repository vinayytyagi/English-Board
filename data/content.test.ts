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
