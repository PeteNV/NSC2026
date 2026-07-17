import AppBar from "@/components/common/AppBar";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Test = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title="Test" />
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <Text style={{ color: colors.onBackground }}>Hello</Text>
        <Button mode={"contained"}>Test Button</Button>
      </View>
    </View>
  );
};
export default Test;
