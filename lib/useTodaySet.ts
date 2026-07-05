"use client";
import { useMemo } from "react";
import { pickDailySet, daySeed } from "@/lib/dailyPick";
import { todayStr } from "@/lib/streak";

export function useTodaySet(count = 4) {
  return useMemo(() => pickDailySet(daySeed(todayStr()), count), [count]);
}
