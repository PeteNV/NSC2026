import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

/**
 * A indicator that show the currently selected floor and allow user to switch it
 * @param param0
 * @returns
 */
const FloorIndicator = ({ floorCount = 4 }: { floorCount?: number }) => {
  const { colors } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState(1);

  if (floorCount <= 1) return;

  return (
    <View>
      <View style={styles.buttons}>
        {Array.from({ length: floorCount }, (_, i) => i + 1).map(
          (floor, index) => {
            const isSelected = floor === selectedFloor;
            const isFirst = index === 0;
            const isLast = index === floorCount - 1;
            return (
              <View
                key={floor}
                style={[
                  styles.baseButton,
                  isFirst && styles.leftButton,
                  isLast && styles.rightButton,
                  !isFirst && !isLast && styles.centerButton,
                  {
                    backgroundColor: isSelected
                      ? colors.secondary
                      : colors.secondaryContainer,
                  },
                ]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    margin: 10,
    gap: 5,
    justifyContent: "center",
  },
  baseButton: {
    width: "25%",
  },
  leftButton: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  centerButton: {
    borderRadius: 5,
  },
  rightButton: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
});

export default FloorIndicator;
