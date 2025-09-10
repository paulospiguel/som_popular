import React from "react";

import StatusCard from "./StatusCard";
import { Participant } from "./types";

interface FooterProps {
  currentArtist: Participant | null;
  previousArtist: Participant | null;
}

const Footer: React.FC<FooterProps> = ({ currentArtist, previousArtist }) => {
  return (
    <footer className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-verde-suave/20 dark:border-slate-700 shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatusCard artist={previousArtist} title="Artista Anterior" />
          </div>
          <div className="lg:col-span-2">
            <StatusCard
              artist={currentArtist}
              title="Votando Agora"
              isCurrent={true}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
