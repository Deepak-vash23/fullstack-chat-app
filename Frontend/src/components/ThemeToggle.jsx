import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeToggle = () => {
  const { currentTheme, setTheme } = useThemeStore();

  const themes = ["light", "dark", "khargosh"];

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 bg-primary text-white rounded hover:opacity-90 transition-opacity"
    >
      Theme: {currentTheme}
    </button>
  );
};

export default ThemeToggle;
