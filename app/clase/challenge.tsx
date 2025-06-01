import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Card } from "./card";

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
  writtenAnswer?: string;
  onWrittenChange?: (value: string) => void;
  onSubmitWritten?: () => void;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  writtenAnswer,
  onWrittenChange,
  onSubmitWritten,
}: ChallengeProps) => {
  if (type === "WRITE") {
    return (
      <div className="flex flex-col gap-4 w-full">
        <textarea
          className="w-full min-h-[120px] rounded border border-gray-300 p-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Escribe tu respuesta aquí..."
          value={writtenAnswer}
          onChange={(e) => onWrittenChange?.(e.target.value)}
          disabled={disabled}
        />
        <button
          className="self-end rounded bg-sky-500 px-4 py-2 text-white disabled:opacity-50"
          onClick={onSubmitWritten}
          disabled={disabled || !writtenAnswer?.trim()}
        >
          Enviar respuesta
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
