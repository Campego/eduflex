"use client";

import { useEffect, useState } from "react";
import { questions } from "./data";
import { getLevel, getFeedback, saveProgress } from "./utils";
import { ProgressData } from "./types";
import './styles.css';

export default function LevelTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("levelTestProgress");
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      const newProgress = saveProgress(finalScore, progress);
      setProgress(newProgress);

      if (finalScore === questions.length) {
        setShowPopup(true);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowPopup(false);
  };

  return (
    <main className="test-container">
      <h1 className="title">Test de Nivel</h1>

      {progress && (
        <div className="progress">
          <p>Intentos anteriores: <strong>{progress.attempts}</strong></p>
          <p>Último puntaje: <strong>{progress.lastScore}</strong> / {questions.length}</p>
          <p>Fecha: <strong>{progress.lastDate}</strong></p>
        </div>
      )}

      {!showResult ? (
        <div className="question-container">
          <h2 className="question-title">
            Pregunta {currentQuestion + 1} de {questions.length}
          </h2>
          <p className="question">{questions[currentQuestion].question}</p>

          <div className="options-container">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="option-button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">¡Test finalizado!</h2>
          <p className="result-text">Puntaje: <strong>{score}</strong> / {questions.length}</p>
          <p className="feedback">{getFeedback(score)}</p>

          {showPopup && (
            <div className="popup">
              <h3>¡Felicidades!</h3>
              <p>Has respondido todas las preguntas correctamente.</p>
            </div>
          )}

          <button
            onClick={handleRetry}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      )}
    </main>
  );
}
