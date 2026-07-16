import FloorPlan from "@/components/FloorPlan";
import FloorIndicator from "@/components/subcomponents/FloorIndicator";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import type { Room } from "@/types/room";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

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
  onRoomMove?: (roomId: string, origin: { x: number; z: number }) => void;
  onRoomRotate?: (roomId: string, rotation: number) => void;
}> = ({ hideFloorIndicator = false, room, rooms, editable, onRoomMove, onRoomRotate }) => {
  const { colors } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState(1);

  const allRooms = useMemo(() => {
    if (rooms && rooms.length > 0) return rooms;
    if (room) return [room];
    return [];
  }, [rooms, room]);

  const hasGeometry = allRooms.some((r) => r.walls && r.walls.length > 0);

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
            onRoomMove={onRoomMove}
            onRoomRotate={onRoomRotate}
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
        <View className="absolute w-full p-4" pointerEvents="box-none">
          <FloorIndicator
            floorCount={4}
            selectedFloor={selectedFloor}
            onFloorChange={setSelectedFloor}
          />
        </View>
      )}
    </View>
  );
};

export default Map;
