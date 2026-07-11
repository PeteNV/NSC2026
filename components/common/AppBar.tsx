import SettingsDialog from "@/components/SettingsDialog";
import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Appbar } from "react-native-paper";

const AppBar: StylableFC<{
  title: string;
  back?: boolean;
  onBack?: () => void;
  settings?: boolean;
  onSettings?: () => void;
}> = ({ title, back, onBack, settings = true, onSettings, style }) => {
  const { colors } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <Appbar.Header style={[{ backgroundColor: colors.surface }, style]}>
      {back ? (
        <Appbar.BackAction onPress={onBack ?? (() => router.back())} />
      ) : null}
      <Appbar.Content title={title} />
      {settings ? (
        <Appbar.Action
          icon={({ size, color }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          )}
          onPress={onSettings ?? (() => setSettingsVisible(true))}
        />
      ) : null}
      <SettingsDialog
        visible={settingsVisible}
        onDismiss={() => setSettingsVisible(false)}
      />
    </Appbar.Header>
  );
};

export default AppBar;
