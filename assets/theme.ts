import { Platform } from "react-native";
import { MD3DarkTheme, MD3LightTheme, useTheme } from "react-native-paper";
import materialTheme from "./material-theme.json";

/** Material 3 Integration */
export const theme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...materialTheme.schemes.light,
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...materialTheme.schemes.dark,
    },
  },
};

export const Colors = {
  light: {
    text: theme.light.colors.onSurface,
    background: theme.light.colors.primary,
    tint: theme.light.colors.primary,
    icon: theme.light.colors.onSurfaceVariant,
    tabIconDefault: theme.light.colors.onSurfaceVariant,
    tabIconSelected: theme.light.colors.primary,
  },
  dark: {
    text: theme.dark.colors.onSurface,
    background: theme.dark.colors.surface,
    tint: theme.dark.colors.primary,
    icon: theme.dark.colors.onSurfaceVariant,
    tabIconDefault: theme.dark.colors.onSurfaceVariant,
    tabIconSelected: theme.dark.colors.primary,
  },
};

const MyComponent = () => {
  const theme = useTheme();
  console.log(theme.fonts); // See all available font variants
};

/** Font families */
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
