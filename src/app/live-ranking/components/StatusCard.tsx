import React from "react";

import AnimatedNumber from "./AnimatedNumber";
import { Participant } from "./types";

interface StatusCardProps {
  artist: Participant | null;
  title: string;
  isCurrent?: boolean;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const StatusCard: React.FC<StatusCardProps> = ({
  artist,
  title,
  isCurrent = false,
}) => {
  if (!artist) {
    return (
      <div className="h-full w-full bg-verde-muito-suave/50 dark:bg-slate-700/50 rounded-lg p-4 animate-pulse"></div>
    );
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.classList.add("p-4"); // Add more padding for the larger image
  };

  const cardClasses = isCurrent
    ? "bg-gradient-to-br from-verde-suave/40 to-dourado-claro/40 dark:from-slate-700 dark:to-slate-600 border-2 border-verde-suave dark:border-verde-claro animate-pulse-glow"
    : "bg-verde-muito-suave/50 dark:bg-slate-700/50 border-2 border-verde-claro dark:border-slate-600";

  return (
    <div
      className={`rounded-lg p-4 flex items-center transition-all duration-500 ${cardClasses} animate-slide-in`}
    >
      <img
        src={artist.photoUrl}
        alt={artist.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-verde-suave dark:border-verde-claro shadow-lg bg-verde-muito-suave dark:bg-slate-700"
        onError={handleImageError}
      />
      <div className="ml-6 flex-grow">
        <p className="text-xl font-bold text-cinza-chumbo dark:text-white">
          {title}
        </p>
        <h3 className="text-4xl font-bold tracking-wide text-cinza-chumbo dark:text-white">
          {artist.name}
        </h3>
        <p className="text-2xl text-verde-suave dark:text-verde-claro font-semibold">
          {artist.style}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg text-cinza-chumbo dark:text-white">
          {isCurrent ? "Nota Parcial" : "Nota Final"}
        </p>
        <div className="festival-subtitle text-6xl font-bold text-dourado-claro dark:text-yellow-400">
          <AnimatedNumber targetNumber={artist.score} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
