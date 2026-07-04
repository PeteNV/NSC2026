import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import ApplianceListItem, {
  ApplianceData,
} from "@/components/room/ApplianceListItem";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_APPLIANCES: ApplianceData[] = [
  { id: "1", name: "Refrigerator", usage: 24, power: 150 },
  { id: "2", name: "Air Conditioner", usage: 8, power: 1500 },
  { id: "3", name: "Washing Machine", usage: 2, power: 500 },
  { id: "4", name: "LED Lights (6)", usage: 6, power: 60 },
  { id: "5", name: "Television", usage: 4, power: 120 },
  { id: "6", name: "Microwave", usage: 1, power: 1200 },
  { id: "7", name: "Laptop", usage: 6, power: 65 },
  { id: "8", name: "Water Heater", usage: 3, power: 2000 },
  { id: "9", name: "Ceiling Fan", usage: 10, power: 75 },
  { id: "10", name: "Clothes Dryer", usage: 2, power: 1800 },
];

export default function RoomEditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 gap-4"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {/* Map */}
      <View className="h-2/5 gap-4 px-4">
        <Card className="flex-1 !p-0">
          <Map hideFloorIndicator />
          <FAB
            className="absolute bottom-4 right-4"
            icon={({ size, color }) => (
              <MaterialIcons name="edit" size={size} color={color} />
            )}
          />
        </Card>
      </View>

      {/* Appliance List */}
      <View
        className="h-3/5 rounded-t-[54] px-3 outline outline-1"
        style={{
          backgroundColor: colors.surfaceContainer,
          outlineColor: colors.outlineVariant,
        }}
      >
        <Text variant="headlineSmall" className="px-9 py-5">
          Appliance List
        </Text>
        <List
          data={MOCK_APPLIANCES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ApplianceListItem room={item} />}
        />
      </View>
    </View>
  );
}
