import Image from "next/image";
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
      <div className="h-32 w-full bg-gray-100 dark:bg-slate-800 rounded-xl p-6 animate-pulse flex items-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.classList.add("p-4");
  };

  const cardClasses = isCurrent
    ? "bg-gradient-to-br from-verde-suave/20 to-dourado-claro/20 dark:from-verde-claro/20 dark:to-dourado-claro/20 border-2 border-verde-suave dark:border-verde-claro ring-2 ring-verde-suave/20 dark:ring-verde-claro/20"
    : "bg-white/80 dark:bg-slate-800/80 border border-verde-suave/30 dark:border-slate-700";

  const paddingClasses = isCurrent ? "p-8" : "p-6";

  return (
    <div
      className={`rounded-xl ${paddingClasses} flex items-center transition-all duration-300 shadow-sm hover:shadow-md ${cardClasses}`}
    >
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <Image
          width={isCurrent ? 80 : 64}
          height={isCurrent ? 80 : 64}
          src={artist.photoUrl}
          alt={artist.name}
          className={`${isCurrent ? "w-20 h-20" : "w-16 h-16"} rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm`}
          onError={handleImageError}
        />
      </div>

      {/* Artist Info */}
      <div className="ml-4 flex-grow min-w-0">
        <p
          className={`text-lg font-family-baloo font-bold text-gray-600 dark:text-gray-400 mb-1`}
        >
          {title}
        </p>
        <h3
          className={`${isCurrent ? "text-2xl" : "text-xl"} font-family-baloo font-bold text-gray-900 dark:text-white truncate`}
        >
          {artist.name}
        </h3>
        <p
          className={`${isCurrent ? "text-base" : "text-sm"} text-gray-600 dark:text-gray-400 font-family-baloo font-medium`}
        >
          {artist.style}
        </p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <p
          className={`${isCurrent ? "text-sm" : "text-xs"} font-family-baloo text-gray-500 dark:text-gray-400 font-medium mb-1`}
        >
          {isCurrent ? "Nota Parcial" : "Nota Final"}
        </p>
        <div
          className={`${isCurrent ? "text-4xl" : "text-3xl"} font-family-baloo font-bold ${isCurrent ? "text-verde-suave dark:text-verde-claro" : "text-cinza-chumbo dark:text-gray-300"}`}
        >
          <AnimatedNumber targetNumber={artist.score} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
