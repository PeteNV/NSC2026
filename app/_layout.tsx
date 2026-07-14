import "../global.css";

import { ThemeModeProvider, useThemeMode } from "@/hooks/useThemeMode";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../assets/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { scheme } = useThemeMode();

  /* Theme mapped from JSON */
  const activeTheme = theme[scheme];

  const navTheme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={activeTheme}>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeModeProvider>
            <RootLayoutContent />
          </ThemeModeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}
