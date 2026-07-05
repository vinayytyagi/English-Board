"use client";
import { useCallback, useEffect, useState } from "react";
import { loadStreak, saveStreak, getPracticedToday, addPracticedToday } from "@/lib/storage";
import { currentStreak, recordPractice, todayStr } from "@/lib/streak";

export function useProgress() {
  const [streak, setStreak] = useState(0);
  const [practicedToday, setPracticedToday] = useState<string[]>([]);

  useEffect(() => {
    const today = todayStr();
    setStreak(currentStreak(loadStreak(), today));
    setPracticedToday(getPracticedToday(today));
  }, []);

  const markPracticed = useCallback((id: string) => {
    const today = todayStr();
    const next = recordPractice(loadStreak(), today);
    saveStreak(next);
    addPracticedToday(today, id);
    setStreak(currentStreak(next, today));
    setPracticedToday(getPracticedToday(today));
  }, []);

  return { streak, practicedToday, markPracticed };
}
