import Map from "@/components/Map";
import Card from "@/components/common/Card";
import Estimate from "@/components/home/Estimate";
import FAB from "@/components/wrapper/FAB";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 gap-4 px-4">
        {/* Energy Estimation Summary Card */}
        <Estimate />

        {/* Map */}
        <Card className="relative flex-1 !p-0">
          <Map />
          <FAB
            className="absolute bottom-4 right-4"
            icon={({ size, color }) => (
              <MaterialIcons name="edit" size={size} color={color} />
            )}
          />
        </Card>
      </View>
    </View>
  );
}
