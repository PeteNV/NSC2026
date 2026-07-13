import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import type { AppTheme } from "@/types/common";
import type { Appliance } from "@/types/appliance";
import type { Wall, DoorWindow } from "@/types/room";
import React, { useCallback, useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import Svg, {
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

type Edge = "bottom" | "top" | "left" | "right";

type FloorPlanProps = {
  walls: Wall[];
  doors?: DoorWindow[];
  windows?: DoorWindow[];
  appliances?: Appliance[];
};

const PADDING_RATIO = 0.12;
const WALL_STROKE = 4;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

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

function applianceColor(
  name: string,
  colors: AppTheme["colors"],
): string {
  return colors[applianceColorKey(name)] ?? colors.surfaceContainerHigh;
}

const FloorPlan: StylableFC<FloorPlanProps> = ({
  walls,
  doors = [],
  windows = [],
  appliances = [],
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
      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, startZoom.value * e.scale));
      const ratio = newScale / startZoom.value;
      panX.value = focalX.value - (focalX.value - startPanX.value) * ratio;
      panY.value = focalY.value - (focalY.value - startPanY.value) * ratio;
      zoom.value = newScale;
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      startPanX.value = panX.value;
      startPanY.value = panY.value;
    })
    .onUpdate((e) => {
      panX.value = startPanX.value + e.translationX;
      panY.value = startPanY.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animatedProps = useAnimatedProps(() => ({
    transform: `translate(${panX.value}, ${panY.value}) scale(${zoom.value})`,
  }));

  const bounds = useMemo(() => roomBounds(walls), [walls]);

  const transforms = useMemo(() => {
    const rw = bounds.maxX - bounds.minX;
    const rd = bounds.maxZ - bounds.minZ;
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
  }, [bounds, size]);

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

  const wallLines = walls.map((w) => {
    const e = wallEndpoints(w);
    const a = toScreen(e.x1, e.z1, bounds, scale, offsetX, offsetY);
    const b = toScreen(e.x2, e.z2, bounds, scale, offsetX, offsetY);
    return { ...a, x2: b.sx, y2: b.sy, id: w.id };
  });

  const floorCorner = (corner: { x: number; z: number }) =>
    toScreen(corner.x, corner.z, bounds, scale, offsetX, offsetY);

  const floorCorners = [
    { x: bounds.minX, z: bounds.minZ },
    { x: bounds.maxX, z: bounds.minZ },
    { x: bounds.maxX, z: bounds.maxZ },
    { x: bounds.minX, z: bounds.maxZ },
  ].map(floorCorner);

  const floorPath = floorCorners
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.sx} ${c.sy}`)
    .join(" ") + " Z";

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
              const edge = detectEdge(bounds, d);
              if (!edge) return null;
              const along = toScreen(
                d.position.x,
                d.position.z,
                bounds,
                scale,
                offsetX,
                offsetY,
              );

              const dw = d.dimensions.x * scale;
              const dd = d.dimensions.z * scale;

              const isHorizontal = edge === "bottom" || edge === "top";
              const gapW = isHorizontal ? dw : dd;
              const gapH = isHorizontal ? dd : dw;

              const gapX = isHorizontal
                ? along.sx - gapW / 2
                : along.sx - (edge === "right" ? gapW : 0);
              const gapY = isHorizontal
                ? along.sy - gapH / 2
                : along.sy - gapH / 2;

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
              const edge = detectEdge(bounds, w);
              if (!edge) return null;
              const isHorizontal = edge === "bottom" || edge === "top";
              const sc = toScreen(w.position.x, w.position.z, bounds, scale, offsetX, offsetY);
              const ww = w.dimensions.x * scale;
              const wd = 4;
              const wx = isHorizontal ? sc.sx - ww / 2 : sc.sx - wd / 2;
              const wy = isHorizontal ? sc.sy - wd / 2 : sc.sy - ww / 2;

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
                a.position.x + a.dimensions.x / 2,
                a.position.z + a.dimensions.z / 2,
                bounds,
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
                      {a.name.length > 8
                        ? a.name.slice(0, 8) + ".."
                        : a.name}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </AnimatedG>
        </Svg>
      </View>
    </GestureDetector>
  );
};

export default FloorPlan;
