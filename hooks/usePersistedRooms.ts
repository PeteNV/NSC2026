import { MOCK_ROOMS } from "@/utils/mock-scan-result";
import { loadRooms, saveRooms } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";
import type { Room } from "@/types/room";
import type { Appliance } from "@/types/appliance";

export function usePersistedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadRooms();
      if (cancelled) return;
      if (stored && stored.length > 0) {
        setRooms(stored);
      } else {
        setRooms(MOCK_ROOMS);
        await saveRooms(MOCK_ROOMS);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const updateAppliance = useCallback(
    async (roomId: string, updated: Appliance) => {
      setRooms((prev) => {
        const next = prev.map((r) => {
          if (r.id !== roomId) return r;
          const appliances = (r.appliances ?? []).map((a) =>
            a.id === updated.id ? { ...updated, position: a.position, dimensions: a.dimensions, source: a.source } : a,
          );
          return { ...r, appliances };
        });
        saveRooms(next);
        return next;
      });
    },
    [],
  );

  const deleteAppliance = useCallback(
    async (roomId: string, applianceId: string) => {
      setRooms((prev) => {
        const next = prev.map((r) => {
          if (r.id !== roomId) return r;
          const appliances = (r.appliances ?? []).filter(
            (a) => a.id !== applianceId,
          );
          return { ...r, appliances, applianceCount: appliances.length };
        });
        saveRooms(next);
        return next;
      });
    },
    [],
  );

  return { rooms, loaded, updateAppliance, deleteAppliance };
}
