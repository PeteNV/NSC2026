import FloorIndicator from "@/components/common/FloorIndicator";
import Map from "@/components/common/Map";
import Estimate from "@/components/home/Estimate";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import { Card, FAB } from "react-native-paper";
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
      <View style={[styles.container]}>
        <Estimate />
        <Card
          style={[
            styles.card,
            styles.cardFlex,
            {
              borderColor: colors.outlineVariant,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Card.Content style={styles.cardContent}>
            <FloorIndicator floorCount={4} />
            <Map />
            <View className="flex-row justify-center">
              <FAB
                icon={({ size, color }) => (
                  <MaterialIcons name="edit" size={size} color={color} />
                )}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
  },
  cardFlex: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    gap: 16,
  },
});
