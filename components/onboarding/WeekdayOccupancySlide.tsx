import OptionCards from "./OptionCards";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const OPTIONS = [
  "Everyone",
  "Most people",
  "A few people",
  "Nobody (Out for work/school)",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function WeekdayOccupancySlide({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View className="px-6 pt-8">
      <Text
        variant="titleLarge"
        style={{ color: colors.onSurface, marginBottom: 24 }}
      >
        Who usually stays home on weekdays?
      </Text>
      <OptionCards options={OPTIONS} selected={value} onSelect={onChange} />
    </View>
  );
}
