import { useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentContext";
import { formatDuration } from "../lib/format";
import styles from "./DocumentList.module.css";

export default function DocumentList() {
  const { state, dispatch } = useDocuments();
  const navigate = useNavigate();

  const sorted = [...state.documents].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  const inProgress = state.documents.find((d) => d.status === "in-progress");

  function handleResume(id: string) {
    navigate(`/write/${id}`);
  }

  function handleDiscard(id: string) {
    if (window.confirm("Discard this session? This cannot be undone.")) {
      dispatch({ type: "DELETE_DOCUMENT", payload: id });
    }
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm("Delete this document? This cannot be undone.")) {
      dispatch({ type: "DELETE_DOCUMENT", payload: id });
    }
  }

  return (
    <div className={styles.page}>
      {inProgress && (
        <div className={styles.recoveryBanner}>
          <p>
            You have an unfinished session: <strong>{inProgress.title}</strong>
          </p>
          <div className={styles.recoveryActions}>
            <button
              className={styles.resumeButton}
              onClick={() => handleResume(inProgress.id)}
            >
              Resume
            </button>
            <button
              className={styles.discardButton}
              onClick={() => handleDiscard(inProgress.id)}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <h1>WriteOrDie</h1>
        <button className={styles.newButton} onClick={() => navigate("/new")}>
          New Document
        </button>
      </div>

      {sorted.length === 0 && (
        <p className={styles.empty}>
          No documents yet. Start your first writing session!
        </p>
      )}

      {sorted.length > 0 && (
        <ul className={styles.list}>
          {sorted.map((doc) => (
            <li
              key={doc.id}
              className={styles.item}
              onClick={() => navigate(`/view/${doc.id}`)}
            >
              <div className={styles.title}>{doc.title}</div>
              <div className={styles.meta}>
                <span>{doc.actualWordCount} words</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                <span>
                  {doc.status === "completed"
                    ? formatDuration(doc.actualDurationSeconds)
                    : "In progress"}
                </span>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDelete(doc.id, e)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}