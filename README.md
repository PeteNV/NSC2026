# myEnergy

Energy monitoring app with 3D room scanning (LiDAR / iOS RoomPlan).

## Tech Stack

- **Frontend**: Expo SDK 55, React Native 0.83.6, Expo Router, TypeScript (strict)
- **UI**: react-native-paper (Material Design 3) with custom Material 3 theme
- **Backend**: Supabase (local dev in `backend/supabase/`)
- **Native**: iOS RoomPlan + YOLO via custom `room-scanner` module
- **iOS minimum**: 16.6 (LiDAR required)

## Project Layout

```
frontend/          # Expo/RN app
├── app/           # Expo Router file-based routes
├── components/    # Reusable UI components
├── constants/     # Theme/font constants
├── hooks/         # Custom hooks
├── modules/       # Native modules (room-scanner)
└── assets/        # Images, Material 3 theme JSON
backend/           # Supabase config + ML scripts
├── supabase/      # Local Supabase config (config.toml)
└── scripts/       # Python scripts, ML models (YOLO)
```

## Development

```bash
# Install dependencies (root for frontend)
cd frontend && npm install

# Start Expo dev server
cd frontend && npx expo start
# Press 'w' for web, 'i' for iOS simulator

# Android/iOS native builds
npx expo run:android   # in frontend/
npm expo run:ios      # in frontend/

# Lint
cd frontend && npm run lint

# Supabase local dev (from backend/)
cd backend && npx supabase start
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm expo run --dev-client` | Start Expo dev server |
| `npx expo run:ios` | Build & run on iOS simulator |
| `npm expo run:android` | Build & run on Android |
| `npm run lint` | ESLint via `expo lint` |
| `npm expo start` | Start Expo for web |

## Architecture Notes

- File-based routing via `app/` directory (Expo Router)
- Native tabs via `expo-router/unstable-native-tabs`
- Path alias `@/*` maps to `frontend/*`
- Custom native module `room-scanner` in `frontend/modules/room-scanner/`
- Material 3 theme colors in `assets/material-theme.json`
- New Architecture enabled (`newArchEnabled: true`)
