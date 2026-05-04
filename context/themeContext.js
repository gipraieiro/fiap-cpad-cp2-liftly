import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors =
    theme === "dark"
      ? {
          backgroundColor: "#121212",
          textColor: "#ffffff",
          buttonColor: "#6200ee",
        }
      : {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          buttonColor: "#bb86fc",
        };

  return (
    <ThemeContext.Provider value={{ ...colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}