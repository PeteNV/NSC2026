import { useTheme } from "@/hooks/useTheme";
import { useThemeMode, type ThemeMode } from "@/hooks/useThemeMode";
import { type IconName, type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
} from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: IconName }[] = [
  { value: "system", label: "System", icon: "brightness-auto" },
  { value: "light", label: "Light", icon: "light-mode" },
  { value: "dark", label: "Dark", icon: "dark-mode" },
];

const SettingsDialog: StylableFC<Props> = ({ visible, onDismiss }) => {
  const { colors } = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: colors.surface,
          maxWidth: 480,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <Dialog.Content>
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="headlineSmall" style={{ color: colors.onSurface }}>
              Settings
            </Text>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.onSurfaceVariant}
              onPress={onDismiss}
            />
          </View>

          {/* Theme */}
          <Text
            variant="labelLarge"
            style={{ color: colors.onSurfaceVariant, marginBottom: 8 }}
          >
            Theme
          </Text>
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as ThemeMode)}
            buttons={THEME_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
              icon: ({ size, color }) => (
                <MaterialIcons name={option.icon} size={size} color={color} />
              ),
            }))}
          />
        </Dialog.Content>

        <Dialog.Actions>
          <Button mode="text" textColor={colors.primary} onPress={onDismiss}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SettingsDialog;
