import "../global.css";

import { ThemeModeProvider, useThemeMode } from "@/hooks/useThemeMode";
import { ScanResultProvider } from "@/hooks/useScanResult";
import { UserProvider, useUser } from "@/hooks/useUser";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../assets/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function OnboardingGuard() {
  const { onboarded, loaded } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;
    if (!onboarded && segments[0] !== "onboarding") {
      router.replace("/onboarding");
    }
  }, [onboarded, loaded, segments, router]);

  return null;
}

function RootLayoutContent() {
  const { scheme } = useThemeMode();

  /* Theme mapped from JSON */
  const activeTheme = theme[scheme];

  const navTheme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={activeTheme}>
      <ThemeProvider value={navTheme}>
        <ScanResultProvider>
          <UserProvider>
            <OnboardingGuard />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="scanner"
                options={{
                  headerShown: false,
                  presentation: "fullScreenModal",
                  animation: "slide_from_bottom",
                }}
              />
            </Stack>
          </UserProvider>
        </ScanResultProvider>
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
