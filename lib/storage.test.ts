import { describe, it, expect, beforeEach } from "vitest";
import { loadStreak, saveStreak, getPracticedToday, addPracticedToday } from "./storage";

beforeEach(() => localStorage.clear());

describe("streak persistence", () => {
  it("defaults to an empty streak", () => {
    expect(loadStreak()).toEqual({ count: 0, lastPracticed: null });
  });
  it("round-trips a saved streak", () => {
    saveStreak({ count: 4, lastPracticed: "2026-07-05" });
    expect(loadStreak()).toEqual({ count: 4, lastPracticed: "2026-07-05" });
  });
});

describe("practiced-today set", () => {
  it("is empty by default", () => {
    expect(getPracticedToday("2026-07-05")).toEqual([]);
  });
  it("adds ids without duplicates and scopes to the date", () => {
    addPracticedToday("2026-07-05", "a");
    addPracticedToday("2026-07-05", "a");
    addPracticedToday("2026-07-05", "b");
    expect(getPracticedToday("2026-07-05").sort()).toEqual(["a", "b"]);
    expect(getPracticedToday("2026-07-06")).toEqual([]);
  });
});
