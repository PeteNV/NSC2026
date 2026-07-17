# myEnergy — Setup Guide

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 22+ | Check with `node --version` |
| npm | 11+ | Ships with Node.js |
| Xcode | 16+ | Required for iOS (LiDAR) |
| macOS | 14+ (Sonoma) | macOS only |
| iPhone | 15 Pro / 16 Pro | LiDAR Scanner required |
| iOS | 16.6+ | Minimum for RoomPlan |

> This project is **iOS-only** — it depends on the LiDAR Scanner and Apple's RoomPlan API.

---

## 1. Clone

```bash
git clone https://github.com/PeteNV/NSC2026.git
cd NSC2026
```

---

## 2. Install Dependencies

```bash
npm install
```

If you hit peer dependency conflicts:
```bash
npm install --legacy-peer-deps
```

---

## 3. Check Version Compatibility

```bash
npx expo-doctor
```

If dependencies are out of sync, run:
```bash
npx expo install --fix
```

If `--fix` runs into peer dependency issues, install individually with `--legacy-peer-deps`.

---

## 4. Generate Native Projects

```bash
npx expo prebuild
```

This creates the `ios/` folder with an Xcode project and runs CocoaPods automatically.

> After `prebuild`, verify `modules/room-scanner/v2_patched.mlpackage` is directly under `modules/room-scanner/`, not inside `modules/room-scanner/ios/`.

---

## 5. Run on iOS

After `prebuild`, the project must be built through Xcode:

```bash
# open the Xcode workspace
open ios/myEnergy.xcworkspace
```

In Xcode:
1. Select a target device (your iPhone or a simulator)
2. Press **⌘R** (Run) to build and launch

Optionally start the Expo dev server alongside it for hot reload:
```bash
npx expo start --dev-client
```

---

## 6. Using the Room Scanner

1. Go to the **Scanner Test** tab
2. Tap **Open Full-Screen Scanner**
3. Tap **Start Room Scan** to begin LiDAR scanning
4. YOLO detects appliances in real-time
5. Tap **Stop Scanning** to finish and receive the JSON result

> **Note**: Requires an iPhone 15 Pro or later with a LiDAR Scanner.

---

## 7. Troubleshooting

### `Cannot find module 'lightningcss.darwin-arm64.node'`
Native binary is missing. Run:
```bash
npm install
```

### `Cannot find module 'babel-preset-expo'`
Dependency was dropped during version fixes. Run:
```bash
npm install
npx expo install babel-preset-expo
```

### Xcode: `MPSGraphExecutable.mm:5070: failed assertion`
The v2 model uses ops the GPU (Metal) can't handle. The code already sets `computeUnits = .cpuAndNeuralEngine`. If it still occurs, make sure you rebuilt after applying that fix.

### Map touch (move/rotate) not working
Enable editing mode (lock icon on the map) or use **Toggle select** from an appliance's ⋮ menu.

### Toggle select
1. Go to a Room page → select a room
2. Tap ⋮ on an appliance → **Toggle select**
3. The selected appliance shows a dashed blue outline on the map
4. Drag to reposition / double-tap to rotate
5. Tap again to exit selection mode

---

## 8. Project Layout

```
NSC2026/
├── app/              # Expo Router routes
├── components/       # UI components
├── hooks/            # Custom hooks
├── modules/          # Native modules (room-scanner)
│   └── room-scanner/
│       ├── ios/      # Swift source (YOLO, RoomPlan)
│       ├── src/      # TS bridge
│       └── v2_patched.mlpackage  # CoreML model
├── assets/           # Images, theme JSON
├── backend/          # Supabase + ML scripts
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 9. Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | Lint with ESLint |
| `npx expo start --web` | Run on web (limited features) |
| `npx expo run:android` | Build for Android |
| `npx expo-doctor` | Check project health |

---

## Updating Native Modules

After editing Swift files in `modules/room-scanner/ios/` or replacing the model:

```bash
npx expo prebuild   # regenerate native code
```

Then rebuild in Xcode.
