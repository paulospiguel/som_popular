"use client";

import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useLocalTheme } from "../hooks/useLocalTheme";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, mounted } = useLocalTheme();

  if (!mounted) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    if (checked !== isDark) {
      toggleTheme();
    }
  };

  return (
    <div className="flex items-center space-x-3 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <div className="flex items-center space-x-2">
        <Sun className="w-4 h-4 text-dourado-claro" />
        <span className="text-sm font-medium text-white">Claro</span>
      </div>

      <Switch checked={isDark} onCheckedChange={handleToggle} size="sm" />

      <div className="flex items-center space-x-2">
        <Moon className="w-4 h-4 text-verde-claro" />
        <span className="text-sm font-medium text-white">Escuro</span>
      </div>
    </div>
  );
};

export default ThemeToggle;
