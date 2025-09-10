import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import AnimatedNumber from "./AnimatedNumber";
import { Participant } from "./types";

interface ParticipantCardProps {
  participant: Participant;
  rank: number;
  isCurrentlyVoting?: boolean;
}

const getRankStyle = (rank: number) => {
  if (rank === 1) {
    // OURO - Gradiente dourado suave
    return {
      container:
        "bg-gradient-to-r from-yellow-50/80 via-amber-50/60 to-yellow-50/80 dark:from-yellow-900/15 dark:via-amber-800/10 dark:to-yellow-900/15 border-yellow-200/60 dark:border-yellow-700/40 shadow-md shadow-yellow-100/30 dark:shadow-yellow-900/20",
      rank: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-sm",
      score: "text-yellow-600 dark:text-yellow-400 font-bold",
    };
  }
  if (rank === 2) {
    // PRATA - Gradiente prateado suave
    return {
      container:
        "bg-gradient-to-r from-gray-50/80 via-slate-50/60 to-gray-50/80 dark:from-gray-800/15 dark:via-slate-700/10 dark:to-gray-800/15 border-gray-200/60 dark:border-gray-600/40 shadow-md shadow-gray-100/30 dark:shadow-gray-800/20",
      rank: "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-sm",
      score: "text-gray-600 dark:text-gray-400 font-bold",
    };
  }
  if (rank === 3) {
    // BRONZE - Gradiente bronze suave
    return {
      container:
        "bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 dark:from-orange-900/15 dark:via-amber-800/10 dark:to-orange-900/15 border-orange-200/60 dark:border-orange-700/40 shadow-md shadow-orange-100/30 dark:shadow-orange-900/20",
      rank: "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm",
      score: "text-orange-600 dark:text-orange-400 font-bold",
    };
  }
  return {
    container:
      "bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700",
    rank: "bg-slate-500 text-white",
    score: "text-slate-600 dark:text-slate-400",
  };
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  rank,
  isCurrentlyVoting = false,
}) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.classList.add("p-2");
  };

  const style = getRankStyle(rank);

  return (
    <motion.div
      layout="position"
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className={`flex items-center p-4 my-2 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
        isCurrentlyVoting
          ? "ring-2 ring-blue-400/50 animate-pulse-glow"
          : rank <= 3
            ? "ring-2 ring-opacity-20"
            : ""
      } ${style.container}`}
    >
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${style.rank}`}
        >
          {rank}
        </div>
      </div>

      {/* Profile Image */}
      <div className="flex-shrink-0 ml-4">
        <Image
          width={56}
          height={56}
          src={participant.photoUrl}
          alt={participant.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
          onError={handleImageError}
        />
      </div>

      {/* Participant Info */}
      <div className="flex-grow ml-4 min-w-0">
        <h3 className="text-lg font-family-baloo font-semibold text-gray-900 dark:text-white truncate">
          {participant.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-family-baloo font-medium">
          {participant.style}
        </p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className={`text-3xl font-family-baloo font-bold ${style.score}`}>
          <AnimatedNumber targetNumber={participant.score} />
        </div>
        <p className="text-xs font-family-baloo text-gray-500 dark:text-gray-400 font-medium">
          pontos
        </p>
      </div>
    </motion.div>
  );
};

export default ParticipantCard;
