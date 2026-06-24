import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const Test = () => {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Text style={{ color: colors.onBackground }}>Hello</Text>
      <Button mode={"contained"}>Test Button</Button>
    </View>
  );
};
export default Test;
