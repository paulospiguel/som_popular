"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AvatarGroupProps {
  items: AvatarItem[];
  maxVisible?: number;
  size: "sm" | "md" | "lg";
  type: "judges" | "participants";
}

interface AvatarItem {
  id: string;
  name: string;
  avatar: string;
  description?: string;
}

export default function AvatarGroup({
  items,
  maxVisible = 5,
}: AvatarGroupProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex -space-x-2 *:ring-3 *:ring-background">
        {items?.slice(0, maxVisible).map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Avatar
                key={index}
                className={`transition-transform ${
                  activeIndex === index ? "z-10 scale-110" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback>
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm">{item.description || ""}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {items.length > maxVisible && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="transition-transform">
                <AvatarFallback>+</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
