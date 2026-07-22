import AppBar from "@/components/common/AppBar";
import List from "@/components/common/List";
import ApplianceListItem from "@/components/room/ApplianceListItem";
import type { Appliance } from "@/types/appliance";
import { useTheme } from "@/hooks/useTheme";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RoomAppliance = Appliance & { roomId: string; roomName: string };

export default function ApplianceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms, updateAppliance, deleteAppliance } = usePersistedRooms();

  const appliances = useMemo<RoomAppliance[]>(() => {
    const result: RoomAppliance[] = [];
    for (const room of rooms) {
      for (const a of room.appliances ?? []) {
        result.push({ ...a, roomId: room.id, roomName: room.name });
      }
    }
    result.sort((a, b) => b.power * b.usage - a.power * a.usage);
    return result;
  }, [rooms]);

  const handleEdit = (data: Appliance) => {
    const ra = appliances.find((a) => a.id === data.id);
    if (ra) updateAppliance(ra.roomId, data);
  };

  const handleDelete = (applianceId: string) => {
    const ra = appliances.find((a) => a.id === applianceId);
    if (ra) deleteAppliance(ra.roomId, applianceId);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title="All Appliances" />
      <View className="flex-1 px-4">
        {appliances.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              No appliances found. Scan a room to add appliances.
            </Text>
          </View>
        ) : (
          <List
            data={appliances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ApplianceListItem
                room={item}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
                style={{ backgroundColor: colors.surfaceContainer }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
