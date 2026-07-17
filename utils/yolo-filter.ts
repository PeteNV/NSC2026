import type {
  ApplianceData,
  ScanResult,
  YOLOAppliance,
} from "@/modules/room-scanner";

const MIN_CONFIDENCE = 0.9;
const MIN_FRAME_COUNT = 2;
const MIN_SEEN_DURATION_S = 0.5;
const ROOM_MARGIN_M = 0.3;
const CLUSTER_MIN_RADIUS_M = 0.5;

const SIZE_LIMITS: Record<string, { min: number; max: number }> = {
  light: { min: 0.03, max: 0.6 },
  laptop: { min: 0.1, max: 0.6 },
  screen: { min: 0.1, max: 1.2 },
  desktop: { min: 0.15, max: 0.8 },
  television: { min: 0.3, max: 2.0 },
  refrigerator: { min: 0.4, max: 2.2 },
  washing_machine: { min: 0.3, max: 1.2 },
  oven: { min: 0.2, max: 1.0 },
  stove: { min: 0.15, max: 1.2 },
  microwave: { min: 0.2, max: 0.8 },
  air_conditioner: { min: 0.3, max: 1.5 },
  air_fryer: { min: 0.15, max: 0.8 },
  coffee_machine: { min: 0.1, max: 0.6 },
  blender: { min: 0.08, max: 0.5 },
  fan: { min: 0.2, max: 1.5 },
};

type Point = { x: number; z: number };

function wallPolygon(walls: ScanResult["walls"]): Point[] {
  const eps = 0.02;
  const points = walls.flatMap((w) => {
    const half = w.length / 2;
    const cos = Math.cos(w.rotation);
    const sin = Math.sin(w.rotation);
    return [
      { x: w.position.x - cos * half, z: w.position.z - sin * half },
      { x: w.position.x + cos * half, z: w.position.z + sin * half },
    ];
  });
  const unique: Point[] = [];
  for (const p of points) {
    if (
      !unique.some(
        (u) => Math.abs(u.x - p.x) < eps && Math.abs(u.z - p.z) < eps,
      )
    ) {
      unique.push(p);
    }
  }
  if (unique.length < 3) return unique;
  const cx = unique.reduce((s, p) => s + p.x, 0) / unique.length;
  const cz = unique.reduce((s, p) => s + p.z, 0) / unique.length;
  unique.sort(
    (a, b) => Math.atan2(a.z - cz, a.x - cx) - Math.atan2(b.z - cz, b.x - cx),
  );
  return unique;
}

function pointInPolygon(x: number, z: number, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (
      a.z > z !== b.z > z &&
      x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const abz = b.z - a.z;
  const lenSq = abx * abx + abz * abz;
  const t =
    lenSq === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((p.x - a.x) * abx + (p.z - a.z) * abz) / lenSq),
        );
  const dx = p.x - (a.x + abx * t);
  const dz = p.z - (a.z + abz * t);
  return Math.sqrt(dx * dx + dz * dz);
}

function insideRoom(x: number, z: number, poly: Point[]): boolean {
  if (poly.length < 3) return true;
  if (pointInPolygon(x, z, poly)) return true;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (distanceToSegment({ x, z }, poly[j], poly[i]) <= ROOM_MARGIN_M) {
      return true;
    }
  }
  return false;
}

function isValidDetection(d: YOLOAppliance, poly: Point[]): boolean {
  if (!d.position) return false;
  if (d.confidence < MIN_CONFIDENCE) return false;

  const duration = d.lastSeen - d.firstSeen;
  if (d.frameCount < MIN_FRAME_COUNT && duration < MIN_SEEN_DURATION_S) {
    return false;
  }

  if (d.realSize) {
    const limits = SIZE_LIMITS[d.label];
    if (limits) {
      const size = Math.max(d.realSize.width, d.realSize.height);
      if (size < limits.min || size > limits.max) return false;
    }
  }

  return insideRoom(d.position.x, d.position.z, poly);
}

function score(d: YOLOAppliance): number {
  return d.frameCount * d.confidence;
}

function dedupeDetections(detections: YOLOAppliance[]): YOLOAppliance[] {
  const sorted = [...detections].sort((a, b) => score(b) - score(a));
  const assigned = new Set<string>();
  const result: YOLOAppliance[] = [];

  for (const rep of sorted) {
    if (assigned.has(rep.id)) continue;
    assigned.add(rep.id);

    const radius = Math.max(CLUSTER_MIN_RADIUS_M, rep.realSize?.width ?? 0);
    const cluster = [rep];
    for (const other of sorted) {
      if (assigned.has(other.id) || other.label !== rep.label) continue;
      const dx = other.position!.x - rep.position!.x;
      const dz = other.position!.z - rep.position!.z;
      if (Math.sqrt(dx * dx + dz * dz) <= radius) {
        assigned.add(other.id);
        cluster.push(other);
      }
    }

    const totalWeight = cluster.reduce((s, d) => s + d.frameCount, 0);
    const position = {
      x:
        cluster.reduce((s, d) => s + d.position!.x * d.frameCount, 0) /
        totalWeight,
      y:
        cluster.reduce((s, d) => s + d.position!.y * d.frameCount, 0) /
        totalWeight,
      z:
        cluster.reduce((s, d) => s + d.position!.z * d.frameCount, 0) /
        totalWeight,
    };
    const frameCount = cluster.reduce((s, d) => s + d.frameCount, 0);
    const firstSeen = Math.min(...cluster.map((d) => d.firstSeen));
    const lastSeen = Math.max(...cluster.map((d) => d.lastSeen));

    result.push({ ...rep, position, frameCount, firstSeen, lastSeen });
  }

  return result;
}

export function filterScanAppliances(
  appliances: ApplianceData[],
  walls: ScanResult["walls"],
): ApplianceData[] {
  const roomPlan = appliances.filter((a) => a.source === "roomplan");
  const yolo = appliances.filter(
    (a): a is YOLOAppliance => a.source === "yolo",
  );

  const poly = wallPolygon(walls);
  const valid = yolo.filter((d) => isValidDetection(d, poly));
  const deduped = dedupeDetections(valid);

  return [...roomPlan, ...deduped];
}
