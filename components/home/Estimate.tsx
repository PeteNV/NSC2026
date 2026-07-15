import Card from "@/components/common/Card";
import { useTheme } from "@/hooks/useTheme";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { summarizeEnergy } from "@/utils/energy";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const kwh = (n: number) => Math.round(n).toLocaleString();

export default function Estimate() {
  const { colors } = useTheme();
  const { rooms } = usePersistedRooms();
  const summary = useMemo(() => summarizeEnergy(rooms), [rooms]);
  const deltaSign = summary.deltaKwh >= 0 ? "+" : "-";
  return (
    <Card style={{ backgroundColor: colors.surfaceContainer }}>
      <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>
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
          {kwh(summary.monthlyKwh)}{" "}
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
        {deltaSign}
        {kwh(Math.abs(summary.deltaKwh))}{" "}
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>
          kWh from Base Estimation of {kwh(summary.baselineKwh)} kWh{" "}
        </Text>
      </Text>
      <View
        className="-mx-4 border-b"
        style={{
          backgroundColor: colors.surfaceContainer,
          borderBottomColor: colors.outlineVariant,
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
            ~{kwh(summary.costBaht)} Baht
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
            {summary.co2Kg.toFixed(2)} kg
          </Text>
        </View>
      </View>
      <Button
        icon={({ size, color }) => (
          <MaterialIcons name="search" size={size} color={color} />
        )}
        mode="contained"
        onPress={() => alert("Button pressed")}
      >
        View Full Report
      </Button>
    </Card>
  );
}
