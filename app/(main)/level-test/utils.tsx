import { ProgressData } from "./types";
import { questions } from "./data";

export const getLevel = (score: number): number => {
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) return 3;
  if (percentage >= 70) return 2;
  return 1;
};

export const saveProgress = (finalScore: number, progress: ProgressData | null): ProgressData => {
  const newLevel = getLevel(finalScore);

  const newProgress: ProgressData = {
    attempts: (progress?.attempts || 0) + 1,
    lastScore: finalScore,
    lastDate: new Date().toLocaleDateString(),
  };

  localStorage.setItem("levelTestProgress", JSON.stringify(newProgress));
  localStorage.setItem("levelTestLevel", String(newLevel)); // Esto puedes usar para /learn
  return newProgress;
};

export const getFeedback = (score: number): string => {
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) return "¡Increíble! Has respondido todas las preguntas correctamente. ¡Eres un genio!";
  if (percentage >= 70) return "¡Buen trabajo! Estás mejorando.";
  return "No te preocupes, sigue practicando y lo lograrás.";
};