# คู่มือการติดตั้ง myEnergy

## สิ่งที่ต้องมีก่อนเริ่ม

| เครื่องมือ | เวอร์ชั่น | หมายเหตุ |
|-----------|----------|---------|
| Node.js | 22 ขึ้นไป | ตรวจสอบด้วย `node --version` |
| npm | 11 ขึ้นไป | มาพร้อม Node.js |
| Xcode | 16+ | จำเป็นสำหรับ iOS (LiDAR) |
| macOS | 14+ (Sonoma) | รองรับเฉพาะ macOS |
| iPhone | 15 Pro / 16 Pro | ต้องมี LiDAR Scanner |
| iOS | 16.6 ขึ้นไป | ขั้นต่ำที่ RoomPlan รองรับ |

> โปรเจคนี้ใช้ **iOS เท่านั้น** เพราะต้องใช้ LiDAR Scanner และ RoomPlan API ของ Apple

---

## 1. โคลนโปรเจค

```bash
git clone https://github.com/PeteNV/NSC2026.git
cd NSC2026
```

---

## 2. ติดตั้ง Dependencies

```bash
npm install
```

ถ้าเจอ peer dependency conflicts (npm error ERESOLVE):
```bash
npm install --legacy-peer-deps
```

---

## 3. ตรวจสอบความเข้ากันได้ของเวอร์ชั่น

```bash
npx expo-doctor
```

ถ้ามี dependency version mismatch ให้รัน:
```bash
npx expo install --fix
```

หาก `--fix` เจอปัญหา peer dependency ให้ติดตั้งทีละตัวด้วย `--legacy-peer-deps` ตามที่แนะนำ

---

## 4. สร้าง Native Projects (iOS)

```bash
npx expo prebuild
```

คำสั่งนี้จะสร้างโฟลเดอร์ `ios/` พร้อมไฟล์ Xcode project และติดตั้ง CocoaPods ให้อัตโนมัติ

> **อย่าลืม** หลังจาก `prebuild` แล้ว ควรตรวจสอบว่าไฟล์ `modules/room-scanner/v2_patched.mlpackage` อยู่ในตำแหน่งที่ถูกต้อง (อยู่ใต้ `modules/room-scanner/` โดยตรง ไม่ใช่ใน `modules/room-scanner/ios/`)

---

## 5. รันบน iOS

### วิธีที่ 1 — Expo Dev Client (recommended)

```bash
npx expo start --dev-client
```

เปิด Xcode → เลือก scheme `myEnergy` → กด Run (⌘R)

### วิธีที่ 2 — Build โดยตรง

```bash
npx expo run:ios
```

---

## 6. การใช้ฟีเจอร์สแกนห้อง

1. ไปที่แท็บ **Scanner Test**
2. กด **Open Full-Screen Scanner**
3. กด **Start Room Scan** เพื่อเริ่มสแกนห้องด้วย LiDAR
4. YOLO จะตรวจจับเครื่องใช้ไฟฟ้าแบบ real-time
5. กด **Stop Scanning** เพื่อหยุดและรับผลลัพธ์ JSON

> **หมายเหตุ**: ต้องใช้ iPhone 15 Pro ขึ้นไปที่มี LiDAR Scanner เท่านั้น

---

## 7. ปัญหาที่พบบ่อย

### `Cannot find module 'lightningcss.darwin-arm64.node'`
เกิดจาก native binary หาย ให้รัน:
```bash
npm install
```

### `Cannot find module 'babel-preset-expo'`
Dependency หายจากการแก้ version ให้รัน:
```bash
npm install
npx expo install babel-preset-expo
```

### Xcode: `MPSGraphExecutable.mm:5070: failed assertion`
โมเดล v2 ใช้ ops ที่ GPU (Metal) รันไม่ได้ → โค้ดปัจจุบันตั้ง `computeUnits = .cpuAndNeuralEngine` ไว้แล้ว หากยังเกิด ให้ตรวจสอบว่าได้ build หลังจากแก้

### ทัชบนแผนที่ (move/rotate) ไม่ทำงาน
ต้องเปิด editing mode (ไอคอนแม่กุญแจบนแผนที่) หรือใช้ Toggle select จาก ⋮ menu ในหน้ารายการเครื่องใช้ไฟฟ้า

### ตัวเลือก Toggle select
1. ไปที่หน้า Room → เลือกห้อง
2. กด ⋮ บนเครื่องใช้ไฟฟ้า → **Toggle select**
3. เครื่องใช้ไฟฟ้าที่เลือกจะมีเส้นประสีฟ้าบนแผนที่
4. ลากเพื่อย้ายตำแหน่ง / ดับเบิ้ลแทปเพื่อหมุน
5. กดอีกครั้งเพื่อออกจากโหมดเลือก

---

## 8. โครงสร้างโปรเจค

```
NSC2026/
├── app/              # Expo Router (ไฟล์ route)
├── components/       # UI components
├── hooks/            # Custom hooks
├── modules/          # Native module (room-scanner)
│   └── room-scanner/
│       ├── ios/      # Swift source (YOLO, RoomPlan)
│       ├── src/      # TS bridge
│       └── v2_patched.mlpackage  # CoreML model
├── assets/           # รูปภาพ, theme JSON
├── backend/          # Supabase + ML scripts
├── types/            # TypeScript types
└── utils/            # utility functions
```

## 9. คำสั่งอื่นๆ

| คำสั่ง | คำอธิบาย |
|-------|---------|
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |
| `npx expo start --web` | รันบนเว็บ (ฟีเจอร์จำกัด) |
| `npx expo run:android` | Build Android |
| `npx expo-doctor` | ตรวจสอบโปรเจค |

---

## การอัปเดต Native Module

หากแก้ไขไฟล์ใน `modules/room-scanner/ios/` (Swift) หรือเปลี่ยนโมเดล ต้อง:

```bash
npx expo prebuild   # regenerate native code
```

แล้ว rebuild จาก Xcode ใหม่
