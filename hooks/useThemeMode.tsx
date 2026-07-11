import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: "light" | "dark";
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
);

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const systemScheme: "light" | "dark" =
    useColorScheme() === "dark" ? "dark" : "light";
  const [mode, setMode] = useState<ThemeMode>("system");

  const value = useMemo<ThemeModeContextValue>(() => {
    const scheme: "light" | "dark" = mode === "system" ? systemScheme : mode;
    return { mode, setMode, scheme };
  }, [mode, systemScheme]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}
