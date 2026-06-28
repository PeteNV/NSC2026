import { useTheme } from "@/hooks/useTheme";
import { clsx } from "clsx";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const FloorIndicator = ({ floorCount = 1 }: { floorCount?: number }) => {
  const { colors } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState(1);

  if (floorCount <= 1) return null;

  const BORDER_RADIUS = {
    default: "rounded",
    first: "rounded-r rounded-l-[16]",
    last: "rounded-l rounded-r-[16]",
    selected: "rounded-full",
  };

  return (
    <View className="flex-row justify-center gap-1">
      {Array.from({ length: floorCount }, (_, i) => i + 1).map(
        (floor, index) => {
          const isSelected = floor === selectedFloor;

          let border_radius: keyof typeof BORDER_RADIUS = "default";
          if (isSelected) border_radius = "selected";
          else if (index === 0) border_radius = "first";
          else if (index === floorCount - 1) border_radius = "last";

          return (
            <View
              key={floor}
              className={clsx(
                "h-8 flex-1 justify-center transition-all",
                BORDER_RADIUS[border_radius],
              )}
              style={{
                backgroundColor: isSelected
                  ? colors.secondary
                  : colors.secondaryContainer,
              }}
            >
              <Button onPress={() => setSelectedFloor(floor)}>
                <Text
                  variant="labelLarge"
                  style={{
                    color: isSelected ? colors.onSecondary : colors.secondary,
                  }}
                >
                  F{floor}
                </Text>
              </Button>
            </View>
          );
        },
      )}
    </View>
  );
};

export default FloorIndicator;
