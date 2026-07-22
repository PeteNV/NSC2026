import { useTheme } from "@/hooks/useTheme";
import type { Room } from "@/types/room";
import { type StylableFC } from "@/types/common";
import { roomIcon } from "@/utils/icons";
import { roomMonthlyKwh } from "@/utils/energy";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Menu, Portal, Text, TouchableRipple } from "react-native-paper";

const RoomListItem: StylableFC<{
  room: Room;
  selectedFloor?: number;
  onPress?: () => void;
  onDelete?: () => void;
  onAssignFloor?: (roomId: string, floor: number) => void;
}> = ({ room, selectedFloor, onPress, onDelete, onAssignFloor, className, style }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  return (
    <View
      className={clsx("overflow-hidden rounded-xl", className)}
      style={[{ backgroundColor: colors.surface }, style]}
    >
      <View
        className="h-20 flex-row items-center rounded px-4"
        style={{ borderColor: colors.outlineVariant }}
      >
        <TouchableRipple
          onPress={() =>
            router.push({
              pathname: "/room/[id]",
              params: { id: room.id },
            })
          }
          className="flex-1 flex-row items-center gap-4 py-4"
        >
          <>
            <MaterialIcons
              name={roomIcon(room.name)}
              size={24}
              color={colors.onSurfaceVariant}
            />
            <View className="flex-1 flex-col">
              <Text variant="bodyLarge">{room.name}</Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {room.applianceCount} appliances {"•"} {Math.round(roomMonthlyKwh(room)).toLocaleString()} kWh/month
              </Text>
            </View>
          </>
        </TouchableRipple>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          contentStyle={{ backgroundColor: colors.surfaceContainerHigh }}
          anchor={
            <TouchableRipple
              onPress={() => setMenuVisible(true)}
              borderless
              style={{ borderRadius: 20 }}
            >
              <MaterialIcons
                name="more-horiz"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </TouchableRipple>
          }
        >
          {selectedFloor !== undefined && onAssignFloor && (
            <Menu.Item
              leadingIcon={({ size, color }) => (
                <MaterialIcons name="add-location" size={size} color={color} />
              )}
              disabled={room.floor === selectedFloor}
              onPress={() => {
                setMenuVisible(false);
                onAssignFloor(room.id, selectedFloor);
              }}
              title={room.floor !== undefined ? `Relocate to Floor ${selectedFloor}` : `Add to Floor ${selectedFloor}`}
            />
          )}
          <Menu.Item
            leadingIcon={({ size, color }) => (
              <MaterialIcons name="edit" size={size} color={color} />
            )}
            onPress={() => {
              router.push({
                pathname: "/room/[id]",
                params: { id: room.id },
              });
              setMenuVisible(false);
            }}
            title="Edit"
          />
          <Menu.Item
            leadingIcon={({ size }) => (
              <MaterialIcons name="delete" size={size} color={colors.error} />
            )}
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }}
            title="Delete"
            titleStyle={{ color: colors.error }}
          />
        </Menu>
      </View>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{
            backgroundColor: colors.surface,
            maxWidth: 312,
            alignSelf: "center",
            width: "80%",
          }}
        >
          <Dialog.Content>
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
              Are you sure you want to delete &ldquo;{room.name}&rdquo;?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => setDeleteDialogVisible(false)}
            >
              Cancel
            </Button>
            <Button
              mode="text"
              textColor={colors.error}
              onPress={() => {
                setDeleteDialogVisible(false);
                onDelete?.();
              }}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default RoomListItem;
