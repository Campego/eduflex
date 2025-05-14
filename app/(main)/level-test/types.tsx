export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
};

export type ProgressData = {
  attempts: number;
  lastScore: number;
  lastDate: string;
};