import materialTheme from '../assets/material-theme.json';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Platform } from 'react-native';

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
    text: materialTheme.schemes.light.onSurface,
    background: materialTheme.schemes.light.surface,
    tint: materialTheme.schemes.light.primary,
    icon: materialTheme.schemes.light.onSurfaceVariant,
    tabIconDefault: materialTheme.schemes.light.onSurfaceVariant,
    tabIconSelected: materialTheme.schemes.light.primary,
  },
  dark: {
    text: materialTheme.schemes.dark.onSurface,
    background: materialTheme.schemes.dark.surface,
    tint: materialTheme.schemes.dark.primary,
    icon: materialTheme.schemes.dark.onSurfaceVariant,
    tabIconDefault: materialTheme.schemes.dark.onSurfaceVariant,
    tabIconSelected: materialTheme.schemes.dark.primary,
  },
};

/** Font families */
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
