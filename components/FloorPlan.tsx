import { useTheme } from "@/hooks/useTheme";
import type { AppTheme } from "@/types/common";
import { StylableFC } from "@/types/common";
import type { DoorWindow, Room, Wall } from "@/types/room";
import React, { useCallback, useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

type Edge = "bottom" | "top" | "left" | "right";

type FloorPlanProps = {
  rooms: Room[];
  editable?: boolean;
  onRoomMove?: (roomId: string, origin: { x: number; z: number }) => void;
};

const PADDING_RATIO = 0.12;
const WALL_STROKE = 4;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const SNAP_THRESHOLD = 0.5;

function wallEndpoints(wall: Wall) {
  const rad = (wall.rotation * Math.PI) / 180;
  return {
    x1: wall.position.x,
    z1: wall.position.z,
    x2: wall.position.x + Math.cos(rad) * wall.length,
    z2: wall.position.z + Math.sin(rad) * wall.length,
  };
}

function roomBounds(walls: Wall[]) {
  const all = walls.flatMap((w) => {
    const e = wallEndpoints(w);
    return [
      { x: e.x1, z: e.z1 },
      { x: e.x2, z: e.z2 },
    ];
  });
  return {
    minX: Math.min(...all.map((p) => p.x)),
    maxX: Math.max(...all.map((p) => p.x)),
    minZ: Math.min(...all.map((p) => p.z)),
    maxZ: Math.max(...all.map((p) => p.z)),
  };
}

function globalBounds(rooms: Room[]) {
  const points = rooms.flatMap((r) => {
    const o = r.origin ?? { x: 0, z: 0 };
    if (!r.walls) return [];
    return r.walls.flatMap((w) => {
      const e = wallEndpoints(w);
      return [
        { x: e.x1 + o.x, z: e.z1 + o.z },
        { x: e.x2 + o.x, z: e.z2 + o.z },
      ];
    });
  });
  if (points.length === 0) return { minX: 0, maxX: 1, minZ: 0, maxZ: 1 };
  return {
    minX: Math.min(...points.map((p) => p.x)),
    maxX: Math.max(...points.map((p) => p.x)),
    minZ: Math.min(...points.map((p) => p.z)),
    maxZ: Math.max(...points.map((p) => p.z)),
  };
}

function detectEdge(
  bounds: ReturnType<typeof roomBounds>,
  item: DoorWindow,
): Edge | null {
  const { minX, maxX, minZ, maxZ } = bounds;
  const eps = 0.15;
  if (Math.abs(item.position.z - minZ) < eps) return "bottom";
  if (Math.abs(item.position.z - maxZ) < eps) return "top";
  if (Math.abs(item.position.x - minX) < eps) return "left";
  if (Math.abs(item.position.x - maxX) < eps) return "right";
  return null;
}

function toScreen(
  x: number,
  z: number,
  bounds: ReturnType<typeof roomBounds>,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  return {
    sx: offsetX + (x - bounds.minX) * scale,
    sy: offsetY + (bounds.maxZ - z) * scale,
  };
}

const APPLIANCE_COLOR_KEYS = [
  "secondaryContainer",
  "tertiaryContainer",
  "primaryContainer",
  "surfaceContainerHigh",
  "errorContainer",
] as const;

type ThemeColorKey = (typeof APPLIANCE_COLOR_KEYS)[number];

const COOLING = new Set(["Refrigerator", "Freezer"]);
const COOKING = new Set(["Stove", "Oven", "Microwave"]);
const WATER = new Set([
  "Sink",
  "Dishwasher",
  "Washing Machine",
  "Water Heater",
  "Clothes Dryer",
  "Shower",
  "Toilet",
]);
const FURNITURE = new Set([
  "Sofa",
  "Bed",
  "Coffee Table",
  "Dresser",
  "Nightstand",
]);
const ELECTRONICS = new Set([
  "Television",
  "TV",
  "Laptop",
  "Computer",
  "Air Conditioner",
  "Ceiling Fan",
  "Floor Lamp",
  "LED Lights",
]);

function applianceColorKey(name: string): ThemeColorKey {
  if (COOLING.has(name)) return "secondaryContainer";
  if (COOKING.has(name)) return "errorContainer";
  if (WATER.has(name)) return "tertiaryContainer";
  if (FURNITURE.has(name)) return "surfaceContainerHigh";
  if (ELECTRONICS.has(name)) return "primaryContainer";
  return "surfaceContainerHigh";
}

function applianceColor(name: string, colors: AppTheme["colors"]): string {
  return colors[applianceColorKey(name)] ?? colors.surfaceContainerHigh;
}

function oppositeEdge(edge: Edge): Edge {
  switch (edge) {
    case "bottom": return "top";
    case "top": return "bottom";
    case "left": return "right";
    case "right": return "left";
  }
}

function globalDoorCenter(room: Room, door: DoorWindow) {
  const o = room.origin ?? { x: 0, z: 0 };
  return { x: o.x + door.position.x, z: o.z + door.position.z };
}

function findDoorSnap(
  draggedRoom: Room,
  draggedOrigin: { x: number; z: number },
  allRooms: Room[],
): { x: number; z: number } | null {
  if (!draggedRoom.doors || draggedRoom.doors.length === 0) return null;
  if (!draggedRoom.walls) return null;

  const draggedBounds = roomBounds(draggedRoom.walls);
  let best: { x: number; z: number; dist: number } | null = null;

  for (const door of draggedRoom.doors) {
    const edge = detectEdge(draggedBounds, door);
    if (!edge) continue;
    const targetEdge = oppositeEdge(edge);
    const dGlobal = {
      x: draggedOrigin.x + door.position.x,
      z: draggedOrigin.z + door.position.z,
    };

    for (const other of allRooms) {
      if (other.id === draggedRoom.id) continue;
      if (!other.doors || !other.walls) continue;
      const otherBounds = roomBounds(other.walls);

      for (const otherDoor of other.doors) {
        const oEdge = detectEdge(otherBounds, otherDoor);
        if (!oEdge || oEdge !== targetEdge) continue;
        const oGlobal = globalDoorCenter(other, otherDoor);

        const dx = dGlobal.x - oGlobal.x;
        const dz = dGlobal.z - oGlobal.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < SNAP_THRESHOLD && (!best || dist < best.dist)) {
          best = {
            x: draggedOrigin.x - dx,
            z: draggedOrigin.z - dz,
            dist,
          };
        }
      }
    }
  }

  return best ? { x: best.x, z: best.z } : null;
}

function RoomGroup({
  room,
  colors,
  gb,
  scale,
  offsetX,
  offsetY,
  editable,
  onMove,
}: {
  room: Room;
  colors: AppTheme["colors"];
  gb: ReturnType<typeof globalBounds>;
  scale: number;
  offsetX: number;
  offsetY: number;
  editable: boolean;
  onMove?: (roomId: string, origin: { x: number; z: number }) => void;
}) {
  const walls = useMemo(() => room.walls ?? [], [room.walls]);
  const doors = room.doors ?? [];
  const windows = room.windows ?? [];
  const appliances = room.appliances ?? [];
  const o = room.origin ?? { x: 0, z: 0 };

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const startDX = useSharedValue(0);
  const startDY = useSharedValue(0);
  const draggingId = useSharedValue("");

  const localBounds = useMemo(() => roomBounds(walls), [walls]);

  const pan = Gesture.Pan()
    .enabled(editable && walls.length > 0)
    .onStart(() => {
      startDX.value = dragX.value;
      startDY.value = dragY.value;
      draggingId.value = room.id;
    })
    .onUpdate((e) => {
      dragX.value = startDX.value + e.translationX;
      dragY.value = startDY.value + e.translationY;
    })
    .onEnd(() => {
      const newOrigin = {
        x: o.x + dragX.value / scale,
        z: o.z - dragY.value / scale,
      };
      dragX.value = 0;
      dragY.value = 0;
      onMove?.(room.id, newOrigin);
    });

  const animatedProps = useAnimatedProps(() => ({
    transform: `translate(${dragX.value}, ${dragY.value})`,
  }));

  const globalOriginX = o.x;
  const globalOriginZ = o.z;

  const wallLines = walls.map((w) => {
    const e = wallEndpoints(w);
    const a = toScreen(
      e.x1 + globalOriginX,
      e.z1 + globalOriginZ,
      gb,
      scale,
      offsetX,
      offsetY,
    );
    const b = toScreen(
      e.x2 + globalOriginX,
      e.z2 + globalOriginZ,
      gb,
      scale,
      offsetX,
      offsetY,
    );
    return { ...a, x2: b.sx, y2: b.sy, id: w.id };
  });

  const floorCorner = (corner: { x: number; z: number }) =>
    toScreen(
      corner.x + globalOriginX,
      corner.z + globalOriginZ,
      gb,
      scale,
      offsetX,
      offsetY,
    );

  const floorCorners = [
    { x: localBounds.minX, z: localBounds.minZ },
    { x: localBounds.maxX, z: localBounds.minZ },
    { x: localBounds.maxX, z: localBounds.maxZ },
    { x: localBounds.minX, z: localBounds.maxZ },
  ].map(floorCorner);

  const floorPath =
    floorCorners
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.sx} ${c.sy}`)
      .join(" ") + " Z";

  const roomCenter = {
    x: globalOriginX + (localBounds.minX + localBounds.maxX) / 2,
    z: globalOriginZ + (localBounds.minZ + localBounds.maxZ) / 2,
  };
  const labelScreen = toScreen(
    roomCenter.x,
    roomCenter.z,
    gb,
    scale,
    offsetX,
    offsetY,
  );

  return (
    <GestureDetector gesture={pan}>
      <AnimatedG animatedProps={animatedProps}>
        <Path d={floorPath} fill={colors.surfaceContainerHighest} />

        {wallLines.map((w) => (
          <Line
            key={w.id}
            x1={w.sx}
            y1={w.sy}
            x2={w.x2}
            y2={w.y2}
            stroke={colors.onSurface}
            strokeWidth={WALL_STROKE}
            strokeLinecap="round"
          />
        ))}

        {doors.map((d) => {
          const edge = detectEdge(localBounds, d);
          if (!edge) return null;
          const along = toScreen(
            d.position.x + globalOriginX,
            d.position.z + globalOriginZ,
            gb,
            scale,
            offsetX,
            offsetY,
          );

          const dw = d.dimensions.x * scale;
          const dd = d.dimensions.z * scale;

          const isHorizontal = edge === "bottom" || edge === "top";
          const gapW = (isHorizontal ? dw : dd) + WALL_STROKE * 2;
          const gapH = (isHorizontal ? dd : dw) + WALL_STROKE * 2;

          const gapX = along.sx - gapW / 2;
          const gapY = along.sy - gapH / 2;

          return (
            <G key={d.id}>
              <Rect
                x={gapX}
                y={gapY}
                width={gapW}
                height={gapH}
                fill={colors.background}
              />
            </G>
          );
        })}

        {windows.map((w) => {
          const edge = detectEdge(localBounds, w);
          if (!edge) return null;
          const isHorizontal = edge === "bottom" || edge === "top";
          const sc = toScreen(
            w.position.x + globalOriginX,
            w.position.z + globalOriginZ,
            gb,
            scale,
            offsetX,
            offsetY,
          );
          const ww = w.dimensions.x * scale;
          const wd = WALL_STROKE * 2;
          const wx = isHorizontal ? sc.sx - ww / 2 : sc.sx - wd / 2;
          const wy = sc.sy - (isHorizontal ? wd : ww) / 2;

          return (
            <Rect
              key={w.id}
              x={wx}
              y={wy}
              width={isHorizontal ? ww : wd}
              height={isHorizontal ? wd : ww}
              fill={colors.tertiaryContainer}
              stroke={colors.tertiary}
              strokeWidth={1}
              rx={1}
            />
          );
        })}

        {appliances.map((a) => {
          if (!a.position || !a.dimensions) return null;
          const sc = toScreen(
            a.position.x + globalOriginX,
            a.position.z + globalOriginZ,
            gb,
            scale,
            offsetX,
            offsetY,
          );
          const aw = Math.max(a.dimensions.x * scale, 12);
          const ah = Math.max(a.dimensions.z * scale, 12);
          const color = applianceColor(a.name, colors);

          return (
            <G key={a.id}>
              <Rect
                x={sc.sx - aw / 2}
                y={sc.sy - ah / 2}
                width={aw}
                height={ah}
                fill={color}
                stroke={colors.outline}
                strokeWidth={0.5}
                rx={2}
              />
              {aw > 25 && ah > 14 && (
                <SvgText
                  x={sc.sx}
                  y={sc.sy + 4}
                  textAnchor="middle"
                  fontSize={Math.min(aw / 5, ah / 2.5, 8)}
                  fill={colors.onSurface}
                >
                  {a.name.length > 8 ? a.name.slice(0, 8) + ".." : a.name}
                </SvgText>
              )}
            </G>
          );
        })}

        <SvgText
          x={labelScreen.sx}
          y={labelScreen.sy}
          textAnchor="middle"
          fontSize={Math.max(12, Math.min(room.name.length > 6 ? 10 : 12, scale * 1.5))}
          fill={colors.onSurface}
          opacity={0.5}
        >
          {room.name}
        </SvgText>
      </AnimatedG>
    </GestureDetector>
  );
}

const FloorPlan: StylableFC<FloorPlanProps> = ({
  rooms,
  editable = false,
  onRoomMove,
  className,
  style,
}) => {
  const { colors } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  const zoom = useSharedValue(1);
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const startZoom = useSharedValue(1);
  const startPanX = useSharedValue(0);
  const startPanY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      startZoom.value = zoom.value;
      startPanX.value = panX.value;
      startPanY.value = panY.value;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const newScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, startZoom.value * e.scale),
      );
      const ratio = newScale / startZoom.value;
      panX.value = focalX.value - (focalX.value - startPanX.value) * ratio;
      panY.value = focalY.value - (focalY.value - startPanY.value) * ratio;
      zoom.value = newScale;
    });

  const globalPan = Gesture.Pan()
    .minPointers(editable ? 2 : 1)
    .onStart(() => {
      startPanX.value = panX.value;
      startPanY.value = panY.value;
    })
    .onUpdate((e) => {
      panX.value = startPanX.value + e.translationX;
      panY.value = startPanY.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(globalPan, pinch);

  const animatedProps = useAnimatedProps(() => ({
    transform: `translate(${panX.value}, ${panY.value}) scale(${zoom.value})`,
  }));

  const gb = useMemo(() => globalBounds(rooms), [rooms]);

  const transforms = useMemo(() => {
    const rw = gb.maxX - gb.minX;
    const rd = gb.maxZ - gb.minZ;
    const padding = Math.max(rw, rd) * PADDING_RATIO;
    const paddedW = rw + padding * 2;
    const paddedD = rd + padding * 2;

    const scaleX = size.width / paddedW;
    const scaleZ = size.height / paddedD;
    const scale = Math.min(scaleX, scaleZ) || 1;

    const svgW = paddedW * scale;
    const svgH = paddedD * scale;
    const ox = (size.width - svgW) / 2;
    const oy = (size.height - svgH) / 2;

    const offsetX = ox + padding * scale;
    const offsetY = oy + padding * scale;

    return { scale, offsetX, offsetY };
  }, [gb, size]);

  const handleRoomMove = useCallback(
    (roomId: string, origin: { x: number; z: number }) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      const snapped = findDoorSnap(room, origin, rooms);
      onRoomMove?.(roomId, snapped ?? origin);
    },
    [rooms, onRoomMove],
  );

  if (size.width === 0 || size.height === 0) {
    return (
      <View
        onLayout={onLayout}
        className={`flex-1 ${className ?? ""}`}
        style={style}
      />
    );
  }

  const { scale, offsetX, offsetY } = transforms;

  return (
    <GestureDetector gesture={composed}>
      <View
        onLayout={onLayout}
        className={`flex-1 ${className ?? ""}`}
        style={style}
      >
        <Svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          <AnimatedG animatedProps={animatedProps}>
            {rooms.map((room) => (
              <RoomGroup
                key={room.id}
                room={room}
                colors={colors}
                gb={gb}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                editable={editable}
                onMove={handleRoomMove}
              />
            ))}
          </AnimatedG>
        </Svg>
      </View>
    </GestureDetector>
  );
};

export default FloorPlan;
