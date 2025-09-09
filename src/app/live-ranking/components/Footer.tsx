import React from "react";

import StatusCard from "./StatusCard";
import { Participant } from "./types";

interface FooterProps {
  currentArtist: Participant | null;
  previousArtist: Participant | null;
}

const Footer: React.FC<FooterProps> = ({ currentArtist, previousArtist }) => {
  return (
    <footer className="w-full live-ranking-festival dark:bg-slate-800 mt-2 p-4 shadow-inner">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusCard artist={previousArtist} title="Artista Anterior" />
        <StatusCard
          artist={currentArtist}
          title="Votando Agora"
          isCurrent={true}
        />
      </div>
    </footer>
  );
};

export default Footer;
