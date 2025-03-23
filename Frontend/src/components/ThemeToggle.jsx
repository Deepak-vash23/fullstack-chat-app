import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeToggle = () => {
  const { currentTheme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme); // Update the theme in the store
    document.documentElement.classList.toggle("dark", newTheme === "dark"); // Apply dark class to the root element
  };

  return (
    <button onClick={toggleTheme} className="p-2 bg-primary text-white rounded">
      Toggle Theme ({currentTheme})
    </button>
  );
};

export default ThemeToggle;
