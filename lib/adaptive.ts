// lib/adaptive.ts
export async function generateAdaptiveChallenge(topicId: number) {
  const res = await fetch("/api/generate-adaptive-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId }),
  });

  if (!res.ok) throw new Error("Adaptive generation failed");
  return res.json(); // { type, question, options }
}

export async function updateTopicScore({
  topicId,
  correct,
}: {
  topicId: number;
  correct: boolean;
}) {
  await fetch("/api/update-topic-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId, correct }),
  });
}

// /lib/adaptive.ts
export async function submitAdaptiveAnswer(payload: {
  questionId: number;
  isCorrect: boolean;
  answerJson: string;
}) {
  const res = await fetch("/api/submit-adaptive-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}
