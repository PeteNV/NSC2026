import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import BarChart from "@/components/report/BarChart";
import FunFactCard from "@/components/report/FunFactCard";
import Button from "@/components/wrapper/Button";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import { calcCostBaht, roomMonthlyKwh, summarizeEnergy } from "@/utils/energy";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const roundUpToStep = (value: number, step: number) =>
  Math.max(step, Math.ceil(value / step) * step);

const formatNumber = (n: number) => Math.round(n).toLocaleString();

export default function ReportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms } = usePersistedRooms();

  const roomData = useMemo(
    () =>
      rooms.map((room) => ({
        label: room.name,
        value: roomMonthlyKwh(room),
      })),
    [rooms],
  );
  const roomMax = roundUpToStep(
    Math.max(...roomData.map((d) => d.value), 0),
    50,
  );

  const summary = useMemo(() => summarizeEnergy(rooms), [rooms]);
  const initialCost = calcCostBaht(summary.baselineKwh);
  const projectedCost = summary.costBaht;
  const savingsPct =
    initialCost > 0
      ? Math.round((1 - projectedCost / initialCost) * 100)
      : 0;
  const costMax = roundUpToStep(Math.max(initialCost, projectedCost), 500);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppBar title="Monthly Report" />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4 pt-4">
          <View className="gap-4 px-4">
            <Card>
              <Text
                variant="headlineSmall"
                style={{ fontWeight: "600", color: colors.onSurface }}
              >
                Rooms
              </Text>
              {roomData.length > 0 ? (
                <BarChart
                  data={roomData}
                  max={roomMax}
                  axisLabels={["0 kWh", `${formatNumber(roomMax)} kWh`]}
                />
              ) : (
                <Text
                  variant="bodyMedium"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Scan a room to see its energy breakdown here.
                </Text>
              )}
            </Card>
            <Card>
              <Text
                variant="titleLarge"
                style={{
                  fontSize: 19,
                  lineHeight: 27,
                  fontWeight: "600",
                  color: colors.onSurface,
                }}
              >
                {savingsPct > 0 ? (
                  <>
                    You are on track to save over{" "}
                    <Text
                      variant="titleLarge"
                      style={{
                        fontSize: 19,
                        lineHeight: 27,
                        fontWeight: "700",
                        color: colors.primary,
                      }}
                    >
                      {savingsPct}%
                    </Text>{" "}
                    of energy bills!
                  </>
                ) : (
                  <>
                    You are on track to spend{" "}
                    <Text
                      variant="titleLarge"
                      style={{
                        fontSize: 19,
                        lineHeight: 27,
                        fontWeight: "700",
                        color: colors.error,
                      }}
                    >
                      {Math.abs(savingsPct)}%
                    </Text>{" "}
                    more than your initial energy bills.
                  </>
                )}
              </Text>
              <BarChart
                data={[
                  { label: "Initial", value: initialCost },
                  { label: "Projected", value: projectedCost },
                ]}
                max={costMax}
                axisLabels={[
                  "0 THB",
                  `${formatNumber(costMax / 2)} THB`,
                  `${formatNumber(costMax)} THB`,
                ]}
              />
            </Card>
            <Button
              mode="text"
              textColor={colors.onSurfaceVariant}
              icon={({ size, color }) => (
                <MaterialIcons name="edit" size={size} color={color} />
              )}
              onPress={() => alert("Button pressed")}
            >
              Edit Initial Energy Consumption
            </Button>
          </View>
          <View className="mt-auto px-4">
            <FunFactCard style={{ paddingBottom: insets.bottom + 24 }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
