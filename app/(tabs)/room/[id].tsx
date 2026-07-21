import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import ApplianceListItem from "@/components/room/ApplianceListItem";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import type { Appliance } from "@/types/appliance";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RoomApplianceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms, updateAppliance, deleteAppliance } = usePersistedRooms();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedApplianceId, setSelectedApplianceId] = useState<string | null>(null);

  const room = rooms.find((r) => r.id === id);
  const roomName = room?.name ?? `Room ${id}`;
  const appliances = room?.appliances ?? [];

  const handleToggleSelect = useCallback(
    (applianceId: string) => {
      setSelectedApplianceId((prev) => {
        if (prev === applianceId) return null;
        setIsEditing(true);
        return applianceId;
      });
    },
    [],
  );

  const handleEdit = useCallback(
    (data: Appliance) => {
      if (id) updateAppliance(id, data);
    },
    [id, updateAppliance],
  );

  const handleDelete = useCallback(
    (applianceId: string) => {
      if (id) deleteAppliance(id, applianceId);
    },
    [id, deleteAppliance],
  );

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title={roomName} back />
      <View className="flex-1 gap-4">
        {/* Map */}
        <View className="gap-4 px-4" style={{ flex: 0.5 }}>
          <Card className="flex-1 !p-0">
            <Map
              hideFloorIndicator
              room={room ?? undefined}
              roomEditable={false}
              applianceEditable={isEditing}
              selectedApplianceId={selectedApplianceId ?? undefined}
              onToggleApplianceEdit={() => setIsEditing((v) => !v)}
              onApplianceUpdate={updateAppliance}
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
            data={appliances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ApplianceListItem
                room={item}
                selected={item.id === selectedApplianceId}
                onToggleSelect={() => handleToggleSelect(item.id)}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
