import { useState, useEffect, useCallback } from "react";

interface FullscreenResult {
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  isFullscreen: boolean;
}

function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ??
    null
  );
}

function requestFullscreen(el: HTMLElement): void {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else {
    (
      el as unknown as { webkitRequestFullscreen?: () => void }
    ).webkitRequestFullscreen?.();
  }
}

function exitFullscreenApi(): void {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else {
    (
      document as unknown as { webkitExitFullscreen?: () => void }
    ).webkitExitFullscreen?.();
  }
}

export function useFullscreen(): FullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState(!!getFullscreenElement());

  useEffect(() => {
    function onChange() {
      setIsFullscreen(!!getFullscreenElement());
    }

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    requestFullscreen(document.documentElement);
  }, []);

  const exitFullscreen = useCallback(() => {
    exitFullscreenApi();
  }, []);

  return { enterFullscreen, exitFullscreen, isFullscreen };
}