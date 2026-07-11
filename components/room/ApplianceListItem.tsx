import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { useState } from "react";
import { View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";
import EditApplianceDialog from "./EditApplianceDialog";

export type ApplianceData = {
  id: string;
  name: string;
  usage: number;
  power: number;
};

const ApplianceListItem: StylableFC<{
  room: ApplianceData;
  onPress?: () => void;
  onEdit?: (data: ApplianceData) => void;
  onDelete?: () => void;
}> = ({ room, onPress, onEdit, onDelete, className, style }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        className={clsx("rounded-xl", className)}
        style={style}
      >
        <View
          className="h-20 flex-row items-center justify-between gap-4 rounded
            px-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
          }}
        >
          <MaterialIcons name="bed" size={24} color={colors.onSurfaceVariant} />
          <View className="flex-1 flex-col">
            <Text variant="bodyLarge">{room.name}</Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              {room.usage} h {"•"} {room.power} Wh
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
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
                  setDialogVisible(true);
                }}
                title="Edit"
              />
              <Menu.Item
                leadingIcon={({ size }) => (
                  <MaterialIcons name="delete" size={size} color={colors.error} />
                )}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete?.();
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
    </>
  );
};

export default ApplianceListItem;
