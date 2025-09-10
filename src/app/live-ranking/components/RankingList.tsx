import { motion } from "framer-motion";
import React from "react";

import ParticipantCard from "./ParticipantCard";
import { Participant } from "./types";

interface RankingListProps {
  participants: Participant[];
  currentlyVotingId?: number;
}

const RankingList: React.FC<RankingListProps> = ({
  participants,
  currentlyVotingId,
}) => {
  const topThree = participants.slice(0, 3);
  const rest = participants.slice(3);

  return (
    <div className="w-full flex flex-col h-full max-w-6xl mx-auto">
      {/* Top 3 - Fixos no topo */}
      <div className="flex-shrink-0 mb-6">
        <motion.div layout className="relative space-y-3">
          {topThree.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              rank={index + 1}
              isCurrentlyVoting={participant.id === currentlyVotingId}
            />
          ))}
        </motion.div>
      </div>

      {/* Resto dos participantes - Com scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <motion.div layout className="relative space-y-2">
          {rest.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              rank={index + 4}
              isCurrentlyVoting={participant.id === currentlyVotingId}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RankingList;
