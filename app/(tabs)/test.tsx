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
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ color: colors.onBackground }}>Hello</Text>
      <Button mode={"contained"}>Test Button</Button>
    </View>
  );
};
export default Test;
