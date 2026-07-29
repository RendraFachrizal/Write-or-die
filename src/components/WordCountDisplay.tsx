import styles from "./WordCountDisplay.module.css";

interface Props {
  wordCount: number;
  goal: number | null;
  progressPercent: number | null;
}

export default function WordCountDisplay({ wordCount, goal, progressPercent }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.count}>
        {wordCount}{goal != null ? ` / ${goal}` : ""} words
      </span>

      {goal != null && progressPercent != null && (
        <div className={styles.bar}>
          <div
            className={`${styles.fill} ${progressPercent >= 100 ? styles.complete : ""}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}