import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import RoomListItem, { type RoomData } from "@/components/room/RoomListItem";
import ScanRoomButton from "@/components/room/ScanRoomButton";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_ROOMS: RoomData[] = [
  { id: "1", name: "Living Room", applianceCount: 5, power: 40 },
  { id: "2", name: "Kitchen", applianceCount: 8, power: 50 },
  { id: "3", name: "Bedroom", applianceCount: 3, power: 50 },
  { id: "4", name: "Bathroom", applianceCount: 2, power: 40 },
  { id: "5", name: "Bathroom", applianceCount: 2, power: 60 },
  { id: "6", name: "Bathroom", applianceCount: 2, power: 60 },
  { id: "7", name: "Bathroom", applianceCount: 2, power: 40 },
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
      <View className="h-1/2 gap-4 px-4">
        <Card className="flex-1 !p-0">
          <Map />
        </Card>
        <ScanRoomButton onScanRoom={() => {}} onManualEntry={() => {}} />
      </View>

      {/* Room List */}
      <View
        className="h-1/2 rounded-t-[54] px-3 outline outline-1"
        style={{
          backgroundColor: colors.surfaceContainer,
          outlineColor: colors.outlineVariant,
        }}
      >
        <Text variant="headlineSmall" className="px-9 py-5">
          Room List
        </Text>
        <List
          data={MOCK_ROOMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RoomListItem room={item} />}
        />
      </View>
    </View>
  );
}
