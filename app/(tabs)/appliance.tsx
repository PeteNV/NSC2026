import AppBar from "@/components/common/AppBar";
import List from "@/components/common/List";
import ApplianceListItem from "@/components/room/ApplianceListItem";
import type { Appliance } from "@/types/appliance";
import { useTheme } from "@/hooks/useTheme";
import { loadAppliances, saveAppliances } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_APPLIANCES: Appliance[] = [
  { id: "1", name: "Refrigerator", usage: 24, power: 150 },
  { id: "2", name: "Air Conditioner", usage: 8, power: 1500 },
  { id: "3", name: "Washing Machine", usage: 2, power: 500 },
  { id: "4", name: "LED Lights (6)", usage: 6, power: 60 },
  { id: "5", name: "Television", usage: 4, power: 120 },
  { id: "6", name: "Microwave", usage: 1, power: 1200 },
  { id: "7", name: "Laptop", usage: 6, power: 65 },
  { id: "8", name: "Water Heater", usage: 3, power: 2000 },
  { id: "9", name: "Ceiling Fan", usage: 10, power: 75 },
  { id: "10", name: "Clothes Dryer", usage: 2, power: 1800 },
];

export default function ApplianceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadAppliances();
      if (cancelled) return;
      if (stored && stored.length > 0) {
        setAppliances(stored);
      } else {
        setAppliances(MOCK_APPLIANCES);
        await saveAppliances(MOCK_APPLIANCES);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleEdit = useCallback(
    (data: Appliance) => {
      setAppliances((prev) => {
        const next = prev.map((a) => (a.id === data.id ? data : a));
        saveAppliances(next);
        return next;
      });
    },
    [],
  );

  const handleDelete = useCallback(
    (applianceId: string) => {
      setAppliances((prev) => {
        const next = prev.filter((a) => a.id !== applianceId);
        saveAppliances(next);
        return next;
      });
    },
    [],
  );

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AppBar title="All Appliances" />
      <View className="flex-1 px-4">
        <List
          data={appliances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ApplianceListItem
              room={item}
              onEdit={handleEdit}
              onDelete={() => handleDelete(item.id)}
              style={{ backgroundColor: colors.surfaceContainer }}
            />
          )}
        />
      </View>
    </View>
  );
}
