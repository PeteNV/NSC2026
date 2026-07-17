import { Pressable, View } from "react-native";
import { RadioButton, Text, useTheme } from "react-native-paper";

interface Props {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function OptionCards({ options, selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <RadioButton.Group onValueChange={onSelect} value={selected}>
      <View className="gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <Pressable
              key={option}
              className="flex-row items-center rounded-md border px-4 py-4"
              style={{
                borderColor: isSelected
                  ? colors.primaryContainer
                  : colors.outlineVariant,
                backgroundColor: isSelected
                  ? colors.primaryContainer
                  : "transparent",
              }}
              onPress={() => onSelect(option)}
            >
              <RadioButton
                value={option}
                color={colors.primary}
                uncheckedColor={colors.onSurfaceVariant}
              />
              <Text
                variant="bodyLarge"
                style={{
                  color: isSelected ? colors.primary : colors.onSurface,
                  flex: 1,
                }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </RadioButton.Group>
  );
}
