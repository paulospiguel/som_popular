"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Footer from "./components/Footer";
import Header from "./components/Header";
import MarqueeHeader from "./components/MarqueeHeader";
import RankingList from "./components/RankingList";
import { Participant, ParticipantStyle } from "./components/types";
import { MarqueeMessage } from "./types/marquee";

const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 1,
    name: "Luna Keys",
    style: ParticipantStyle.VOCAL,
    photoUrl: "https://picsum.photos/seed/luna/200",
    score: 0,
  },
  {
    id: 2,
    name: "The Cosmic Riffs",
    style: ParticipantStyle.BAND,
    photoUrl: "https://picsum.photos/seed/cosmic/200",
    score: 0,
  },
  {
    id: 3,
    name: "Echo & Nova",
    style: ParticipantStyle.DUO,
    photoUrl: "https://picsum.photos/seed/echo/200",
    score: 0,
  },
  {
    id: 4,
    name: "Axel Fury",
    style: ParticipantStyle.VOCAL,
    photoUrl: "https://picsum.photos/seed/axel/200",
    score: 0,
  },
  {
    id: 5,
    name: "Starlight Syndicate",
    style: ParticipantStyle.BAND,
    photoUrl: "https://picsum.photos/seed/starlight/200",
    score: 0,
  },
  {
    id: 6,
    name: "Binary Beats",
    style: ParticipantStyle.DUO,
    photoUrl: "https://picsum.photos/seed/binary/200",
    score: 0,
  },
  {
    id: 7,
    name: "Serena Voice",
    style: ParticipantStyle.VOCAL,
    photoUrl: "https://picsum.photos/seed/serena/200",
    score: 0,
  },
  {
    id: 8,
    name: "Gravity Grooves",
    style: ParticipantStyle.BAND,
    photoUrl: "https://picsum.photos/seed/gravity/200",
    score: 0,
  },
];

const LiveRanking: React.FC = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");
  const [participants, setParticipants] =
    useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [currentlyVotingIndex, setCurrentlyVotingIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mensagens customizadas para o marquee
  const marqueeMessages: MarqueeMessage[] = [
    {
      id: "1",
      message: "Festival Som Popular - Edição Estelar 2024",
      icon: "🎵",
    },
    {
      id: "2",
      message: "Acompanhe o ranking em tempo real!",
      icon: "🌟",
    },
    {
      id: "3",
      message: "Parabéns a todos os participantes!",
      icon: "🏆",
    },
    {
      id: "4",
      message: "Próxima apresentação em breve...",
      icon: "🎤",
    },
    {
      id: "5",
      message: "Siga-nos nas redes sociais!",
      icon: "📱",
    },
    {
      id: "6",
      message: "Obrigado por participar do nosso festival!",
      icon: "🎪",
    },
    {
      id: "7",
      message: "A arte da música popular em destaque!",
      icon: "🎭",
    },
    {
      id: "8",
      message: "Criatividade e talento em cada apresentação!",
      icon: "🎨",
    },
    {
      id: "9",
      message: "Música que toca a alma!",
      icon: "🎼",
    },
    {
      id: "10",
      message: "Talentos incríveis se apresentando!",
      icon: "🎤",
    },
    {
      id: "11",
      message: "Patrocinado por: Empresa Musical",
      image: "https://picsum.photos/seed/sponsor/40",
    },
  ];

  // Limpa a classe dark quando sair da página
  useEffect(() => {
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const votingInterval = setInterval(() => {
      setParticipants((prevParticipants) => {
        const newParticipants = [...prevParticipants];
        const artist = newParticipants[currentlyVotingIndex];

        // Simulate 4 judges giving scores between 7.5 and 10.0
        const judge1 = Math.random() * 2.5 + 7.5;
        const judge2 = Math.random() * 2.5 + 7.5;
        const judge3 = Math.random() * 2.5 + 7.5;
        const judge4 = Math.random() * 2.5 + 7.5;

        artist.score = parseFloat(
          ((judge1 + judge2 + judge3 + judge4) / 4).toFixed(2)
        );

        return newParticipants;
      });

      // After scores are revealed, move to the next artist
      const nextArtistTimeout = setTimeout(() => {
        setCurrentlyVotingIndex(
          (prevIndex) => (prevIndex + 1) % participants.length
        );
      }, 5000); // Wait 5 seconds before switching

      return () => clearTimeout(nextArtistTimeout);
    }, 10000); // A new artist is voted every 10 seconds

    return () => clearInterval(votingInterval);
  }, [currentlyVotingIndex, participants.length, isPaused]);

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.score - a.score);
  }, [participants]);

  const currentlyVoting = participants[currentlyVotingIndex];
  const previouslyVotedIndex =
    currentlyVotingIndex === 0
      ? participants.length - 1
      : currentlyVotingIndex - 1;
  const previouslyVoted = participants[previouslyVotedIndex];

  return (
    <main
      className="h-screen w-screen bg-gradient-to-br from-verde-muito-suave via-bege-claro to-dourado-muito-claro dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-cinza-chumbo dark:text-white font-sans flex flex-col"
      onClick={() => setIsPaused((p) => !p)} // Click anywhere to pause/resume
    >
      <MarqueeHeader
        messages={marqueeMessages}
        speed={60}
        pauseOnHover={true}
      />
      <Header eventId={eventId} />
      <div className="flex-1 container mx-auto px-4 py-2 flex flex-col min-h-0">
        <RankingList participants={sortedParticipants} />
      </div>
      <Footer
        currentArtist={currentlyVoting}
        previousArtist={previouslyVoted}
      />
    </main>
  );
};

export default LiveRanking;
