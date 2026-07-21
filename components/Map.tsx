import FloorPlan from "@/components/FloorPlan";
import FloorIndicator from "@/components/subcomponents/FloorIndicator";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import type { Room } from "@/types/room";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function NormalButton({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Button mode="contained" onPress={onPress} disabled={disabled}>
      {title}
    </Button>
  );
}

const Map: StylableFC<{
  hideFloorIndicator?: boolean;
  room?: Room;
  rooms?: Room[];
  editable?: boolean;
  roomEditable?: boolean;
  applianceEditable?: boolean;
  selectedApplianceId?: string;
  selectedFloor?: number;
  floorCount?: number;
  onFloorChange?: (floor: number) => void;
  onAddFloor?: () => void;
  onDeleteFloor?: () => void;
  onToggleRoomEdit?: () => void;
  onToggleApplianceEdit?: () => void;
  onRoomMove?: (roomId: string, origin: { x: number; z: number }) => void;
  onRoomRotate?: (roomId: string, rotation: number) => void;
  onApplianceUpdate?: (roomId: string, appliance: import("@/types/appliance").Appliance) => void;
}> = ({
  hideFloorIndicator = false,
  room,
  rooms,
  editable,
  roomEditable,
  applianceEditable,
  selectedFloor: selectedFloorProp,
  floorCount: floorCountProp,
  onFloorChange,
  onAddFloor,
  onDeleteFloor,
  onToggleRoomEdit,
  onToggleApplianceEdit,
  selectedApplianceId,
  onRoomMove,
  onRoomRotate,
  onApplianceUpdate,
}) => {
  const { colors } = useTheme();
  const [selectedFloorInternal, setSelectedFloorInternal] = useState(1);
  const selectedFloor = selectedFloorProp ?? selectedFloorInternal;

  const handleFloorChange = (floor: number) => {
    setSelectedFloorInternal(floor);
    onFloorChange?.(floor);
  };

  const allRooms = useMemo(() => {
    if (rooms && rooms.length > 0) {
      return rooms.filter((r) => r.floor === selectedFloor);
    }
    if (room) return [room];
    return [];
  }, [rooms, room, selectedFloor]);

  const hasGeometry = allRooms.some((r) => r.walls && r.walls.length > 0);

  const showFloorTools = onAddFloor || onDeleteFloor;
  const topInset = hideFloorIndicator ? 0 : 56;

  return (
    <View className="relative flex-1 rounded-lg">
      <View
        className="flex-1 content-center justify-center"
        pointerEvents="box-none"
      >
        {hasGeometry ? (
          <FloorPlan
            rooms={allRooms}
            editable={editable}
            roomEditable={roomEditable}
            applianceEditable={applianceEditable}
            selectedApplianceId={selectedApplianceId}
            onRoomMove={onRoomMove}
            onRoomRotate={onRoomRotate}
            onApplianceUpdate={onApplianceUpdate}
            topInset={topInset}
          />
        ) : (
          <Text
            variant="labelLarge"
            style={{ textAlign: "center", color: colors.secondary }}
          >
            Insert Map Here
          </Text>
        )}
      </View>

      {!hideFloorIndicator && (
        <View className="absolute top-0 w-full p-4" pointerEvents="box-none">
          <FloorIndicator
            floorCount={floorCountProp ?? 4}
            selectedFloor={selectedFloor}
            onFloorChange={handleFloorChange}
          />
        </View>
      )}

      {(showFloorTools || onToggleRoomEdit || onToggleApplianceEdit) && (
        <View
          className="absolute bottom-0 w-full flex-row items-center justify-between px-4 py-2"
          pointerEvents="box-none"
        >
          <View className="flex-row items-center">
            {onAddFloor && (
              <IconButton
                icon={({ size, color }) => (
                  <MaterialIcons name="add" size={size} color={color} />
                )}
                iconColor={colors.primary}
                size={20}
                disabled={(floorCountProp ?? 1) >= 5}
                onPress={onAddFloor}
              />
            )}
            {onDeleteFloor && (
              <IconButton
                icon={({ size, color }) => (
                  <MaterialIcons name="delete" size={size} color={color} />
                )}
                iconColor={colors.error}
                size={20}
                disabled={(floorCountProp ?? 1) <= 1}
                onPress={onDeleteFloor}
              />
            )}
          </View>
          <View className="flex-row items-center gap-1">
            {onToggleRoomEdit && (
              <IconButton
                icon={({ size, color }) => (
                  <MaterialIcons
                    name={roomEditable ? "lock-open" : "lock"}
                    size={size}
                    color={color}
                  />
                )}
                iconColor={
                  roomEditable ? colors.primary : colors.onSurfaceVariant
                }
                size={20}
                onPress={onToggleRoomEdit}
              />
            )}
            {onToggleApplianceEdit && (
              <IconButton
                icon={({ size, color }) => (
                  <MaterialIcons
                    name={applianceEditable ? "lock-open" : "lock"}
                    size={size}
                    color={color}
                  />
                )}
                iconColor={
                  applianceEditable ? colors.primary : colors.onSurfaceVariant
                }
                size={20}
                onPress={onToggleApplianceEdit}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Map;
