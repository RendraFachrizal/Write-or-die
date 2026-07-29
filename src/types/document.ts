export interface WritingDocument {
  id: string;
  title: string;
  content: string;
  wordCountGoal: number | null;
  timerMinutes: number | null;
  actualWordCount: number;
  actualDurationSeconds: number;
  status: "in-progress" | "completed";
  createdAt: string;
  completedAt: string | null;
}