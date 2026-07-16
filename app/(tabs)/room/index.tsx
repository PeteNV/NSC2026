import AppBar from "@/components/common/AppBar";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Map from "@/components/Map";
import RoomListItem from "@/components/room/RoomListItem";
import ScanRoomButton from "@/components/room/ScanRoomButton";
import { usePersistedRooms } from "@/hooks/usePersistedRooms";
import { useTheme } from "@/hooks/useTheme";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_FLOORS = 4;

export default function RoomEditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    rooms,
    updateRoomOrigin,
    updateRoomRotation,
    updateRoomFloor,
    deleteFloor,
    deleteRoom,
  } = usePersistedRooms();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [floorCount, setFloorCount] = useState(() => {
    const max = rooms.reduce(
      (m, r) => (r.floor !== undefined && r.floor > m ? r.floor : m),
      0,
    );
    return Math.max(max, MIN_FLOORS);
  });

  const handleAddFloor = useCallback(() => {
    const next = floorCount + 1;
    setFloorCount(next);
    if (next <= selectedFloor + 1) {
      setSelectedFloor(next);
    }
  }, [floorCount, selectedFloor]);

  const openDeleteDialog = useCallback(() => {
    if (floorCount <= 1) return;
    setShowDeleteDialog(true);
  }, [floorCount]);

  const confirmDeleteFloor = useCallback(() => {
    deleteFloor(selectedFloor);
    setFloorCount((prev) => prev - 1);
    setShowDeleteDialog(false);
    setSelectedFloor((prev) => {
      if (prev > floorCount - 1) return floorCount - 1;
      return prev;
    });
  }, [deleteFloor, selectedFloor, floorCount]);

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
          {rooms.length > 0 && (
            <Map
              rooms={rooms}
              editable={isEditing}
              showEditLock
              selectedFloor={selectedFloor}
              floorCount={floorCount}
              onFloorChange={setSelectedFloor}
              onAddFloor={handleAddFloor}
              onDeleteFloor={openDeleteDialog}
              onToggleEdit={() => setIsEditing((v) => !v)}
              onRoomMove={updateRoomOrigin}
              onRoomRotate={updateRoomRotation}
            />
          )}
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
          renderItem={({ item }) => (
            <RoomListItem
              room={item}
              selectedFloor={selectedFloor}
              onAssignFloor={updateRoomFloor}
              onDelete={() => deleteRoom(item.id)}
            />
          )}
        />
      </View>

      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
          style={{
            backgroundColor: colors.surface,
            maxWidth: 312,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <Dialog.Content>
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
              Are you sure you want to delete floor {selectedFloor}?
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant, marginTop: 4 }}
            >
              Rooms on this floor will be removed from the map. Rooms on higher
              floors will shift down.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              mode="text"
              textColor={colors.error}
              onPress={confirmDeleteFloor}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
