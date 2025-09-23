"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AvatarGroup4() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const users = [
    {
      name: "Liam Wilson",
      role: "Designer",
      image: "/avatars/avatar-10.jpg",
    },
    {
      name: "Emma Davis",
      role: "Developer",
      image: "/avatars/avatar-11.jpg",
    },
    {
      name: "Noah Brown",
      role: "Manager",
      image: "/avatars/avatar-12.jpg",
    },
    {
      name: "Olivia Johnson",
      role: "Marketing",
      image: "/avatars/avatar-13.jpg",
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex -space-x-2 *:ring-3 *:ring-background">
        {users.map((user, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Avatar
                className={`transition-transform ${
                  activeIndex === index ? "z-10 scale-110" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm">{user.role}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
