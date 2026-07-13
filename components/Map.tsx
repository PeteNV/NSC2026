import FloorPlan from "@/components/FloorPlan";
import FloorIndicator from "@/components/subcomponents/FloorIndicator";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import type { Room } from "@/types/room";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function NormalButton({ title, onPress, disabled = false }: Props) {
  return (
    <Button mode="contained" onPress={onPress} disabled={disabled}>
      {title}
    </Button>
  );
}

const Map: StylableFC<{ hideFloorIndicator?: boolean; room?: Room }> = ({
  hideFloorIndicator = false,
  room,
}) => {
  const { colors } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const hasGeometry = room?.walls && room.walls.length > 0;

  return (
    <View className="relative flex-1 rounded-lg">
      <View
        className="flex-1 content-center justify-center"
        pointerEvents="box-none"
      >
        {hasGeometry ? (
          <FloorPlan
            walls={room!.walls!}
            doors={room!.doors}
            windows={room!.windows}
            appliances={room!.appliances}
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
