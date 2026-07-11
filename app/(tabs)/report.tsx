import AppBar from "@/components/common/AppBar";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 gap-4"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title="Report" />
      <Text className="px-4">Report Screen</Text>
    </View>
  );
}
