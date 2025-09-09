"use client";

import { Moon, MoreVertical, Sun, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import { useLocalTheme } from "../hooks/useLocalTheme";

const Header: React.FC<{ eventId?: string | null }> = ({ eventId }) => {
  const router = useRouter();
  const { isDark, toggleTheme, mounted } = useLocalTheme();

  if (!mounted) return null;

  return (
    <header className="w-full text-center p-4 live-ranking-festival dark:bg-slate-800 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
          <h1 className="text-5xl festival-title font-bold text-dourado-claro tracking-widest dark:text-verde-claro">
            SOM POPULAR FESTIVAL
          </h1>
          <p className="text-xl text-terra font-family-orbitron dark:text-verde-claro font-semibold tracking-wider mt-1">
            1ª EDIÇÃO
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center p-2 rounded-lg bg-terra hover:bg-terra/80 dark:hover:bg-white/20 dark:bg-white/10 backdrop-blur border dark:border-white/20 transition"
                aria-label="Opções"
              >
                <MoreVertical className="w-5 h-5 text-terra dark:text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              <DropdownMenuItem asChild>
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDark ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Tema claro</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Tema escuro</span>
                      </>
                    )}
                  </div>
                  <Switch checked={isDark} onCheckedChange={toggleTheme} />
                </div>
              </DropdownMenuItem>
              {eventId && (
                <DropdownMenuItem
                  onClick={() => router.push(`/ranking/${eventId}`)}
                  className="flex items-center gap-2"
                >
                  <Undo2 className="w-4 h-4" /> Voltar ao ranking
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
