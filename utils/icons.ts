import type MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { resolveBaselineClass, type BaselineClass } from "./baseline";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const ROOM_ICONS: [RegExp, MaterialIconName][] = [
  [/bed|sleep/, "bed"],
  [/kitchen|pantry/, "kitchen"],
  [/bath|toilet|restroom|shower/, "bathtub"],
  [/living|lounge|family/, "weekend"],
  [/dining/, "table-restaurant"],
  [/office|study|work/, "computer"],
  [/laundry|utility/, "local-laundry-service"],
  [/garage/, "garage"],
  [/balcony|terrace|patio/, "balcony"],
  [/garden|yard/, "yard"],
  [/stair/, "stairs"],
];

export function roomIcon(name: string): MaterialIconName {
  const key = name.trim().toLowerCase();
  for (const [pattern, icon] of ROOM_ICONS) {
    if (pattern.test(key)) return icon;
  }
  return "meeting-room";
}

const BASELINE_ICONS: Record<BaselineClass, MaterialIconName> = {
  air_conditioner: "ac-unit",
  air_fryer: "outdoor-grill",
  air_purifier: "air",
  blender: "blender",
  coffee_machine: "coffee-maker",
  desktop: "desktop-windows",
  electric_kettle: "coffee",
  electric_whisker: "egg",
  fan: "mode-fan-off",
  hair_dryer: "air",
  induction_cooker: "flash-on",
  iron: "iron",
  laptop: "laptop",
  light: "lightbulb",
  microwave: "microwave",
  oven: "countertops",
  printer: "print",
  refrigerator: "kitchen",
  rice_cooker: "rice-bowl",
  router: "router",
  screen: "tv",
  stove: "local-fire-department",
  toaster: "breakfast-dining",
  vacuum: "cleaning-services",
  washing_machine: "local-laundry-service",
};

const APPLIANCE_NAME_ICONS: [RegExp, MaterialIconName][] = [
  [/sofa|couch/, "weekend"],
  [/bed/, "bed"],
  [/table/, "table-restaurant"],
  [/chair|stool/, "chair"],
  [/toilet/, "wc"],
  [/shower|bathtub/, "shower"],
  [/sink/, "water-drop"],
  [/dishwasher/, "countertops"],
  [/dresser|wardrobe|closet|cabinet|nightstand|shelf|shelves/, "shelves"],
  [/heater/, "thermostat"],
];

export function applianceIcon(name: string): MaterialIconName {
  const cls = resolveBaselineClass(name);
  if (cls) return BASELINE_ICONS[cls];
  const key = name.trim().toLowerCase();
  for (const [pattern, icon] of APPLIANCE_NAME_ICONS) {
    if (pattern.test(key)) return icon;
  }
  return "power";
}
