"use client";

import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

interface DiplomaClientProps {
  medal: {
    user: { userName: string };
    medalType: string;
    dateAwarded: string;
    medalId: string;
    course: {
      medalImageName?: string | null;
    };
  };
}

export default function DiplomaClient({ medal }: DiplomaClientProps) {
  const formattedDate = new Date(medal.dateAwarded).toLocaleDateString(
    "es-PE",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleDownload = () => {
    const diploma = document.getElementById("diploma");
    if (diploma) {
      html2pdf()
        .set({ filename: `diploma-${medal.medalId}.pdf` })
        .from(diploma)
        .save();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      <div
        id="diploma"
        className="mx-auto w-full max-w-2xl border border-dashed border-gray-400 p-10 text-center"
      >
        <h1 className="mb-4 text-3xl font-bold text-blue-800">DIPLOMA</h1>
        <p className="mb-2 text-lg">
          Otorgado a <strong>{medal.user.userName}</strong>
        </p>
        <p className="mb-4 text-gray-600">por completar exitosamente</p>
        <h2 className="mb-4 text-xl font-semibold">{medal.medalType}</h2>
        <p className="mb-6 text-sm text-gray-500">
          Fecha de otorgamiento: {formattedDate}
        </p>
        <Image
          src={`/medallas/${medal.course.medalImageName}`}
          alt="Medalla"
          width={120}
          height={120}
          className="mx-auto"
        />
        <p className="mt-6 text-sm text-gray-400">
          ID de la medalla: {medal.medalId}
        </p>
      </div>
    </div>
  );
}
