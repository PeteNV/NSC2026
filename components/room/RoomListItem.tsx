import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

export type RoomData = {
  id: string;
  name: string;
  applianceCount: number;
  power: number;
};

type Props = {
  room: RoomData;
  onPress?: () => void;
};

const RoomListItem: StylableFC<Props> = ({
  room,
  onPress,
  className,
  style,
}) => {
  const { colors } = useTheme();

  return (
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
            {room.applianceCount} appliances {"•"} {room.power} kWh
          </Text>
        </View>
        <View>
          <MaterialIcons
            name="more-horiz"
            size={24}
            color={colors.onSurfaceVariant}
          />
        </View>
      </View>
    </TouchableRipple>
  );
};

export default RoomListItem;
