import { motion } from "framer-motion";
import React from "react";

import ParticipantCard from "./ParticipantCard";
import { Participant } from "./types";

interface RankingListProps {
  participants: Participant[];
}

const RankingList: React.FC<RankingListProps> = ({ participants }) => {
  const topThree = participants.slice(0, 3);
  const rest = participants.slice(3);

  return (
    <div className="w-full flex flex-col h-full">
      {/* Top 3 - Fixos no topo */}
      <div className="flex-shrink-0">
        <motion.div layout className="relative">
          {topThree.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              rank={index + 1}
            />
          ))}
        </motion.div>
      </div>

      {/* Resto dos participantes - Com scroll */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        <motion.div layout className="relative">
          {rest.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              rank={index + 4}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RankingList;
