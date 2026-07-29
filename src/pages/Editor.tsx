import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentContext";
import { useTimer } from "../hooks/useTimer";
import { useWordCount } from "../hooks/useWordCount";
import { useFullscreen } from "../hooks/useFullscreen";
import CompletionSummary from "../components/CompletionSummary";
import TimerDisplay from "../components/TimerDisplay";
import WordCountDisplay from "../components/WordCountDisplay";
import styles from "./Editor.module.css";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useDocuments();
  const navigate = useNavigate();

  const doc = state.documents.find((d) => d.id === id);

  const [content, setContent] = useState(doc?.content ?? "");
  const [goalReached, setGoalReached] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const { isExpired, secondsRemaining, formattedTime } = useTimer(
    doc?.timerMinutes,
    doc?.createdAt,
  );
  const { wordCount, isGoalMet, progressPercent } = useWordCount(
    content,
    doc?.wordCountGoal,
  );
  const { enterFullscreen, exitFullscreen, isFullscreen } = useFullscreen();

  const contentRef = useRef(content);
  contentRef.current = content;

  const sessionStartRef = useRef(Date.now());

  // Use a ref to track sessionEnded so the fullscreen re-entry effect
  // always sees the latest value without needing it in its dependency array.
  const sessionEndedRef = useRef(false);
  sessionEndedRef.current = sessionEnded;

  const bothTargetsSet = doc?.timerMinutes !== null && doc?.wordCountGoal !== null;
  const failed = bothTargetsSet && isExpired && !isGoalMet;

  const [completionData, setCompletionData] = useState<{
    wordCount: number;
    durationSeconds: number;
  } | null>(null);

  // Redirect if doc doesn't exist
  useEffect(() => {
    if (!doc) {
      navigate("/", { replace: true });
    }
  }, [doc, navigate]);

  // Fix 1: Enter fullscreen on mount — only depends on doc existing, not on content
  useEffect(() => {
    if (!doc || goalReached) return;
    enterFullscreen();
  }, [enterFullscreen, doc, goalReached]);

  // Fix 2: Re-enter fullscreen when exited, but NOT after goal reached or session ended
  useEffect(() => {
    if (!doc || goalReached) return;
    if (sessionEndedRef.current) return;
    if (!isFullscreen) {
      const timerId = setTimeout(() => {
        if (!sessionEndedRef.current) {
          enterFullscreen();
        }
      }, 500);
      return () => clearTimeout(timerId);
    }
  }, [isFullscreen, enterFullscreen, doc, goalReached]);

  // Fix 1: Lock handlers — attached on mount, only gated on doc + goalReached
  useEffect(() => {
    if (!doc || goalReached) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        enterFullscreen();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        return;
      }
      if (e.key === "F4" && (e.ctrlKey || e.altKey)) {
        e.preventDefault();
        return;
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [doc, goalReached, enterFullscreen]);

  // Auto-save every 10 seconds while session is active
  useEffect(() => {
    if (!doc || sessionEnded) return;

    const intervalId = setInterval(() => {
      if (!doc) return;
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: { ...doc, content: contentRef.current },
      });
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [doc, sessionEnded, dispatch]);

  // Fix 3: When goal is reached, unlock the user but don't end the session
  useEffect(() => {
    if (!doc || goalReached || sessionEnded) return;
    if (isExpired || isGoalMet) {
      setGoalReached(true);
    }
  }, [doc, goalReached, sessionEnded, isExpired, isGoalMet]);

  // Fix 3: Handle the user clicking "Finish Session"
  const handleFinishSession = useCallback(() => {
    if (!doc || sessionEnded) return;

    const elapsed = Math.floor(
      (Date.now() - sessionStartRef.current) / 1000,
    );

    setSessionEnded(true);
    exitFullscreen();

    dispatch({
      type: "UPDATE_DOCUMENT",
      payload: {
        ...doc,
        content: contentRef.current,
        status: "completed",
        actualWordCount: wordCount,
        actualDurationSeconds: elapsed,
        completedAt: new Date().toISOString(),
      },
    });

    setCompletionData({ wordCount, durationSeconds: elapsed });
  }, [doc, sessionEnded, wordCount, dispatch, exitFullscreen]);

  const handleChange = useCallback(
    (text: string) => {
      setContent(text);
      if (doc) {
        dispatch({
          type: "UPDATE_DOCUMENT",
          payload: { ...doc, content: text },
        });
      }
    },
    [doc, dispatch],
  );

  if (!doc) return null;

  return (
    <div className={styles.page}>
      {goalReached && !sessionEnded && (
        <div className={failed ? styles.goalBannerFailed : styles.goalBanner}>
          <span>{failed ? "Time's up! You didn't reach the target. Keep writing or finish." : "Goal reached! You can keep writing or finish."}</span>
          <button
            className={failed ? styles.finishButtonFailed : styles.finishButton}
            onClick={handleFinishSession}
          >
            Finish Session
          </button>
        </div>
      )}

      <textarea
        className={styles.editor}
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start writing..."
        autoFocus
        readOnly={sessionEnded}
      />

      <div className={styles.bar}>
        <WordCountDisplay
          wordCount={wordCount}
          goal={doc.wordCountGoal}
          progressPercent={progressPercent}
        />

        {formattedTime !== null && secondsRemaining !== null && (
          <TimerDisplay
            formattedTime={formattedTime}
            secondsRemaining={secondsRemaining}
          />
        )}
      </div>

      {completionData && (
        <CompletionSummary
          wordCount={completionData.wordCount}
          durationSeconds={completionData.durationSeconds}
          onBack={() => navigate("/")}
        />
      )}
    </div>
  );
}