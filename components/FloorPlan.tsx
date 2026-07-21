import { useTheme } from "@/hooks/useTheme";
import type { AppTheme } from "@/types/common";
import { StylableFC } from "@/types/common";
import type { Appliance } from "@/types/appliance";
import type { DoorWindow, Room, Wall } from "@/types/room";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  type SharedValue,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

type Edge = "bottom" | "top" | "left" | "right";

type FloorPlanProps = {
  rooms: Room[];
  editable?: boolean;
  roomEditable?: boolean;
  applianceEditable?: boolean;
  selectedApplianceId?: string;
  onRoomMove?: (roomId: string, origin: { x: number; z: number }) => void;
  onRoomRotate?: (roomId: string, rotation: number) => void;
  onApplianceUpdate?: (roomId: string, appliance: Appliance) => void;
  topInset?: number;
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

function rotateXZ(
  px: number,
  pz: number,
  cx: number,
  cz: number,
  degrees: number,
) {
  const rad = (-degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dz = pz - cz;
  return { x: cx + dx * cos - dz * sin, z: cz + dx * sin + dz * cos };
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

function roomPolygon(walls: Wall[]): { x: number; z: number }[] {
  const eps = 0.02;
  const points = walls.flatMap((w) => {
    const e = wallEndpoints(w);
    return [{ x: e.x1, z: e.z1 }, { x: e.x2, z: e.z2 }];
  });
  const unique: { x: number; z: number }[] = [];
  for (const p of points) {
    if (
      !unique.some(
        (u) => Math.abs(u.x - p.x) < eps && Math.abs(u.z - p.z) < eps,
      )
    ) {
      unique.push(p);
    }
  }
  const cx = unique.reduce((s, p) => s + p.x, 0) / unique.length;
  const cz = unique.reduce((s, p) => s + p.z, 0) / unique.length;
  unique.sort(
    (a, b) => Math.atan2(a.z - cz, a.x - cx) - Math.atan2(b.z - cz, b.x - cx),
  );
  return unique;
}

function globalBounds(rooms: Room[]) {
  const points = rooms.flatMap((r) => {
    const o = r.origin ?? { x: 0, z: 0 };
    const rot = r.rotation ?? 0;
    if (!r.walls) return [];
    const bounds = roomBounds(r.walls);
    const cx = (bounds.minX + bounds.maxX) / 2;
    const cz = (bounds.minZ + bounds.maxZ) / 2;
    return r.walls.flatMap((w) => {
      const e = wallEndpoints(w);
      const p1 = rot ? rotateXZ(e.x1, e.z1, cx, cz, rot) : { x: e.x1, z: e.z1 };
      const p2 = rot ? rotateXZ(e.x2, e.z2, cx, cz, rot) : { x: e.x2, z: e.z2 };
      return [
        { x: p1.x + o.x, z: p1.z + o.z },
        { x: p2.x + o.x, z: p2.z + o.z },
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

const SNAP_ANGLE_TOLERANCE = 20;

function doorFacingDeg(
  bounds: ReturnType<typeof roomBounds>,
  door: DoorWindow,
): number | null {
  if (door.rotation !== undefined) return door.rotation;
  const edge = detectEdge(bounds, door);
  if (!edge) return null;
  return edge === "bottom" || edge === "top" ? 0 : 90;
}

function anglesParallel(a: number, b: number): boolean {
  const diff = (((a - b) % 180) + 180) % 180;
  return diff < SNAP_ANGLE_TOLERANCE || diff > 180 - SNAP_ANGLE_TOLERANCE;
}

function findDoorSnap(
  draggedRoom: Room,
  draggedOrigin: { x: number; z: number },
  allRooms: Room[],
  rotations: Record<string, number>,
): { x: number; z: number } | null {
  if (!draggedRoom.doors || draggedRoom.doors.length === 0) return null;
  if (!draggedRoom.walls) return null;

  const draggedBounds = roomBounds(draggedRoom.walls);
  const roomCX = draggedOrigin.x + (draggedBounds.minX + draggedBounds.maxX) / 2;
  const roomCZ = draggedOrigin.z + (draggedBounds.minZ + draggedBounds.maxZ) / 2;
  const draggedRot = rotations[draggedRoom.id] ?? 0;

  let best: { x: number; z: number; dist: number } | null = null;

  for (const door of draggedRoom.doors) {
    const dAngle = doorFacingDeg(draggedBounds, door);
    if (dAngle === null) continue;
    const dGlobalAngle = dAngle + draggedRot;

    const rawGlobal = {
      x: draggedOrigin.x + door.position.x,
      z: draggedOrigin.z + door.position.z,
    };
    const dGlobal = draggedRot
      ? rotateXZ(rawGlobal.x, rawGlobal.z, roomCX, roomCZ, draggedRot)
      : rawGlobal;

    for (const other of allRooms) {
      if (other.id === draggedRoom.id) continue;
      if (!other.doors || !other.walls) continue;
      const otherBounds = roomBounds(other.walls);
      const otherRot = rotations[other.id] ?? 0;

      for (const otherDoor of other.doors) {
        const oAngle = doorFacingDeg(otherBounds, otherDoor);
        if (oAngle === null) continue;
        if (!anglesParallel(dGlobalAngle, oAngle + otherRot)) continue;

        const otherOrigin = other.origin ?? { x: 0, z: 0 };
        const otherCX = otherOrigin.x + (otherBounds.minX + otherBounds.maxX) / 2;
        const otherCZ = otherOrigin.z + (otherBounds.minZ + otherBounds.maxZ) / 2;
        const oRawGlobal = {
          x: otherOrigin.x + otherDoor.position.x,
          z: otherOrigin.z + otherDoor.position.z,
        };
        const oGlobal = otherRot
          ? rotateXZ(oRawGlobal.x, oRawGlobal.z, otherCX, otherCZ, otherRot)
          : oRawGlobal;

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

function ApplianceLabel({
  x,
  y,
  text,
  fontSize,
  fill,
  rotation,
  applianceRotation = 0,
}: {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  rotation: SharedValue<number>;
  applianceRotation?: number;
}) {
  const counterProps = useAnimatedProps(() => ({
    transform: [
      { translateX: x },
      { translateY: y },
      { rotate: `${-(rotation.value + applianceRotation)}deg` },
      { translateX: -x },
      { translateY: -y },
    ],
  }));

  return (
    <AnimatedG animatedProps={counterProps}>
      <SvgText
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={fontSize}
        fill={fill}
      >
        {text}
      </SvgText>
    </AnimatedG>
  );
}

function AnimatedApplianceGroup({
  id,
  cx,
  cy,
  aw,
  ah,
  name,
  fontSize,
  fill,
  stroke,
  onSurfaceFill,
  displayRot,
  rotation,
  isDragging,
  dragDX,
  dragDY,
}: {
  id: string;
  cx: number;
  cy: number;
  aw: number;
  ah: number;
  name: string;
  fontSize: number;
  fill: string;
  stroke: string;
  onSurfaceFill: string;
  displayRot: number;
  rotation: SharedValue<number>;
  isDragging: SharedValue<string>;
  dragDX: SharedValue<number>;
  dragDY: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    transform: [
      {
        translateX:
          cx + (isDragging.value === id ? dragDX.value : 0),
      },
      {
        translateY:
          cy + (isDragging.value === id ? dragDY.value : 0),
      },
      { rotate: `${displayRot}deg` },
      { translateX: -cx },
      { translateY: -cy },
    ],
  }));

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Rect
        x={cx - aw / 2}
        y={cy - ah / 2}
        width={aw}
        height={ah}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
        rx={2}
      />
      {aw > 25 && ah > 14 && (
        <ApplianceLabel
          x={cx}
          y={cy + 4}
          text={name.length > 8 ? name.slice(0, 8) + ".." : name}
          fontSize={fontSize}
          fill={onSurfaceFill}
          rotation={rotation}
          applianceRotation={displayRot}
        />
      )}
    </AnimatedG>
  );
}

function ApplianceSelectionHighlight({
  id, cx, cy, aw, ah, color, isDragging, dragDX, dragDY,
}: {
  id: string; cx: number; cy: number; aw: number; ah: number; color: string;
  isDragging: SharedValue<string>; dragDX: SharedValue<number>; dragDY: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: cx + (isDragging.value === id ? dragDX.value : 0) },
      { translateY: cy + (isDragging.value === id ? dragDY.value : 0) },
    ],
  }));
  return (
    <AnimatedG animatedProps={animatedProps}>
      <Rect x={-aw / 2 - 2} y={-ah / 2 - 2} width={aw + 4} height={ah + 4}
        fill="none" stroke={color} strokeWidth={2.5} rx={4} strokeDasharray="6,3" />
    </AnimatedG>
  );
}

function RoomGroup({
  room,
  colors,
  gb,
  scale,
  offsetX,
  offsetY,
  dragDX,
  dragDY,
  draggingRoomId,
  draggingApplianceId,
  applDragDX,
  applDragDY,
  selectedApplianceId,
}: {
  room: Room;
  colors: AppTheme["colors"];
  gb: ReturnType<typeof globalBounds>;
  scale: number;
  offsetX: number;
  offsetY: number;
  dragDX: SharedValue<number>;
  dragDY: SharedValue<number>;
  draggingRoomId: SharedValue<string>;
  draggingApplianceId: SharedValue<string>;
  applDragDX: SharedValue<number>;
  applDragDY: SharedValue<number>;
  selectedApplianceId?: string;
}) {
  const walls = useMemo(() => room.walls ?? [], [room.walls]);
  const doors = room.doors ?? [];
  const windows = room.windows ?? [];
  const appliances = room.appliances ?? [];
  const o = room.origin ?? { x: 0, z: 0 };

  const roomRotation = useSharedValue(room.rotation ?? 0);

  const localBounds = useMemo(() => roomBounds(walls), [walls]);

  const labelScreen = useMemo(() => {
    const cx = o.x + (localBounds.minX + localBounds.maxX) / 2;
    const cz = o.z + (localBounds.minZ + localBounds.maxZ) / 2;
    return toScreen(cx, cz, gb, scale, offsetX, offsetY);
  }, [localBounds, o.x, o.z, gb, scale, offsetX, offsetY]);

  const applianceHitBoxes = useMemo(
    () => {
      const roomRot = room.rotation ?? 0;
      return appliances
        .filter((a) => a.position && a.dimensions)
        .map((a) => {
          const sc = toScreen(
            a.position!.x + o.x,
            a.position!.z + o.z,
            gb,
            scale,
            offsetX,
            offsetY,
          );
          const rotated = roomRot
            ? rotateXZ(sc.sx, sc.sy, labelScreen.sx, labelScreen.sy, roomRot)
            : { x: sc.sx, z: sc.sy };
          const aw = Math.max(a.dimensions!.x * scale, 12);
          const ah = Math.max(a.dimensions!.z * scale, 12);
          return {
            id: a.id,
            x: rotated.x - aw / 2,
            y: rotated.z - ah / 2,
            w: aw,
            h: ah,
            pos: a.position!,
            rot: a.rotation ?? 0,
          };
        });
    },
    [appliances, o.x, o.z, gb, scale, offsetX, offsetY, labelScreen, room.rotation],
  );

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

  const floorCorners = roomPolygon(walls).map(floorCorner);

  const floorPath =
    floorCorners
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.sx} ${c.sy}`)
      .join(" ") + " Z";

  const animatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: (draggingRoomId.value === room.id ? dragDX.value : 0) + labelScreen.sx },
      { translateY: (draggingRoomId.value === room.id ? dragDY.value : 0) + labelScreen.sy },
      { rotate: `${roomRotation.value}deg` },
      { translateX: -labelScreen.sx },
      { translateY: -labelScreen.sy },
    ],
  }));

  const textAnimatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: draggingRoomId.value === room.id ? dragDX.value : 0 },
      { translateY: draggingRoomId.value === room.id ? dragDY.value : 0 },
    ],
  }));

  return (
    <G>
        <AnimatedG animatedProps={animatedProps}>
          <Path d={floorPath} fill={colors.surfaceContainerHighest} />

          {appliances.map((a) => {
            if (!a.position || !a.dimensions) return null;
            const sc = toScreen(
              a.position.x + o.x,
              a.position.z + o.z,
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
                <AnimatedApplianceGroup
                  id={a.id}
                  cx={sc.sx}
                  cy={sc.sy}
                  aw={aw}
                  ah={ah}
                  name={a.name}
                  fontSize={Math.min(aw / 5, ah / 2.5, 8)}
                  fill={color}
                  stroke={selectedApplianceId === a.id ? colors.primary : colors.outline}
                  onSurfaceFill={colors.onSurface}
                  displayRot={a.rotation ?? 0}
                  rotation={roomRotation}
                  isDragging={draggingApplianceId}
                  dragDX={applDragDX}
                  dragDY={applDragDY}
                />
                {selectedApplianceId === a.id && (
                  <ApplianceSelectionHighlight id={a.id} cx={sc.sx} cy={sc.sy} aw={aw} ah={ah}
                    color={colors.primary} isDragging={draggingApplianceId} dragDX={applDragDX} dragDY={applDragDY} />
                )}
              </G>
            );
          })}

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

            if (d.rotation !== undefined) {
              const gapW = dw + WALL_STROKE * 2;
              const gapH = dd + WALL_STROKE * 2;
              return (
                <Rect
                  key={d.id}
                  x={along.sx - gapW / 2}
                  y={along.sy - gapH / 2}
                  width={gapW}
                  height={gapH}
                  fill={colors.background}
                  transform={`rotate(${d.rotation} ${along.sx} ${along.sy})`}
                />
              );
            }

            const edge = detectEdge(localBounds, d);
            if (!edge) return null;

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

            if (w.rotation !== undefined) {
              return (
                <Rect
                  key={w.id}
                  x={sc.sx - ww / 2}
                  y={sc.sy - wd / 2}
                  width={ww}
                  height={wd}
                  fill={colors.tertiaryContainer}
                  stroke={colors.tertiary}
                  strokeWidth={1}
                  rx={1}
                  transform={`rotate(${w.rotation} ${sc.sx} ${sc.sy})`}
                />
              );
            }

            const edge = detectEdge(localBounds, w);
            if (!edge) return null;
            const isHorizontal = edge === "bottom" || edge === "top";
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
        </AnimatedG>

        <AnimatedG animatedProps={textAnimatedProps}>
          <SvgText
            x={labelScreen.sx}
            y={labelScreen.sy}
            textAnchor="middle"
            fontSize={Math.max(
              12,
              Math.min(room.name.length > 6 ? 10 : 12, scale * 1.5),
            )}
            fill={colors.onSurface}
            opacity={0.5}
          >
            {room.name}
          </SvgText>
        </AnimatedG>
      </G>
  );
}

const FloorPlan: StylableFC<FloorPlanProps> = ({
  rooms,
  editable = false,
  roomEditable,
  applianceEditable,
  selectedApplianceId,
  onRoomMove,
  onRoomRotate,
  onApplianceUpdate,
  topInset = 0,
  className,
  style,
}) => {
  const { colors } = useTheme();
  const hasAnyEditMode = editable || roomEditable || applianceEditable;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const roomRotationsRef = useRef<Record<string, number>>({});
  const viewRef = useAnimatedRef<any>();
  const svgPos = useSharedValue({ x: 0, y: 0 });

  const scaleSh = useSharedValue(1);

  const draggingRoomId = useSharedValue("");
  const dragDX = useSharedValue(0);
  const dragDY = useSharedValue(0);
  const startRoomOrigin = useSharedValue({ x: 0, z: 0 });
  const draggingApplianceId = useSharedValue("");
  const draggingApplianceRoomId = useSharedValue("");
  const applDragDX = useSharedValue(0);
  const applDragDY = useSharedValue(0);
  const applStartPos = useSharedValue({ x: 0, z: 0 });
  const roomRotationsSh = useSharedValue<Record<string, number>>({});

  useEffect(() => {
    rooms.forEach((r) => {
      if (r.rotation !== undefined && roomRotationsRef.current[r.id] === undefined) {
        roomRotationsRef.current[r.id] = r.rotation;
      }
    });
  }, [rooms]);

  useEffect(() => {
    roomRotationsSh.value = { ...roomRotationsRef.current };
  }, [rooms, roomRotationsSh]);

  useEffect(() => {
    if (size.width === 0) return;
    runOnUI(() => {
      if (!(viewRef as any)._viewTag) return;
      const pos = measure(viewRef);
      if (pos) {
        svgPos.value = { x: pos.pageX, y: pos.pageY };
      }
    })();
  }, [size, viewRef, svgPos]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
    runOnUI(() => {
      if (!(viewRef as any)._viewTag) return;
      const pos = measure(viewRef);
      if (pos) {
        svgPos.value = { x: pos.pageX, y: pos.pageY };
      }
    })();
  }, [viewRef, svgPos]);

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
    .minPointers(hasAnyEditMode ? 2 : 1)
    .onStart(() => {
      startPanX.value = panX.value;
      startPanY.value = panY.value;
    })
    .onUpdate((e) => {
      panX.value = startPanX.value + e.translationX;
      panY.value = startPanY.value + e.translationY;
    });

  const floorHitDataRef = useSharedValue<typeof floorHitData>([] as any);

  const roomPan = Gesture.Pan()
    .enabled(!!hasAnyEditMode)
    .maxPointers(1)
    .onStart((e) => {
      const lx = e.absoluteX - svgPos.value.x;
      const ly = e.absoluteY - svgPos.value.y;
      const hitData = floorHitDataRef.value;
      let hitRoom: (typeof hitData)[number] | undefined;
      let hitAppl: (typeof hitData)[number]["appliances"][number] | undefined;

      for (const roomData of hitData) {
        const apps = selectedApplianceId
          ? roomData.appliances.filter((a) => a.id === selectedApplianceId)
          : roomData.appliances;
        for (const a of apps) {
          if (lx >= a.x && lx <= a.x + a.w && ly >= a.y && ly <= a.y + a.h) {
            hitRoom = roomData;
            hitAppl = a;
            break;
          }
        }
        if (hitAppl) break;
      }

      if (!hitAppl) {
        for (const roomData of hitData) {
          const cx = roomData.centerScreen.sx;
          const cy = roomData.centerScreen.sy;
          if (
            lx >= cx - roomData.roomScreenW / 2 &&
            lx <= cx + roomData.roomScreenW / 2 &&
            ly >= cy - roomData.roomScreenD / 2 &&
            ly <= cy + roomData.roomScreenD / 2
          ) {
            hitRoom = roomData;
            break;
          }
        }
      }

      if (hitAppl && applianceEditable) {
        draggingApplianceId.value = hitAppl.id;
        draggingApplianceRoomId.value = hitRoom!.roomId;
        draggingRoomId.value = "";
        applStartPos.value = { x: hitAppl.pos.x, z: hitAppl.pos.z };
      } else if (hitRoom && roomEditable) {
        draggingApplianceId.value = "";
        draggingApplianceRoomId.value = "";
        draggingRoomId.value = hitRoom.roomId;
        startRoomOrigin.value = { x: hitRoom.roomOrigin.x, z: hitRoom.roomOrigin.z };
      } else {
        draggingApplianceId.value = "";
        draggingApplianceRoomId.value = "";
        draggingRoomId.value = "";
      }
    })
    .onUpdate((e) => {
      if (draggingApplianceId.value) {
        applDragDX.value = e.translationX;
        applDragDY.value = e.translationY;
      } else if (draggingRoomId.value) {
        dragDX.value = e.translationX;
        dragDY.value = e.translationY;
      }
    })
    .onEnd(() => {
      const aid = draggingApplianceId.value;
      const rid = draggingApplianceRoomId.value;
      if (aid && rid) {
        const dx = applDragDX.value / scaleSh.value;
        const dz = -applDragDY.value / scaleSh.value;
        const rot = roomRotationsSh.value[rid] ?? 0;
        const rad = (rot * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const localDx = dx * cos - dz * sin;
        const localDz = dx * sin + dz * cos;
        runOnJS(handleApplianceDragEnd)(rid, aid, localDx, localDz);
        draggingApplianceId.value = "";
        draggingApplianceRoomId.value = "";
        applDragDX.value = 0;
        applDragDY.value = 0;
      } else if (draggingRoomId.value) {
        const origin = {
          x: startRoomOrigin.value.x + dragDX.value / scaleSh.value,
          z: startRoomOrigin.value.z - dragDY.value / scaleSh.value,
        };
        runOnJS(handleRoomDragEnd)(draggingRoomId.value, origin);
        draggingRoomId.value = "";
        dragDX.value = 0;
        dragDY.value = 0;
      }
    });

  const roomDoubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(150)
    .enabled(!!hasAnyEditMode)
    .onEnd((e) => {
      const lx = e.absoluteX - svgPos.value.x;
      const ly = e.absoluteY - svgPos.value.y;
      const hitData = floorHitDataRef.value;
      let hitAppl: typeof hitData[number]["appliances"][number] | undefined;
      let hitRoom: typeof hitData[number] | undefined;

      for (const roomData of hitData) {
        const apps = selectedApplianceId
          ? roomData.appliances.filter((a) => a.id === selectedApplianceId)
          : roomData.appliances;
        for (const a of apps) {
          if (lx >= a.x && lx <= a.x + a.w && ly >= a.y && ly <= a.y + a.h) {
            hitRoom = roomData;
            hitAppl = a;
            break;
          }
        }
        if (hitAppl) break;
      }

      if (!hitAppl) {
        for (const roomData of hitData) {
          const cx = roomData.centerScreen.sx;
          const cy = roomData.centerScreen.sy;
          if (
            lx >= cx - roomData.roomScreenW / 2 &&
            lx <= cx + roomData.roomScreenW / 2 &&
            ly >= cy - roomData.roomScreenD / 2 &&
            ly <= cy + roomData.roomScreenD / 2
          ) {
            hitRoom = roomData;
            break;
          }
        }
      }

      if (hitAppl && applianceEditable) {
        const newRot = (hitAppl.rot + 90) % 360;
        const roomId = hitRoom!.roomId;
        const appId = hitAppl.id;
        const room = rooms.find((r) => r.id === roomId);
        const appl = room?.appliances?.find((a) => a.id === appId);
        if (appl && onApplianceUpdate) {
          onApplianceUpdate(roomId, { ...appl, rotation: newRot });
        }
      } else if (hitRoom && roomEditable) {
        const newRot = ((roomRotationsRef.current[hitRoom.roomId] ?? hitRoom.roomRotation) + 90) % 360;
        roomRotationsRef.current[hitRoom.roomId] = newRot;
        roomRotationsSh.value = { ...roomRotationsRef.current };
        onRoomRotate?.(hitRoom.roomId, newRot);
      }
    });

  const roomGesture = Gesture.Race(roomDoubleTap, roomPan);

  const composed = Gesture.Exclusive(roomGesture, Gesture.Simultaneous(globalPan, pinch));

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

    const availH = size.height - topInset;
    const scaleX = size.width / paddedW;
    const scaleZ = availH / paddedD;
    const scale = Math.min(scaleX, scaleZ) || 1;

    const svgW = paddedW * scale;
    const svgH = paddedD * scale;
    const ox = (size.width - svgW) / 2;
    const oy = topInset + (availH - svgH) / 2;

    const offsetX = ox + padding * scale;
    const offsetY = oy + padding * scale;

    return { scale, offsetX, offsetY };
  }, [gb, size, topInset]);

  useEffect(() => {
    scaleSh.value = transforms.scale;
  }, [transforms.scale, scaleSh]);

  const handleRoomMove = useCallback(
    (roomId: string, origin: { x: number; z: number }) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      const snapped = findDoorSnap(room, origin, rooms, roomRotationsRef.current);
      onRoomMove?.(roomId, snapped ?? origin);
    },
    [rooms, onRoomMove],
  );

  const floorHitData = useMemo(
    () => {
      return rooms.map((room) => {
        const o = room.origin ?? { x: 0, z: 0 };
        const rot = roomRotationsRef.current[room.id] ?? room.rotation ?? 0;
        const localBounds = roomBounds(room.walls ?? []);
        const labelScreen = toScreen(
          o.x + (localBounds.minX + localBounds.maxX) / 2,
          o.z + (localBounds.minZ + localBounds.maxZ) / 2,
          gb,
          transforms.scale,
          transforms.offsetX,
          transforms.offsetY,
        );

        const appliances = (room.appliances ?? [])
          .filter((a) => a.position && a.dimensions)
          .map((a) => {
            const sc = toScreen(
              a.position!.x + o.x,
              a.position!.z + o.z,
              gb,
              transforms.scale,
              transforms.offsetX,
              transforms.offsetY,
            );
            const rotated = rot
              ? rotateXZ(sc.sx, sc.sy, labelScreen.sx, labelScreen.sy, rot)
              : { x: sc.sx, z: sc.sy };
            const aw = Math.max(a.dimensions!.x * transforms.scale, 12);
            const ah = Math.max(a.dimensions!.z * transforms.scale, 12);
            return {
              id: a.id,
              x: rotated.x - aw / 2,
              y: rotated.z - ah / 2,
              w: aw,
              h: ah,
              pos: a.position!,
              rot: a.rotation ?? 0,
            };
          });

        const roomW = localBounds.maxX - localBounds.minX;
        const roomD = localBounds.maxZ - localBounds.minZ;
        const roomScreenW = roomW * transforms.scale;
        const roomScreenD = roomD * transforms.scale;

        return {
          roomId: room.id,
          roomOrigin: o,
          roomRotation: rot,
          centerScreen: labelScreen,
          roomScreenW,
          roomScreenD,
          appliances,
        };
      });
    },
    [rooms, gb, transforms],
  );

  useEffect(() => { floorHitDataRef.value = floorHitData; }, [floorHitData]);

  const handleApplianceDragEnd = useCallback(
    (roomId: string, applianceId: string, dx: number, dy: number) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;
      const appl = room.appliances?.find((a) => a.id === applianceId);
      if (!appl || !onApplianceUpdate) return;
      onApplianceUpdate(roomId, {
        ...appl,
        position: {
          x: appl.position?.x ?? 0 + dx,
          y: appl.position?.y ?? 0,
          z: appl.position?.z ?? 0 + dy,
        },
      });
    },
    [rooms, onApplianceUpdate],
  );

  const handleRoomDragEnd = useCallback(
    (roomId: string, origin: { x: number; z: number }) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;
      const snapped = findDoorSnap(room, origin, rooms, roomRotationsRef.current);
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
          ref={viewRef}
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
                dragDX={dragDX}
                dragDY={dragDY}
                draggingRoomId={draggingRoomId}
                draggingApplianceId={draggingApplianceId}
                applDragDX={applDragDX}
                applDragDY={applDragDY}
                selectedApplianceId={room.appliances?.some((a) => a.id === selectedApplianceId) ? selectedApplianceId : undefined}
              />
            ))}
          </AnimatedG>
        </Svg>
      </View>
    </GestureDetector>
  );
};

export default FloorPlan;
