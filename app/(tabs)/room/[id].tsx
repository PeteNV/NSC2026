import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import ApplianceListItem from "@/components/room/ApplianceListItem";
import EditApplianceDialog from "@/components/room/EditApplianceDialog";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import type { Appliance } from "@/types/appliance";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RoomApplianceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rooms, updateAppliance, deleteAppliance, addAppliance } = usePersistedRooms();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddApplianceDialog, setShowAddApplianceDialog] = useState(false);
  const [selectedApplianceId, setSelectedApplianceId] = useState<string | null>(null);

  const room = rooms.find((r) => r.id === id);
  const roomName = room?.name ?? `Room ${id}`;
  const appliances = useMemo(
    () =>
      [...(room?.appliances ?? [])].sort(
        (a, b) => b.power * b.usage - a.power * a.usage,
      ),
    [room?.appliances],
  );

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

  const handleAddAppliance = useCallback(
    (data: Appliance) => {
      if (id) addAppliance(id, { ...data, source: "manual" });
      setShowAddApplianceDialog(false);
    },
    [id, addAppliance],
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
          <View className="px-9 pb-3">
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setShowAddApplianceDialog(true)}
              style={{ borderRadius: 8 }}
            >
              Add Appliance
            </Button>
          </View>
          <List
            data={appliances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ApplianceListItem
                room={item}
                selected={item.id === selectedApplianceId}
                onToggleSelect={() => handleToggleSelect(item.id)}
                onRotate={() => {
                  if (id) updateAppliance(id, { ...item, rotation: ((item.rotation ?? 0) + 90) % 360 });
                }}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        </View>
      </View>
      <EditApplianceDialog
        visible={showAddApplianceDialog}
        onDismiss={() => setShowAddApplianceDialog(false)}
        onSave={handleAddAppliance}
      />
    </View>
  );
}
