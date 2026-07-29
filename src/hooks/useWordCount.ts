import { useMemo } from "react";

interface WordCountResult {
  wordCount: number;
  isGoalMet: boolean;
  progressPercent: number | null;
}

export function useWordCount(content: string, goal: number | null | undefined): WordCountResult {
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const isGoalMet = goal != null && wordCount >= goal;

  const progressPercent =
    goal != null && goal > 0
      ? Math.min(100, Math.round((wordCount / goal) * 100))
      : null;

  return { wordCount, isGoalMet, progressPercent };
}