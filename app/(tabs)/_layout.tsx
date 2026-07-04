import React from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="room">
        <NativeTabs.Trigger.Icon sf="door.left.hand.open" md="door_sliding" />
        <NativeTabs.Trigger.Label>Room</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="appliance">
        <NativeTabs.Trigger.Icon sf="cooktop" md="microwave" />
        <NativeTabs.Trigger.Label>Appliance</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="report">
        <NativeTabs.Trigger.Icon sf="chart.bar" md="assessment" />
        <NativeTabs.Trigger.Label>Report</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scanner-test">
        <NativeTabs.Trigger.Label>Scanner Test</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="qrcode" md="scanner" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/*   const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  ); */
