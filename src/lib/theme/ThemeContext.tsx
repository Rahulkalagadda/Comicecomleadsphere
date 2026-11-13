"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";
import { ThemeMode } from "@/types";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "leadsphere_theme_mode";

export function ThemeProvider({
  children,
  initialTheme = "jungle",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);

  const [, startTransition] = useTransition();

  // Read stored preference after hydration & before paint (also repairs dev StrictMode DOM reset)
  useLayoutEffect(() => {
    try {
      const stored = (localStorage.getItem(THEME_STORAGE_KEY) ||
        localStorage.getItem("antigravity_theme_mode")) as ThemeMode | null;
      if (stored === "executive" || stored === "jungle") {
        document.documentElement.setAttribute("data-theme", stored);
        if (stored !== theme) {
          setThemeState(stored);
        }
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    } catch {
      document.documentElement.setAttribute("data-theme", theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize document attribute on change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    startTransition(() => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Safe fallback
      }
      document.documentElement.setAttribute("data-theme", newTheme);
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "executive" ? "jungle" : "executive");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
