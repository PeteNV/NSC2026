import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import ApplianceListItem, {
  ApplianceData,
} from "@/components/room/ApplianceListItem";
import FAB from "@/components/wrapper/FAB";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
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

const ROOM_NAMES: Record<string, string> = {
  "1": "Living Room",
  "2": "Kitchen",
  "3": "Bedroom",
  "4": "Bathroom",
  "5": "Bathroom",
  "6": "Bathroom",
  "7": "Bathroom",
};

export default function RoomApplianceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const roomName = ROOM_NAMES[id ?? ""] ?? `Room ${id}`;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={roomName} />
      </Appbar.Header>
      <View className="flex-1 gap-4">
        {/* Map */}
        <View className="gap-4 px-4" style={{ flex: 0.5 }}>
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
          className="rounded-t-[54] px-3 outline outline-1"
          style={{
            flex: 0.5,
            backgroundColor: colors.surfaceContainer,
            outlineColor: colors.outlineVariant,
          }}
        >
          <Text variant="headlineSmall" className="px-9 py-5">
            Appliances in Room {id}
          </Text>
          <List
            data={MOCK_APPLIANCES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ApplianceListItem room={item} />}
          />
        </View>
      </View>
    </View>
  );
}
