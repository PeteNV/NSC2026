import Button from "@/components/wrapper/Button";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import React, { useState } from "react";
import { View } from "react-native";

/**
 * A indicator that show the currently selected floor and allow user to switch it
 * @param floorCount The number of floor to display
 * @returns
 */
const FloorIndicator: StylableFC<{ floorCount?: number }> = ({
  floorCount = 1,
}) => {
  const { colors } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState(1);

  if (floorCount <= 1) return null;

  return (
    <View className="flex-row justify-center gap-1">
      {Array.from({ length: floorCount }, (_, i) => i + 1).map(
        (floor, index) => {
          const isSelected = floor === selectedFloor;

          let borderRadius: number = 4;
          if (isSelected) borderRadius = 9999;
          else if (index === 0) borderRadius = 16;
          else if (index === floorCount - 1) borderRadius = 16;

          let borderTopRightRadius = borderRadius;
          let borderBottomRightRadius = borderRadius;
          let borderTopLeftRadius = borderRadius;
          let borderBottomLeftRadius = borderRadius;

          if (!isSelected) {
            if (index === 0) {
              borderTopRightRadius = 4;
              borderBottomRightRadius = 4;
              borderTopLeftRadius = 16;
              borderBottomLeftRadius = 16;
            } else if (index === floorCount - 1) {
              borderTopRightRadius = 16;
              borderBottomRightRadius = 16;
              borderTopLeftRadius = 4;
              borderBottomLeftRadius = 4;
            }
          }

          return (
            <Button
              key={floor}
              mode="contained"
              onPress={() => setSelectedFloor(floor)}
              buttonColor={
                isSelected ? colors.secondary : colors.secondaryContainer
              }
              textColor={isSelected ? colors.onSecondary : colors.secondary}
              style={{
                flex: 1,
                borderRadius,
                borderTopRightRadius,
                borderBottomRightRadius,
                borderTopLeftRadius,
                borderBottomLeftRadius,
              }}
            >
              F{floor}
            </Button>
          );
        },
      )}
    </View>
  );
};

export default FloorIndicator;
