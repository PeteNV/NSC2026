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
    <View
      className="h-full w-full min-w-0 flex-1 flex-shrink-0 flex-wrap
        content-center justify-center rounded-lg border-2"
    >
      <Text
        variant="labelLarge"
        style={{ textAlign: "center", color: colors.secondary }}
      >
        Insert Map Here
      </Text>
    </View>
  );
};

export default Map;
