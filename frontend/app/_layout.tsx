import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { theme } from "../constants/theme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";


export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  /* Theme mapped from JSON */
  const activeTheme = theme[colorScheme];

  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
