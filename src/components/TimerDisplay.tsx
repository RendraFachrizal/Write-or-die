import styles from "./TimerDisplay.module.css";

interface Props {
  formattedTime: string;
  secondsRemaining: number;
}

export default function TimerDisplay({ formattedTime, secondsRemaining }: Props) {
  const isWarning = secondsRemaining <= 60 && secondsRemaining > 0;
  const isExpired = secondsRemaining === 0;

  return (
    <span
      className={`${styles.timer} ${isWarning ? styles.warning : ""} ${isExpired ? styles.expired : ""}`}
    >
      {formattedTime}
    </span>
  );
}