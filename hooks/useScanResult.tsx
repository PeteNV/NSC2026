import React, { createContext, useContext, useState, useCallback } from "react";
import type { ScanResult } from "../modules/room-scanner/src/RoomScanner.types";

interface ScanResultContextValue {
    lastResult: ScanResult | null;
    setLastResult: (result: ScanResult) => void;
}

const ScanResultContext = createContext<ScanResultContextValue>({
    lastResult: null,
    setLastResult: () => {},
});

export function ScanResultProvider({ children }: { children: React.ReactNode }) {
    const [lastResult, setLastResult] = useState<ScanResult | null>(null);
    return (
        <ScanResultContext.Provider value={{ lastResult, setLastResult }}>
            {children}
        </ScanResultContext.Provider>
    );
}

export function useScanResult() {
    return useContext(ScanResultContext);
}
