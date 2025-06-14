"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { MAX_HEARTS } from "@/constants";
import {
  challengeOptions,
  challenges as challengesSchema,
  userSubscription,
} from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import {
  generateAdaptiveChallenge,
  updateTopicScore,
  submitAdaptiveAnswer,
} from "@/lib/adaptive";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

/* ------------ Tipos ------------ */
type ChallengeType = typeof challengesSchema.$inferSelect;

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (ChallengeType & {
    completed: boolean;
    topicId: number | null;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & { isActive: boolean })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: QuizProps) => {
  const [correctAudio, , correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, , incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage
  );
  const [challenges] = useState(initialLessonChallenges);

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((c) => !c.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [finished, setFinished] = useState(false);
  const [adaptiveQuestion, setAdaptiveQuestion] = useState<Awaited<
    ReturnType<typeof generateAdaptiveChallenge>
  > | null>(null);
  const isAdaptive = Boolean(adaptiveQuestion);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const challenge = challenges[activeIndex];
  console.log("==> current challenge at index", activeIndex, "is", challenge);

  if (!challenge?.topicId) {
    console.error("Challenge sin topicId:", challenge);
    toast.error("Uno de los retos no tiene un topicId válido.");
  }
  const options = isAdaptive
    ? adaptiveQuestion?.options.map(
        (o: { text: string; correct: boolean }, i: number) => ({
          ...o,
          id: i + 1,
        })
      ) ?? []
    : challenge?.challengeOptions ?? [];

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const fetchAdaptive = (topicId: number) => {
    generateAdaptiveChallenge(topicId)
      .then((q) => {
        type Option = { text: string; correct: boolean };

        const shuffledOptions = shuffleArray(q.options as Option[]).map(
          (o, i) => ({
            ...o,
            id: i + 1,
          })
        );
        setAdaptiveQuestion({ ...q, options: shuffledOptions });
        setSelectedOption(undefined);
        setStatus("none");
      })
      .catch(() => toast.error("Error generating question"));
  };

  const onNext = () => {
    if (activeIndex + 1 >= challenges.length) {
      setTimeout(() => {
        setFinished(true);
      }, 100);
    }

    setAdaptiveQuestion(null);
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const handleCorrect = async (topicId: number) => {
    await updateTopicScore({ topicId, correct: true });
    void correctControls.play();
    setStatus("correct");
    setPercentage((prev) =>
      isAdaptive ? prev : prev + 100 / challenges.length
    );
    if (initialPercentage === 100) {
      setHearts((prev) => Math.min(prev + 1, MAX_HEARTS));
    }

    // NUEVO: si fue una pregunta adaptativa, marca el reto original si no está completo
    if (isAdaptive) {
      const originalChallenge = challenges.find(
        (c) => c.topicId === topicId && !c.completed
      );
      if (originalChallenge) {
        await upsertChallengeProgress(originalChallenge.id);
      }
    }

    if (activeIndex + 1 >= challenges.length) {
      setFinished(true);
    }
  };

  const handleWrong = async (topicId: number) => {
    await updateTopicScore({ topicId, correct: false });
    void incorrectControls.play();
    setStatus("wrong");
    setHearts((prev) => Math.max(prev - 1, 0));
  };

  const onContinue = () => {
    if (!selectedOption) return;

    const topicId = isAdaptive ? adaptiveQuestion?.topicId : challenge?.topicId;
    if (!topicId) return;

    const correctOption = options.find(
      (o: { id: number; correct: boolean }) => o.correct
    );
    if (!correctOption) return;

    if (status === "wrong") {
      fetchAdaptive(topicId);
      return;
    }

    if (status === "correct") {
      setStatus("none");
      setSelectedOption(undefined);
      onNext();
      return;
    }

    if (!isAdaptive) {
      if (correctOption.id === selectedOption) {
        startTransition(() => {
          void (async () => {
            try {
              const res = await upsertChallengeProgress(challenge.id);
              if (res?.error === "hearts") {
                openHeartsModal();
                return;
              }
              await handleCorrect(topicId);
            } catch {
              toast.error("Something went wrong.");
            }
          })();
        });
      } else {
        startTransition(() => {
          void (async () => {
            try {
              const res = await reduceHearts(challenge.id);
              if (res?.error === "hearts") {
                openHeartsModal();
                return;
              }
              await handleWrong(topicId);
            } catch {
              toast.error("Something went wrong.");
            }
          })();
        });
      }
    } else {
      const questionId = adaptiveQuestion?.id;
      const selected = options.find(
        (o: { id: number; correct: boolean }) => o.id === selectedOption
      );
      if (!questionId || !selected) return;

      const isCorrect = correctOption.id === selectedOption;

      startTransition(() => {
        void (async () => {
          try {
            await submitAdaptiveAnswer({
              questionId,
              isCorrect,
              answerJson: JSON.stringify(selected),
            });

            if (isCorrect) {
              await handleCorrect(topicId);
            } else {
              await handleWrong(topicId);
            }
          } catch {
            toast.error("Failed to submit adaptive answer");
          }
        })();
      });
    }
  };

  useEffect(() => {
    if (finished) {
      fetch("/api/lessons/award-if-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.awarded) {
            toast.success("🎖 ¡Has ganado una medalla por completar el curso!");
          }
        })
        .catch(() => {
          toast.error("No se pudo otorgar la medalla.");
        });
    }
  }, [finished, lessonId]);

  const isLastQuestion =
    activeIndex >= challenges.length && !isAdaptive && status === "correct";

  if (isLastQuestion || finished) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Buen trabajo!
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={userSubscription?.isActive ? Infinity : hearts}
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() =>{ router.push("/curso")}}
        />
      </>
    );
  }

  const current = isAdaptive ? adaptiveQuestion! : challenge;
  const title =
    current.type === "ASSIST" ? "Select the correct meaning" : current.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>
            <div>
              {current.type === "ASSIST" && (
                <QuestionBubble question={current.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending || status !== "none"}
                type={current.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || (!selectedOption && status === "none")}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
