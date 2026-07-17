import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  location: string;
  people: number;
  weekdayOccupancy: string;
  cookingFrequency: string;
}

export default function SummarySlide({
  location,
  people,
  weekdayOccupancy,
  cookingFrequency,
}: Props) {
  const { colors } = useTheme();

  const summaryItems = [
    { label: "Location", value: location || "\u2014" },
    { label: "Household Size", value: people.toString() },
    { label: "Weekday Occupancy", value: weekdayOccupancy || "\u2014" },
    { label: "Cooking Frequency", value: cookingFrequency || "\u2014" },
  ];

  return (
    <View className="px-6 pt-8">
      <Text
        variant="titleLarge"
        style={{ color: colors.onSurface, marginBottom: 4 }}
      >
        All set!
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: colors.onSurfaceVariant, marginBottom: 24 }}
      >
        Here is a quick summary of your household profile:
      </Text>

      {summaryItems.map((item) => (
        <View
          key={item.label}
          className="mb-4 border-b pb-2"
          style={{ borderColor: colors.surfaceVariant }}
        >
          <Text
            variant="labelMedium"
            style={{
              color: colors.onSurfaceVariant,
              marginBottom: 4,
              fontWeight: "600",
            }}
          >
            {item.label}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
