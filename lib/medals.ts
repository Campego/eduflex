// lib/medals.ts
export async function awardMedal(courseId: number, medalType: string) {
  const res = await fetch("/api/award-medal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, medalType }),
  });

  if (!res.ok) throw new Error("Failed to award medal");
  return res.json();
}
