import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import { clsx } from "clsx";
import { View } from "react-native";
import { Text } from "react-native-paper";

export type BarChartDatum = {
  label: string;
  value: number;
};

const LABEL_WIDTH = 96;
const LABEL_GAP = 12;
const BAR_HEIGHT = 16;
const ROW_GAP = 12;

const BarChart: StylableFC<{
  data: BarChartDatum[];
  max: number;
  axisLabels: string[];
}> = ({ data, max, axisLabels, className, style }) => {
  const { colors } = useTheme();

  return (
    <View className={clsx("w-full", className)} style={style}>
      <View>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: LABEL_WIDTH,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {axisLabels.map((_, index) => (
            <View
              key={index}
              style={{ width: 1, backgroundColor: colors.outlineVariant }}
            />
          ))}
        </View>
        <View style={{ gap: ROW_GAP }}>
          {data.map((item, index) => {
            const fraction =
              max > 0 ? Math.min(1, Math.max(0, item.value / max)) : 0;
            return (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{ width: LABEL_WIDTH, paddingRight: LABEL_GAP }}
                >
                  <Text
                    variant="bodyMedium"
                    numberOfLines={1}
                    style={{
                      fontWeight: "500",
                      textAlign: "right",
                      color: colors.onSurface,
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: BAR_HEIGHT,
                    flexDirection: "row",
                  }}
                >
                  {fraction > 0 ? (
                    <View
                      style={{
                        flex: fraction,
                        backgroundColor: colors.primaryContainer,
                        borderRadius: BAR_HEIGHT / 2,
                      }}
                    />
                  ) : null}
                  <View style={{ flex: 1 - fraction }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          paddingLeft: LABEL_WIDTH,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {axisLabels.map((label) => (
          <Text
            key={label}
            variant="labelMedium"
            style={{ fontWeight: "600", color: colors.onSurface }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default BarChart;
