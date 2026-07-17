import { theme } from "@/assets/theme";
import type MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps, FC } from "react";
import type { ViewStyle } from "react-native";

/**
 * Global app theme type that extend on React Native Paper's theme.
 */
export type AppTheme = typeof theme.light;
/**
 * A function component stylable through `className` and `style`.
 */
export type StylableFC<Props extends {} = {}> = FC<
  Props & { className?: string; style?: ViewStyle }
>;
/**
 * Material Icons name.
 */
export type IconName = ComponentProps<typeof MaterialIcons>["name"];
