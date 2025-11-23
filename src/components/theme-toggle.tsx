"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-lg bg-slate-200 dark:bg-slate-700 transition-colors z-50">
        <div className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={clsx(
        "fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-lg shadow-lg transition-all duration-300 z-50",
        "bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600",
        "dark:from-indigo-500 dark:to-purple-600 dark:hover:from-indigo-600 dark:hover:to-purple-700",
        "transform hover:scale-110 active:scale-95"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      ) : (
        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      )}
    </button>
  );
}
