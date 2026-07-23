import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import type { Room } from "@/types/room";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

const ManualRoomDialog: StylableFC<{
  visible: boolean;
  onDismiss: () => void;
  onSave: (room: Room) => void;
}> = ({ visible, onDismiss, onSave }) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName("");
    setWidth("");
    setDepth("");
  }, [visible]);

  const handleSave = () => {
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    if (w <= 0 || d <= 0) return;

    const id = String(Date.now());
    const roomName = name.trim() || "Manual Room";

    const room: Room = {
      id,
      name: roomName,
      power: 0,
      applianceCount: 0,
      wallCount: 4,
      doorCount: 0,
      windowCount: 0,
      walls: [
        {
          id: `w-m-${id}-l`,
          length: d,
          position: { x: 0, z: 0 },
          rotation: 90,
        },
        {
          id: `w-m-${id}-t`,
          length: w,
          position: { x: 0, z: d },
          rotation: 0,
        },
        {
          id: `w-m-${id}-r`,
          length: d,
          position: { x: w, z: d },
          rotation: -90,
        },
        {
          id: `w-m-${id}-b`,
          length: w,
          position: { x: w, z: 0 },
          rotation: 180,
        },
      ],
      appliances: [],
      doors: [],
      windows: [],
    };

    onSave(room);
  };

  const canSave = (parseFloat(width) || 0) > 0 && (parseFloat(depth) || 0) > 0;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: colors.surface,
          maxWidth: 312,
          alignSelf: "center",
          width: "80%",
        }}
      >
        <Dialog.Content style={{ paddingBottom: 0 }}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="headlineSmall" style={{ color: colors.onSurface }}>
              Add Room Manually
            </Text>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.onSurfaceVariant}
              onPress={onDismiss}
            />
          </View>

          <TextInput
            mode="outlined"
            label="Room Name"
            value={name}
            onChangeText={setName}
            right={
              name ? (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialIcons name="close" size={size} color={color} />
                  )}
                  onPress={() => setName("")}
                />
              ) : null
            }
            outlineStyle={{ borderRadius: 8 }}
            style={{ marginBottom: 16, backgroundColor: colors.surface }}
          />

          <TextInput
            mode="outlined"
            label="Width (meters)"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
            right={
              width ? (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialIcons name="close" size={size} color={color} />
                  )}
                  onPress={() => setWidth("")}
                />
              ) : null
            }
            outlineStyle={{ borderRadius: 8 }}
            style={{ marginBottom: 16, backgroundColor: colors.surface }}
          />

          <TextInput
            mode="outlined"
            label="Depth (meters)"
            value={depth}
            onChangeText={setDepth}
            keyboardType="numeric"
            right={
              depth ? (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialIcons name="close" size={size} color={color} />
                  )}
                  onPress={() => setDepth("")}
                />
              ) : null
            }
            outlineStyle={{ borderRadius: 8 }}
            style={{ marginBottom: 8, backgroundColor: colors.surface }}
          />
        </Dialog.Content>

        <Dialog.Actions style={{ flexGrow: 0 }}>
          <Button mode="text" textColor={colors.error} onPress={onDismiss}>
            Cancel
          </Button>
          <Button
            mode="text"
            textColor={canSave ? colors.primary : colors.onSurfaceVariant}
            disabled={!canSave}
            onPress={handleSave}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ManualRoomDialog;
