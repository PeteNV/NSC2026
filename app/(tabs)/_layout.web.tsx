import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  TabList,
  TabSlot,
  TabTrigger,
  type TabTriggerSlotProps,
  Tabs,
} from "expo-router/ui";
import { type ComponentProps, type Ref } from "react";
import { Pressable, Text, View } from "react-native";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: IconName;
  ref?: Ref<View>;
};

function TabButton({ label, icon, isFocused, ref, ...props }: TabButtonProps) {
  const { colors } = useTheme();
  const color = isFocused ? colors.primary : colors.onSurfaceVariant;
  return (
    <Pressable
      ref={ref}
      {...props}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 8,
      }}
    >
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={{ color, fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

export default function TabLayoutWeb() {
  const { colors } = useTheme();
  return (
    <Tabs>
      <TabSlot style={{ flexShrink: 1, flexGrow: 1, minHeight: 0 }} />
      <TabList
        style={{
          flexDirection: "row",
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant,
        }}
      >
        <TabTrigger name="index" href="/" asChild>
          <TabButton label="Home" icon="home" />
        </TabTrigger>
        <TabTrigger name="room" href="/room" resetOnFocus asChild>
          <TabButton label="Room" icon="door-sliding" />
        </TabTrigger>
        <TabTrigger name="appliance" href="/appliance" asChild>
          <TabButton label="Appliance" icon="microwave" />
        </TabTrigger>
        <TabTrigger name="report" href="/report" asChild>
          <TabButton label="Report" icon="assessment" />
        </TabTrigger>
        <TabTrigger name="scanner-test" href="/scanner-test" asChild>
          <TabButton label="Scanner Test" icon="qr-code-scanner" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
