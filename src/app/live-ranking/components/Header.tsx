"use client";

import { Menu, Moon, Sun, Undo2 } from "lucide-react";
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
    <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-verde-suave/20 dark:border-slate-700 shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo/Title Section */}
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-family-rye md:text-5xl text-verde-suave dark:text-verde-claro tracking-wide">
              SOM POPULAR FESTIVAL
            </h1>
            <p className="text-lg md:text-xl font-family-baloo text-terra dark:text-verde-claro font-semibold tracking-wider mt-2">
              1ª EDIÇÃO
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex text-terra items-center justify-center w-12 h-12 rounded-xl"
                  aria-label="Opções"
                >
                  <Menu className="w-6 h-6 text-terra dark:text-gray-300" />
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
      </div>
    </header>
  );
};

export default Header;
