import { useTheme } from "@/hooks/useTheme";
import type { Room } from "@/types/room";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";

const RoomListItem: StylableFC<{
  room: Room;
  onPress?: () => void;
  onDelete?: () => void;
}> = ({ room, onPress, onDelete, className, style }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

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
              name="bed"
              size={24}
              color={colors.onSurfaceVariant}
            />
            <View className="flex-1 flex-col">
              <Text variant="bodyLarge">{room.name}</Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {room.applianceCount} appliances {"•"} {room.power} kWh
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
              onDelete?.();
            }}
            title="Delete"
            titleStyle={{ color: colors.error }}
          />
        </Menu>
      </View>
    </View>
  );
};

export default RoomListItem;
