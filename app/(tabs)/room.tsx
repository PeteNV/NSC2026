import { View } from "react-native";

import Card from "@/components/common/Card";
import Map from "@/components/Map";
import ScanRoomButton from "@/components/room/ScanRoomButton";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RoomEditScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="flex-1 gap-4 px-4">
        {/* Map */}
        <Card className="relative h-1/2 !p-0">
          <Map />
        </Card>
        <ScanRoomButton onScanRoom={() => {}} onManualEntry={() => {}} />
      </View>
    </View>
  );
}
