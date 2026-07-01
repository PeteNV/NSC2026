import FloorIndicator from "@/components/subcomponents/FloorIndicator";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function NormalButton({ title, onPress, disabled = false }: Props) {
  return (
    <Button mode="contained" onPress={onPress} disabled={disabled}>
      {title}
    </Button>
  );
}

const Map: StylableFC = () => {
  const { colors } = useTheme();
  return (
    <View className="relative flex-1 rounded-lg">
      <FloorIndicator floorCount={4} className="absolute w-full p-4" />
      <View className="flex-1 content-center justify-center">
        <Text
          variant="labelLarge"
          style={{ textAlign: "center", color: colors.secondary }}
        >
          Insert Map Here
        </Text>
      </View>
    </View>
  );
};

export default Map;
