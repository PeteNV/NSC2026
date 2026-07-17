import OptionCards from "./OptionCards";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const OPTIONS = [
  "Daily",
  "A few times a week",
  "Mostly weekends",
  "Rarely / Eat out mostly",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CookingFrequencySlide({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View className="px-6 pt-8">
      <Text
        variant="titleLarge"
        style={{ color: colors.onSurface, marginBottom: 24 }}
      >
        How often do you cook at home?
      </Text>
      <OptionCards options={OPTIONS} selected={value} onSelect={onChange} />
    </View>
  );
}
