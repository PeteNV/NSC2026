import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { theme } from "../static/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";

  /* Theme mapped from JSON */
  const activeTheme = theme[colorScheme];

  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

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
