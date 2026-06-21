import type { AppTheme } from "@/types/theme";
import { useTheme as usePaperTheme } from "react-native-paper";

export function useTheme() {
  return usePaperTheme<AppTheme>();
}
