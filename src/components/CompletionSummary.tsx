import { formatDuration } from "../lib/format";
import styles from "./CompletionSummary.module.css";

interface Props {
  wordCount: number;
  durationSeconds: number;
  onBack: () => void;
}

export default function CompletionSummary({ wordCount, durationSeconds, onBack }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>Session Complete</h2>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.value}>{wordCount}</span>
            <span className={styles.label}>words written</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.value}>{formatDuration(durationSeconds)}</span>
            <span className={styles.label}>time elapsed</span>
          </div>
        </div>

        <button className={styles.backButton} onClick={onBack}>
          Back to Documents
        </button>
      </div>
    </div>
  );
}