import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import RoomListItem from "@/components/room/RoomListItem";
import ScanRoomButton from "@/components/room/ScanRoomButton";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RoomEditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms, loaded, deleteAppliance } = usePersistedRooms();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title="Rooms" />
      {/* Map */}
      <View className="gap-4 px-4" style={{ flex: 0.6 }}>
        <Card className="!p-0" style={{ flex: 1 }}>
          {rooms.length > 0 && <Map room={rooms[0]} />}
        </Card>
        <ScanRoomButton onScanRoom={() => {}} onManualEntry={() => {}} />
      </View>

      {/* Room List */}
      <View
        className="mt-4 rounded-t-[54] px-3 outline outline-1"
        style={{
          flex: 0.4,
          backgroundColor: colors.surfaceContainer,
          outlineColor: colors.outlineVariant,
        }}
      >
        <Text variant="headlineSmall" className="px-9 py-5">
          Room List
        </Text>
        <List
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RoomListItem room={item} />}
        />
      </View>
    </View>
  );
}
