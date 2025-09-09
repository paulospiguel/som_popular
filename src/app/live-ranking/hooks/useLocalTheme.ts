"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useLocalTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Carrega o tema salvo do localStorage
    const savedTheme = localStorage.getItem("live-ranking-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Salva o tema no localStorage
      localStorage.setItem("live-ranking-theme", theme);

      // Aplica a classe dark ao body apenas quando estiver na página de live ranking
      if (theme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: theme === "dark",
  };
}
