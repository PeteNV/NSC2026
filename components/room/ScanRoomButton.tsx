import Button from "@/components/wrapper/Button";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { View } from "react-native";
import { Icon, Menu, TouchableRipple } from "react-native-paper";

type Props = {
  onScanRoom: () => void;
  onManualEntry: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const DROPDOWN_WIDTH = 40;

const ScanRoomButton: StylableFC<Props> = ({
  onScanRoom,
  onManualEntry,
  disabled = false,
  loading = false,
  className,
  style,
}) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={[{ flexDirection: "row", gap: 2 }, style]}>
      <Button
        mode="contained"
        disabled={disabled}
        loading={loading}
        icon={({ size, color }) => (
          <MaterialIcons name="add" size={size} color={color} />
        )}
        onPress={onScanRoom}
        style={{ flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
      >
        Scan Room
      </Button>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple
            disabled={disabled}
            onPress={() => setMenuVisible(true)}
            style={{
              width: DROPDOWN_WIDTH,
              height: DROPDOWN_WIDTH,
              backgroundColor: colors.primary,
              borderTopRightRadius: 9999,
              borderBottomRightRadius: 9999,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon source="chevron-down" size={18} color={colors.onPrimary} />
          </TouchableRipple>
        }
      >
        <Menu.Item
          leadingIcon="pencil"
          onPress={() => {
            setMenuVisible(false);
            onManualEntry();
          }}
          title="Manual Entry"
        />
      </Menu>
    </View>
  );
};

export default ScanRoomButton;
