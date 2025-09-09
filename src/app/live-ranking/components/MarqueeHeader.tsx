"use client";

import Image from "next/image";
import React, { useState } from "react";

import { MarqueeMessage } from "../types/marquee";

interface MarqueeHeaderProps {
  messages?: MarqueeMessage[];
  speed?: number;
  pauseOnHover?: boolean;
}

const DEFAULT_MESSAGES: MarqueeMessage[] = [
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
];

const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({
  messages = DEFAULT_MESSAGES,
  speed = 30,
  pauseOnHover = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Cria um array com todas as mensagens duplicadas para o fluxo contínuo
  const allMessages = [...messages, ...messages];

  return (
    <div className="w-full bg-gradient-to-r from-verde-suave to-dourado-claro dark:from-slate-800 dark:to-slate-700 py-2 overflow-hidden relative">
      {/* Gradiente nas bordas para efeito fade - cores que correspondem ao fundo */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-verde-suave via-verde-suave/50 to-transparent dark:from-slate-800 dark:via-slate-800/50 dark:to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-dourado-claro via-dourado-claro/50 to-transparent dark:from-slate-700 dark:via-slate-700/50 dark:to-transparent z-10 pointer-events-none" />

      <div
        className="marquee-container"
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      >
        <div
          className={`marquee-content ${isHovered ? "paused" : ""}`}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {/* Mostra todas as mensagens intercaladas no fluxo contínuo */}
          {allMessages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className="flex items-center text-white dark:text-verde-claro font-semibold text-sm md:text-base whitespace-nowrap mx-8"
            >
              {message.image ? (
                <Image
                  width={24}
                  height={24}
                  src={message.image}
                  alt={message.message}
                  className="w-6 h-6 mr-2 rounded-full object-cover"
                />
              ) : message.icon ? (
                <span className="mr-2 text-lg">{message.icon}</span>
              ) : (
                <span className="mr-2">✨</span>
              )}
              {message.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeHeader;
