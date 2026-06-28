import { theme } from "@/assets/theme";
import { FC } from "react";
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
