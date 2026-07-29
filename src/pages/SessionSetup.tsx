import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentContext";
import type { WritingDocument } from "../types/document";
import styles from "./SessionSetup.module.css";

export default function SessionSetup() {
  const { state, dispatch } = useDocuments();
  const navigate = useNavigate();

  const inProgress = state.documents.find((d) => d.status === "in-progress");

  const [title, setTitle] = useState(
    `Untitled — ${new Date().toLocaleDateString()}`,
  );
  const [timerMinutes, setTimerMinutes] = useState("");
  const [wordCountGoal, setWordCountGoal] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const timer = timerMinutes ? Number(timerMinutes) : null;
    const goal = wordCountGoal ? Number(wordCountGoal) : null;

    if (timer === null && goal === null) {
      setError("Set at least a timer or a word count goal.");
      return;
    }

    if (timer !== null && (isNaN(timer) || timer < 1)) {
      setError("Timer must be at least 1 minute.");
      return;
    }

    if (goal !== null && (isNaN(goal) || goal < 1)) {
      setError("Word count goal must be at least 1.");
      return;
    }

    const doc: WritingDocument = {
      id: crypto.randomUUID(),
      title: title.trim() || `Untitled — ${new Date().toLocaleDateString()}`,
      content: "",
      wordCountGoal: goal,
      timerMinutes: timer,
      actualWordCount: 0,
      actualDurationSeconds: 0,
      status: "in-progress",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    dispatch({ type: "ADD_DOCUMENT", payload: doc });
    navigate(`/write/${doc.id}`);
  }

  function handleDiscardAndContinue() {
    if (
      inProgress &&
      window.confirm(
        `Discard "${inProgress.title}" and start a new session? This cannot be undone.`,
      )
    ) {
      dispatch({ type: "DELETE_DOCUMENT", payload: inProgress.id });
    }
  }

  if (inProgress) {
    return (
      <div className={styles.page}>
        <h1>New Session</h1>
        <div className={styles.progressWarning}>
          <p>
            You already have a session in progress:{" "}
            <strong>{inProgress.title}</strong>.
          </p>
          <p>Complete or discard it before starting a new one.</p>
          <div className={styles.warningActions}>
            <button
              className={styles.submitButton}
              onClick={() => navigate(`/write/${inProgress.id}`)}
            >
              Go to Session
            </button>
            <button
              className={styles.discardLink}
              onClick={handleDiscardAndContinue}
            >
              Discard and Start New
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>New Session</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          Timer (minutes, optional)
          <input
            type="number"
            min="1"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          Word count goal (optional)
          <input
            type="number"
            min="1"
            value={wordCountGoal}
            onChange={(e) => setWordCountGoal(e.target.value)}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submitButton} type="submit">
          Start Writing
        </button>
      </form>
    </div>
  );
}