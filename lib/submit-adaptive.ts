export async function submitAdaptiveAnswer(payload: {
  questionId: number;
  isCorrect: boolean;
  answerJson: string;
}) {
  const res = await fetch("/api/submit-adaptive-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Error submitting adaptive answer", await res.text());
    throw new Error("Submit failed");
  }

  return res.json();
}
