import { useTheme } from "@/hooks/useTheme";
import type { Appliance } from "@/types/appliance";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Menu,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import EditApplianceDialog from "./EditApplianceDialog";

const ApplianceListItem: StylableFC<{
  room: Appliance;
  onPress?: () => void;
  onEdit?: (data: Appliance) => void;
  onDelete?: () => void;
}> = ({ room, onPress, onEdit, onDelete, className, style }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  return (
    <>
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        className={clsx("rounded-xl", className)}
      >
        <View
          className="h-20 flex-row items-center justify-between gap-4 rounded
            px-4"
          style={[
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
            },
            style,
          ]}
        >
          <MaterialIcons name="bed" size={24} color={colors.onSurfaceVariant} />
          <View className="flex-1 flex-col">
            <Text variant="bodyLarge">{room.name}</Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              {room.usage} h {"•"} {room.power} Wh
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Text
              variant="labelLarge"
              style={{ color: colors.onSurfaceVariant }}
            >
              {(room.power * room.usage) / 1000} kWh
            </Text>
            <Menu
              style={{ padding: 32 }}
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
                    className="p-2"
                  />
                </TouchableRipple>
              }
            >
              <Menu.Item
                leadingIcon={({ size, color }) => (
                  <MaterialIcons name="edit" size={size} color={color} />
                )}
                onPress={() => {
                  setMenuVisible(false);
                  setTimeout(() => setDialogVisible(true), 300);
                }}
                title="Edit"
              />
              <Menu.Item
                leadingIcon={({ size }) => (
                  <MaterialIcons
                    name="delete"
                    size={size}
                    color={colors.error}
                  />
                )}
                onPress={() => {
                  setMenuVisible(false);
                  setTimeout(() => setDeleteDialogVisible(true), 300);
                }}
                title="Delete"
                titleStyle={{ color: colors.error }}
              />
            </Menu>
          </View>
        </View>
      </TouchableRipple>
      <EditApplianceDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        appliance={room}
        onSave={(data) => {
          setDialogVisible(false);
          onEdit?.(data);
        }}
      />
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{
            backgroundColor: colors.surface,
            maxWidth: 312,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <Dialog.Content>
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
              Are you sure you want to delete "{room.name}"?
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
    </>
  );
};

export default ApplianceListItem;
