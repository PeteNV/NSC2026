import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Menu,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import type { ApplianceData } from "./ApplianceListItem";

const APPLIANCE_TYPES = [
  "Air conditioner",
  "Refrigerator",
  "Washing Machine",
  "Television",
  "Microwave",
  "Water Heater",
  "Laptop",
  "Ceiling Fan",
  "Clothes Dryer",
  "LED Lights",
  "Other",
];

const EditApplianceDialog: StylableFC<{
  visible: boolean;
  onDismiss: () => void;
  appliance?: ApplianceData;
  onSave?: (data: ApplianceData) => void;
}> = ({ visible, onDismiss, appliance, onSave, className, style }) => {
  const { colors } = useTheme();
  const [name, setName] = useState(appliance?.name ?? "");
  const [type, setType] = useState(appliance?.name ?? "Air conditioner");
  const [power, setPower] = useState(String(appliance?.power ?? "2400"));
  const [hours, setHours] = useState(
    String(Math.floor(appliance?.usage ?? 20)),
  );
  const [minutes, setMinutes] = useState(
    String(Math.round(((appliance?.usage ?? 0) % 1) * 60)),
  );
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<"hours" | "minutes" | null>(
    null,
  );

  const handleSave = () => {
    const hoursNum = parseInt(hours, 10) || 0;
    const minutesNum = parseInt(minutes, 10) || 0;
    onSave?.({
      id: appliance?.id ?? String(Date.now()),
      name,
      usage: hoursNum + minutesNum / 60,
      power: parseInt(power, 10) || 0,
    });
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: colors.surface,
          maxWidth: 312,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <Dialog.Content>
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="headlineSmall" style={{ color: colors.onSurface }}>
              Edit Appliance
            </Text>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.onSurfaceVariant}
              onPress={onDismiss}
            />
          </View>

          {/* Name */}
          <TextInput
            mode="outlined"
            label="Name"
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

          {/* Type */}
          <Menu
            visible={typeMenuVisible}
            onDismiss={() => setTypeMenuVisible(false)}
            anchorPosition="bottom"
            anchor={
              <TextInput
                mode="outlined"
                label="Type"
                value={type}
                editable={false}
                showSoftInputOnFocus={false}
                right={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={size}
                        color={color}
                      />
                    )}
                    onPress={() => setTypeMenuVisible(true)}
                  />
                }
                outlineStyle={{ borderRadius: 8 }}
                style={{ marginBottom: 16, backgroundColor: colors.surface }}
                onPressIn={() => setTypeMenuVisible(true)}
              />
            }
            contentStyle={{ backgroundColor: colors.surfaceContainerHigh }}
          >
            {APPLIANCE_TYPES.map((t) => (
              <Menu.Item
                key={t}
                title={t}
                onPress={() => {
                  setType(t);
                  setTypeMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          {/* Power Consumption */}
          <TextInput
            mode="outlined"
            label="Power Consumption (Watt)"
            value={power}
            onChangeText={setPower}
            keyboardType="numeric"
            autoFocus
            right={
              power ? (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialIcons name="close" size={size} color={color} />
                  )}
                  onPress={() => setPower("")}
                />
              ) : null
            }
            outlineStyle={{ borderRadius: 8 }}
            style={{ marginBottom: 16, backgroundColor: colors.surface }}
          />

          {/* Usage */}
          <Text
            variant="labelLarge"
            style={{
              color: colors.onSurfaceVariant,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            Usage
          </Text>
          <View className="mb-4 flex-1 flex-row items-center gap-3">
            {/* Hours */}
            <View className="flex-1 items-center gap-2">
              <View
                className="h-14 w-[120] justify-center rounded-lg"
                style={{
                  backgroundColor:
                    focusedField === "hours"
                      ? colors.primaryContainer
                      : colors.surfaceVariant,
                  borderWidth: 2,
                  borderColor:
                    focusedField === "hours" ? colors.primary : "transparent",
                }}
              >
                <TextInput
                  mode="flat"
                  value={hours}
                  onChangeText={setHours}
                  onFocus={() => setFocusedField("hours")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  maxLength={3}
                  underlineStyle={{ display: "none" }}
                  style={{
                    fontSize: 40,
                    backgroundColor: "transparent",
                  }}
                  contentStyle={{
                    textAlign: "center",
                    color:
                      focusedField === "hours"
                        ? colors.primary
                        : colors.onSurface,
                  }}
                />
              </View>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Hour
              </Text>
            </View>
            <Text
              variant="displaySmall"
              style={{ color: colors.onSurface, marginBottom: 24 }}
            >
              :
            </Text>
            {/* Minutes */}
            <View className="items-center gap-2">
              <View
                className="h-14 w-[120] justify-center rounded-lg"
                style={{
                  backgroundColor:
                    focusedField === "minutes"
                      ? colors.primaryContainer
                      : colors.surfaceVariant,
                  borderWidth: 2,
                  borderColor:
                    focusedField === "minutes" ? colors.primary : "transparent",
                }}
              >
                <TextInput
                  mode="flat"
                  value={minutes}
                  onChangeText={setMinutes}
                  onFocus={() => setFocusedField("minutes")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  maxLength={2}
                  underlineStyle={{ display: "none" }}
                  style={{
                    fontSize: 40,
                    backgroundColor: "transparent",
                  }}
                  contentStyle={{
                    textAlign: "center",
                    color:
                      focusedField === "minutes"
                        ? colors.primary
                        : colors.onSurface,
                  }}
                />
              </View>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Minute
              </Text>
            </View>
          </View>
        </Dialog.Content>

        {/* Footer Buttons */}
        <Dialog.Actions>
          <Button mode="text" textColor={colors.error} onPress={onDismiss}>
            Cancel
          </Button>
          <Button mode="text" textColor={colors.primary} onPress={handleSave}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditApplianceDialog;
