# myEnergy

Energy monitoring app with 3D room scanning (LiDAR / iOS RoomPlan).

## Tech Stack

- **Frontend**: Expo SDK 55, React Native 0.83.6, Expo Router, TypeScript
- **UI**: react-native-paper (Material Design 3), NativeWind
- **Native**: iOS RoomPlan + YOLO via custom `room-scanner` module
- **iOS minimum**: 16.6 (LiDAR required)

## Quick Start

```bash
git clone https://github.com/PeteNV/NSC2026.git
cd NSC2026
npm install
npx expo prebuild
npx expo start --dev-client
```

See full setup guides:

| Language | File |
|----------|------|
| English | [setup.en.md](setup.en.md) |
| ไทย | [setup.th.md](setup.th.md) |

## Project Layout

```
app/              # Expo Router routes
components/       # UI components
hooks/            # Custom hooks
modules/          # Native module (room-scanner)
  room-scanner/
    ios/          # Swift (YOLO, RoomPlan)
    src/          # TS bridge
    v2_patched.mlpackage  # CoreML model
assets/           # Images, theme JSON
backend/          # Supabase + ML scripts
types/            # TypeScript types
utils/            # Utility functions
```

## Features

- **3D Room Scanning** — LiDAR + RoomPlan captures walls, doors, windows, and objects
- **YOLO Object Detection** — Real-time appliance recognition during scanning
- **Floor Plan Editor** — Drag rooms, move/rotate appliances on an interactive map
- **Energy Estimation** — Baseline power and usage for scanned appliances
- **Multi-floor Support** — Up to 5 floors with per-floor room assignment

## Requirements

- **macOS** with Xcode 16+
- **iPhone 15 Pro / 16 Pro** with LiDAR Scanner
- **iOS 16.6** or later
