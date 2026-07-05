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
