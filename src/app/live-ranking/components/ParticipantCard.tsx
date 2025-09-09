import { motion } from "framer-motion";
import React from "react";

import AnimatedNumber from "./AnimatedNumber";
import { Participant } from "./types";

interface ParticipantCardProps {
  participant: Participant;
  rank: number;
}

const getRankColor = (rank: number) => {
  if (rank === 1)
    return "border-dourado-claro bg-dourado-muito-claro dark:bg-slate-800 dark:border-yellow-400 shadow-dourado-claro/50 dark:shadow-yellow-400/30";
  if (rank === 2)
    return "border-verde-claro bg-verde-muito-suave dark:bg-slate-700 dark:border-green-400 shadow-verde-claro/40 dark:shadow-green-400/30";
  if (rank === 3)
    return "border-vermelho-suave bg-vermelho-muito-suave dark:bg-slate-600 dark:border-red-400 shadow-vermelho-suave/30 dark:shadow-red-400/30";
  return "border-verde-suave bg-verde-muito-suave/50 dark:bg-slate-800/50 dark:border-slate-600";
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  rank,
}) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.classList.add("p-2"); // Add padding to make placeholder look nice
  };

  return (
    <motion.div
      layout="position"
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className={`flex items-center p-2 my-2 rounded-lg border-2 transition-all duration-500 shadow-md ${getRankColor(rank)}`}
    >
      <div className="flex-shrink-0 w-16 text-center festival-subtitle text-4xl font-bold text-verde-suave dark:text-verde-claro">
        {rank}
      </div>
      <img
        src={participant.photoUrl}
        alt={participant.name}
        className="w-16 h-16 rounded-full object-cover mx-4 border-2 border-verde-suave dark:border-verde-claro bg-verde-muito-suave dark:bg-slate-700"
        onError={handleImageError}
      />
      <div className="flex-grow">
        <h3 className="text-2xl font-bold tracking-wide text-cinza-chumbo dark:text-white">
          {participant.name}
        </h3>
        <p className="text-lg text-verde-suave dark:text-verde-claro">
          {participant.style}
        </p>
      </div>
      <div className="flex-shrink-0 w-40 text-right festival-subtitle text-5xl font-bold text-dourado-claro dark:text-yellow-400">
        <AnimatedNumber targetNumber={participant.score} />
      </div>
    </motion.div>
  );
};

export default ParticipantCard;
