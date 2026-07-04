import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import clsx from "clsx";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

export type ApplianceData = {
  id: string;
  name: string;
  usage: number;
  power: number;
};

const ApplianceListItem: StylableFC<{
  room: ApplianceData;
  onPress?: () => void;
}> = ({ room, onPress, className, style }) => {
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
            {room.usage} h {"•"} {room.power} Wh
          </Text>
        </View>
        <View className="flex-row gap-4">
          <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
            {(room.power * room.usage) / 1000} kWh
          </Text>
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

export default ApplianceListItem;
