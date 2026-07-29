import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentContext";
import { formatDuration } from "../lib/format";
import styles from "./DocumentView.module.css";

export default function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDocuments();
  const navigate = useNavigate();

  const doc = state.documents.find((d) => d.id === id);

  useEffect(() => {
    if (!doc) {
      navigate("/", { replace: true });
    }
  }, [doc, navigate]);

  if (!doc) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        &larr; Back
      </button>

      <h1 className={styles.title}>{doc.title}</h1>

      <div className={styles.meta}>
        <span>{doc.actualWordCount} words</span>
        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
        <span>{formatDuration(doc.actualDurationSeconds)}</span>
      </div>

      <div className={styles.content}>{doc.content}</div>
    </div>
  );
}