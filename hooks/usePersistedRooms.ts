import { MOCK_ROOMS } from "@/utils/mock-scan-result";
import { loadRooms, saveRooms } from "@/utils/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Room } from "@/types/room";
import type { Appliance } from "@/types/appliance";

export function usePersistedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loaded, setLoaded] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadRooms();
      if (cancelled) return;
      if (stored && stored.length > 0) {
        setRooms(stored);
      } else {
        setRooms(MOCK_ROOMS);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    saveRooms(rooms);
  }, [rooms, loaded]);

  const updateAppliance = useCallback(
    (roomId: string, updated: Appliance) => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id !== roomId) return r;
          const appliances = (r.appliances ?? []).map((a) =>
            a.id === updated.id
              ? { ...updated, position: a.position, dimensions: a.dimensions, source: a.source }
              : a,
          );
          return { ...r, appliances };
        }),
      );
    },
    [],
  );

  const deleteAppliance = useCallback(
    (roomId: string, applianceId: string) => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id !== roomId) return r;
          const appliances = (r.appliances ?? []).filter(
            (a) => a.id !== applianceId,
          );
          return { ...r, appliances, applianceCount: appliances.length };
        }),
      );
    },
    [],
  );

  return { rooms, loaded, updateAppliance, deleteAppliance };
}
