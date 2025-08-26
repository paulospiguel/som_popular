"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
  onClick,
}: AvatarProps) {
  // Gerar iniciais do nome
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Gerar cor baseada no nome (consistente)
  const getBackgroundColor = (fullName: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-gray-500",
    ];

    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const baseClasses = cn(
    "rounded-full flex items-center justify-center font-medium text-white relative overflow-hidden",
    sizeClasses[size],
    onClick && "cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all",
    className
  );

  if (src) {
    return (
      <div
        className={cn(baseClasses, getBackgroundColor(name))}
        onClick={onClick}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => {
            // Se a imagem falhar, esconder a imagem
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback com iniciais caso a imagem não carregue */}
        <span className="relative z-10">{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getBackgroundColor(name))}
      onClick={onClick}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
