import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import BarChart from "@/components/report/BarChart";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { calcCo2Kg, calcCostBaht, roomMonthlyKwh, summarizeEnergy } from "@/utils/energy";
import {
  provinceComparison,
  provinceTierComparison,
  provinceTierPerPersonComparison,
} from "@/utils/provincial-baseline";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const roundUpToStep = (value: number, step: number) =>
  Math.max(step, Math.ceil(value / step) * step);

const formatNumber = (n: number) => Math.round(n).toLocaleString();

type DeltaColor = "primary" | "error" | "onSurfaceVariant";

function deltaColor(
  deltaPct: number,
  colors: ReturnType<typeof useTheme>["colors"],
): string {
  if (deltaPct > 0) return colors.error;
  if (deltaPct < 0) return colors.primary;
  return colors.onSurfaceVariant;
}

function deltaIcon(deltaPct: number): "trending-up" | "trending-down" | "trending-flat" {
  if (deltaPct > 0) return "trending-up";
  if (deltaPct < 0) return "trending-down";
  return "trending-flat";
}

function insightText(
  householdPct: number,
  perPersonPct: number,
  people: number,
): string {
  if (householdPct > 0 && perPersonPct > 0)
    return `Your household uses more than average overall, and each person also exceeds the per-person norm. Check which appliances run the most.`;
  if (householdPct > 0 && perPersonPct <= 0)
    return `Your total is higher than average, but per person you're in line. The larger household size (${people} people) explains the higher total.`;
  if (householdPct <= 0 && perPersonPct > 0)
    return `Your total is near or below average, yet per-person usage runs a bit high. You're being efficient as a household but each person could trim a little.`;
  if (householdPct < 0 && perPersonPct < 0)
    return `Well done! Both your household total and per-person usage sit below the provincial average. Keep up the efficient habits.`;
  return `Your energy usage is right on par with the provincial average across both household and per-person metrics.`;
}

export default function ReportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms } = usePersistedRooms();
  const { user } = useUser();

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
  const roomSteps = 4;
  const roomStepSize = roomMax / roomSteps;
  const roomAxisLabels = useMemo(
    () =>
      Array.from({ length: roomSteps + 1 }, (_, i) => {
        const v = Math.round(roomStepSize * i);
        return `${formatNumber(v)} kWh`;
      }),
    [roomMax],
  );

  const summary = useMemo(() => summarizeEnergy(rooms), [rooms]);
  const cost = calcCostBaht(summary.monthlyKwh);
  const co2 = calcCo2Kg(summary.monthlyKwh);

  const hasRooms = rooms.length > 0;

  const provincial = useMemo(() => {
    if (!user?.location || !hasRooms) return null;
    const tier = provinceTierComparison(
      summary.monthlyKwh,
      user.location,
      user.people,
    );
    const household = provinceComparison(
      summary.monthlyKwh,
      user.location,
      user.people,
    );
    const perPerson = provinceTierPerPersonComparison(
      summary.monthlyKwh,
      user.location,
      user.people,
    );
    return { tier, household, perPerson };
  }, [user?.location, user?.people, summary.monthlyKwh, hasRooms]);

  const insight = useMemo(() => {
    if (!provincial) return null;
    return insightText(
      provincial.household.deltaPct,
      provincial.perPerson.deltaPct,
      user?.people ?? 1,
    );
  }, [provincial, user?.people]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppBar title="Monthly Report" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
      >
        <View className="gap-4 px-4 pt-4">
          {hasRooms && (
            <Card>
              <View style={{ alignItems: "center" }}>
                <Text
                  variant="displaySmall"
                  style={{ fontWeight: "700", color: colors.onSurface }}
                >
                  {formatNumber(summary.monthlyKwh)}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: colors.onSurfaceVariant, marginTop: 2 }}
                >
                  kWh / month
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 14,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "700", color: colors.onSurface }}
                  >
                    &#3647;{formatNumber(cost)}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    cost
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "700", color: colors.onSurface }}
                  >
                    {Math.round(co2).toLocaleString()} kg
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    CO&#8322;
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {provincial && (
            <>
              <Card>
                <Text
                  variant="headlineSmall"
                  style={{ fontWeight: "600", color: colors.onSurface }}
                >
                  Compare
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: colors.onSurfaceVariant, marginTop: 2 }}
                >
                  {provincial.tier.tierLabel}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      variant="headlineSmall"
                      style={{ fontWeight: "700", color: colors.primary }}
                    >
                      {formatNumber(provincial.tier.scaledTierKwh)}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {provincial.tier.tier === "high"
                        ? "High-tier avg"
                        : "Low-tier avg"}
                    </Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", paddingHorizontal: 4 }}
                  >
                    <MaterialIcons
                      name={deltaIcon(provincial.tier.deltaPct)}
                      size={24}
                      color={deltaColor(provincial.tier.deltaPct, colors)}
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      variant="headlineSmall"
                      style={{
                        fontWeight: "700",
                        color: deltaColor(
                          provincial.tier.deltaPct,
                          colors,
                        ),
                      }}
                    >
                      {formatNumber(summary.monthlyKwh)}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      Your home
                    </Text>
                  </View>
                </View>

                <Text
                  variant="titleMedium"
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "600",
                    color: deltaColor(provincial.tier.deltaPct, colors),
                  }}
                >
                  {provincial.tier.label}
                </Text>
              </Card>

              <Card>
                <Text
                  variant="headlineSmall"
                  style={{ fontWeight: "600", color: colors.onSurface }}
                >
                  Per person
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      variant="headlineSmall"
                      style={{ fontWeight: "700", color: colors.primary }}
                    >
                      {formatNumber(provincial.perPerson.baselineKwh)}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {provincial.tier.tier === "high"
                        ? "High-tier avg"
                        : "Low-tier avg"}
                    </Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", paddingHorizontal: 4 }}
                  >
                    <MaterialIcons
                      name={deltaIcon(provincial.perPerson.deltaPct)}
                      size={24}
                      color={deltaColor(
                        provincial.perPerson.deltaPct,
                        colors,
                      )}
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      variant="headlineSmall"
                      style={{
                        fontWeight: "700",
                        color: deltaColor(
                          provincial.perPerson.deltaPct,
                          colors,
                        ),
                      }}
                    >
                      {formatNumber(
                        summary.monthlyKwh / (user?.people ?? 1),
                      )}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      Your average
                    </Text>
                  </View>
                </View>

                <Text
                  variant="titleMedium"
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "600",
                    color: deltaColor(provincial.perPerson.deltaPct, colors),
                  }}
                >
                  {provincial.perPerson.label}
                </Text>
              </Card>
            </>
          )}

          {hasRooms && (
            <Card>
              <Text
                variant="headlineSmall"
                style={{ fontWeight: "600", color: colors.onSurface }}
              >
                Rooms
              </Text>
              <BarChart
                data={roomData}
                max={roomMax}
                axisLabels={roomAxisLabels}
              />
            </Card>
          )}

          {insight && (
            <View
              className="items-center rounded-t-3xl border border-b-0 px-5 pb-6 pt-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
              }}
            >
              <MaterialIcons
                name="lightbulb-outline"
                size={24}
                color={
                  provincial
                    ? deltaColor(provincial.household.deltaPct, colors)
                    : colors.onSurfaceVariant
                }
                style={{ marginBottom: 8 }}
              />
              <Text
                variant="bodyLarge"
                style={{
                  textAlign: "center",
                  lineHeight: 22,
                  color: colors.onSurface,
                }}
              >
                {insight}
              </Text>
            </View>
          )}

          {!hasRooms && (
            <Card>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant, textAlign: "center" }}
              >
                Scan a room to see your energy breakdown and how you compare to
                others in your province.
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
