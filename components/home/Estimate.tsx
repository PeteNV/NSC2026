import Card from "@/components/common/Card";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Estimate() {
  const { colors } = useTheme();
  return (
    <Card>
      <Text variant="titleSmall" style={{ color: colors.onSurface }}>
        Usage
      </Text>
      <Text
        variant="displaySmall"
        style={{
          fontSize: 50,
          lineHeight: 55,
          color: colors.onPrimaryContainer,
        }}
      >
        ~{" "}
        <Text
          variant="displayLarge"
          style={{
            fontWeight: "bold",
            fontSize: 50,
            lineHeight: 55,
            color: colors.onPrimaryContainer,
          }}
        >
          1,234{" "}
        </Text>
        <Text
          variant="displaySmall"
          style={{ fontSize: 20, color: colors.onPrimaryContainer }}
        >
          kWh{" "}
        </Text>
      </Text>
      <Text
        variant="bodyMedium"
        style={{ fontWeight: "bold", color: colors.secondary }}
      >
        {" "}
        +520{" "}
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>
          kWh from Base Estimation of 714 kWh{" "}
        </Text>
      </Text>
      <View
        className="mx-2 border-b"
        style={{
          backgroundColor: colors.surfaceContainer,
          borderBottomColor: colors.outline,
        }}
      />
      <View className="w-full flex-row justify-center gap-2">
        <View
          className="flex-1 flex-wrap gap-1 rounded-xl p-3"
          style={{ backgroundColor: colors.surfaceBright }}
        >
          <Text variant="labelMedium" style={{ color: colors.secondary }}>
            Monthly Estimate
          </Text>
          <Text
            variant="bodyLarge"
            style={{ fontSize: 18, color: colors.onPrimaryContainer }}
          >
            ~2,159 Baht
          </Text>
        </View>
        <View
          className="flex-1 flex-wrap gap-1 rounded-xl p-3"
          style={{ backgroundColor: colors.surfaceBright }}
        >
          <Text variant="labelMedium" style={{ color: colors.secondary }}>
            CO2 Footprint
          </Text>
          <Text
            variant="bodyLarge"
            style={{ fontSize: 18, color: colors.onPrimaryContainer }}
          >
            14.79 kg
          </Text>
        </View>
      </View>
      <Button
        icon={"camera"}
        mode="contained"
        onPress={() => alert("Button pressed")}
      >
        View Full Report
      </Button>
    </Card>
  );
}
