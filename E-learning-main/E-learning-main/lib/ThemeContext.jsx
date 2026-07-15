"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("studee_theme");
      if (savedTheme === "light") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark", "theme-dark");
        document.documentElement.classList.add("theme-light");
      } else {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark", "theme-dark");
        document.documentElement.classList.remove("theme-light");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark", "theme-dark");
          document.documentElement.classList.remove("theme-light");
          localStorage.setItem("studee_theme", "dark");
        } else {
          document.documentElement.classList.remove("dark", "theme-dark");
          document.documentElement.classList.add("theme-light");
          localStorage.setItem("studee_theme", "light");
        }
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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
