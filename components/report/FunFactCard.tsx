import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import { clsx } from "clsx";
import { View } from "react-native";
import { Text } from "react-native-paper";

const FACTS = [
  "Air conditioning can account for more than half of a Thai home's electricity bill during the hot season.",
  "Raising your air conditioner by just 1\u00B0C can cut its energy use by around 10%.",
  "A refrigerator runs 24/7 \u2014 keeping it about three-quarters full helps it stay cold with less power.",
  "Standby power from idle electronics can add up to 10% of a household's electricity use.",
  "LED bulbs use up to 85% less energy than incandescent bulbs and last many times longer.",
  "Washing clothes in cold water can save most of the energy a washing machine uses per load.",
];

const FunFactCard: StylableFC = ({ className, style }) => {
  const { colors } = useTheme();
  const fact = FACTS[new Date().getDate() % FACTS.length];

  return (
    <View
      className={clsx(
        "w-full items-center rounded-t-3xl border border-b-0 px-5 pt-6",
        className,
      )}
      style={[
        { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
        style,
      ]}
    >
      <Text
        variant="labelMedium"
        style={{
          color: colors.onSurfaceVariant,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        Tips!
      </Text>
      <Text
        variant="bodyLarge"
        style={{
          fontWeight: "700",
          textAlign: "center",
          color: colors.onSurface,
        }}
      >
        {fact}
      </Text>
    </View>
  );
};

export default FunFactCard;
