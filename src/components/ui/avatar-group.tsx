"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar } from "./avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

interface AvatarGroupProps {
  items: Array<{
    id: string;
    name: string;
    avatar?: string | null;
    email?: string;
    description?: string;
    category?: string;
    experience?: string;
    status?: string;
    isActive?: boolean;
  }>;
  maxVisible?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onAvatarClick?: (item: any) => void;
  onShowAll?: () => void;
  type?: "judges" | "participants";
}

export function AvatarGroup({
  items,
  maxVisible = 5,
  size = "md",
  className,
  onAvatarClick,
  onShowAll,
  type = "participants",
}: AvatarGroupProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  const getStatusColor = (item: any) => {
    if (type === "judges") {
      return item.isActive ? "border-green-400" : "border-red-400";
    }

    const colors = {
      approved: "border-green-400",
      pending: "border-yellow-400",
      rejected: "border-red-400",
    };
    return colors[item.status as keyof typeof colors] || "border-gray-400";
  };

  const formatCategory = (category: string) => {
    const categories = {
      fado: "Fado",
      guitarra: "Guitarra Portuguesa",
      cavaquinho: "Cavaquinho",
      concertina: "Concertina",
      viola: "Viola Campaniça",
      cante: "Cante Alentejano",
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatExperience = (experience: string) => {
    const experiences = {
      iniciante: "Iniciante",
      intermedio: "Intermédio",
      avancado: "Avançado",
    };
    return experiences[experience as keyof typeof experiences] || experience;
  };

  if (items.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        Nenhum {type === "judges" ? "jurado" : "participante"} vinculado
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Avatars visíveis */}
      <div className="flex -space-x-2">
        {visibleItems.map((item) => (
          <HoverCard key={item.id}>
            <HoverCardTrigger asChild>
              <div
                className={cn(
                  "ring-2 ring-white rounded-full transition-transform hover:scale-110 hover:z-10 relative",
                  getStatusColor(item)
                )}
              >
                <Avatar
                  name={item.name}
                  src={item.avatar}
                  size={size}
                  onClick={() => onAvatarClick?.(item)}
                  className="cursor-pointer"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="flex items-start space-x-3">
                <Avatar
                  name={item.name}
                  src={item.avatar}
                  size="lg"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  {item.email && (
                    <p className="text-sm text-gray-600 truncate">
                      {item.email}
                    </p>
                  )}

                  {type === "participants" && (
                    <div className="mt-2 space-y-1">
                      {item.category && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {formatCategory(item.category)}
                          </span>
                          {item.experience && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {formatExperience(item.experience)}
                            </span>
                          )}
                        </div>
                      )}
                      {item.status && (
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded",
                            item.status === "approved" &&
                              "bg-green-100 text-green-700",
                            item.status === "pending" &&
                              "bg-yellow-100 text-yellow-700",
                            item.status === "rejected" &&
                              "bg-red-100 text-red-700"
                          )}
                        >
                          {item.status === "approved" && "Aprovado"}
                          {item.status === "pending" && "Pendente"}
                          {item.status === "rejected" && "Rejeitado"}
                        </span>
                      )}
                    </div>
                  )}

                  {type === "judges" && (
                    <div className="mt-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {item.isActive ? "Ativo" : "Inativo"}
                      </span>
                      {item.description && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Mostrar contagem de restantes */}
      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => {
            setShowAll(true);
            onShowAll?.();
          }}
          className={cn(
            "ring-2 ring-white rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium -ml-2 relative z-10",
            size === "sm" && "w-8 h-8 text-xs",
            size === "md" && "w-10 h-10 text-sm",
            size === "lg" && "w-12 h-12 text-base",
            size === "xl" && "w-16 h-16 text-lg"
          )}
          title={`Ver mais ${remainingCount} ${type === "judges" ? "jurados" : "participantes"}`}
        >
          +{remainingCount}
        </button>
      )}

      {/* Botão para ocultar todos (quando expandido) */}
      {showAll && items.length > maxVisible && (
        <button
          onClick={() => setShowAll(false)}
          className={cn(
            "ring-2 ring-white rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium -ml-2 relative z-10",
            size === "sm" && "w-8 h-8 text-xs",
            size === "md" && "w-10 h-10 text-sm",
            size === "lg" && "w-12 h-12 text-base",
            size === "xl" && "w-16 h-16 text-lg"
          )}
          title="Ocultar"
        >
          −
        </button>
      )}
    </div>
  );
}
