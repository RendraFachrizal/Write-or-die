import { useState, useEffect } from "react";

interface TimerResult {
  secondsRemaining: number | null;
  isExpired: boolean;
  formattedTime: string | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useTimer(
  minutes: number | null | undefined,
  startTimestamp?: string | null,
): TimerResult {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(() => {
    if (minutes == null) return null;
    if (startTimestamp) {
      const elapsed = Math.floor(
        (Date.now() - new Date(startTimestamp).getTime()) / 1000,
      );
      return Math.max(0, minutes * 60 - elapsed);
    }
    return minutes * 60;
  });

  useEffect(() => {
    if (minutes == null) {
      setSecondsRemaining(null);
      return;
    }
    if (startTimestamp) {
      const elapsed = Math.floor(
        (Date.now() - new Date(startTimestamp).getTime()) / 1000,
      );
      setSecondsRemaining(Math.max(0, minutes * 60 - elapsed));
    } else {
      setSecondsRemaining(minutes * 60);
    }
  }, [minutes, startTimestamp]);

  const isRunning = secondsRemaining != null && secondsRemaining > 0;

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev == null || prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const isExpired = secondsRemaining === 0;

  return {
    secondsRemaining,
    isExpired,
    formattedTime: secondsRemaining != null ? formatTime(secondsRemaining) : null,
  };
}