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

  const { isExpired, secondsRemaining, formattedTime } = useTimer(
    doc?.timerMinutes,
    doc?.createdAt,
  );
  const { wordCount, isGoalMet, progressPercent } = useWordCount(
    content,
    doc?.wordCountGoal,
  );
  const { enterFullscreen, exitFullscreen, isFullscreen } = useFullscreen();

  const sessionComplete = isExpired || isGoalMet;
  const contentRef = useRef(content);
  contentRef.current = content;

  const sessionStartRef = useRef(Date.now());

  const [completionData, setCompletionData] = useState<{
    wordCount: number;
    durationSeconds: number;
  } | null>(null);

  useEffect(() => {
    if (!doc) {
      navigate("/", { replace: true });
    }
  }, [doc, navigate]);

  useEffect(() => {
    if (!doc || sessionComplete) return;
    enterFullscreen();
  }, [enterFullscreen, doc, sessionComplete]);

  useEffect(() => {
    if (!doc || sessionComplete) return;
    if (!isFullscreen) {
      const id = setTimeout(() => enterFullscreen(), 500);
      return () => clearTimeout(id);
    }
  }, [isFullscreen, enterFullscreen, doc, sessionComplete]);

  useEffect(() => {
    if (!doc || sessionComplete) return;

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
  }, [doc, sessionComplete, enterFullscreen]);

  useEffect(() => {
    if (!doc || sessionComplete) return;

    const intervalId = setInterval(() => {
      if (!doc) return;
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: { ...doc, content: contentRef.current },
      });
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [doc, sessionComplete, dispatch]);

  useEffect(() => {
    if (!doc || !sessionComplete || completionData) return;

    const elapsed = Math.floor(
      (Date.now() - sessionStartRef.current) / 1000,
    );

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

    exitFullscreen();
    setCompletionData({ wordCount, durationSeconds: elapsed });
  }, [doc, sessionComplete, completionData, wordCount, dispatch, exitFullscreen]);

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
      <textarea
        className={styles.editor}
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start writing..."
        autoFocus
        readOnly={sessionComplete}
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