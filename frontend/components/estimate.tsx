import { M3Button } from "@/components/test-button";
import { useTheme } from "@/hooks/useTheme";
import { theme } from "@/static/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Estimate() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.usage,
        {
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          backgroundColor: colors.surfaceContainer,
        },
      ]}
    >
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
        ~ {""}
        <Text
          variant="displayLarge"
          style={{
            fontWeight: "bold",
            fontSize: 50,
            lineHeight: 55,
            color: colors.onPrimaryContainer,
          }}
        >
          1,234 {""}
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
        +520 {""}
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>
          kWh from Base Estimation of 714 kWh{" "}
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: theme.light.colors.surfaceContainer,
          margin: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.light.colors.outline,
          marginHorizontal: 8,
        }}
      />
      <View style={styles.rows}>
        <View style={[styles.month, { backgroundColor: colors.surfaceBright }]}>
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
        <View style={[styles.month, { backgroundColor: colors.surfaceBright }]}>
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
      <M3Button
        title="View Full Report"
        onPress={() => alert("Button pressed")}
      ></M3Button>
    </View>
  );
}

const styles = StyleSheet.create({
  usage: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: theme.light.colors.surfaceContainer,
    alignSelf: "center",
    borderWidth: 1,
  },
  month: {
    padding: 12,
    gap: 4,
    justifyContent: "flex-start",
    backgroundColor: theme.light.colors.surfaceBright,
    borderRadius: 15,
    flexWrap: "wrap",
    minWidth: 0,
    flexGrow: 1,
  },
  rows: {
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 10,
    gap: 8,
    width: "100%",
  },
});
