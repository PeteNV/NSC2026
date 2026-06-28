import FloorIndicator from "@/components/common/FloorIndicator";
import Map from "@/components/common/Map";
import Estimate from "@/components/home/Estimate";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        <Estimate />
        <Card
          style={[
            styles.card,
            {
              borderColor: colors.outlineVariant,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <FloorIndicator />
          <Map />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
});
