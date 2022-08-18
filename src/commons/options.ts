import { Option } from "./types";

export const PEST_TYPES: Option[] = [
  { label: "Mosquito", code: "mosquito" },
  { label: "Termite", code: "termite" },
  { label: "Bed Bug", code: "bedbug" },
  { label: "Fire Ant", code: "fireAnt" },
  { label: "Roach", code: "roach" },
  { label: "Scorpion", code: "scorpion" },
  { label: "Spider", code: "spider" },
  { label: "Rodent", code: "rodent" },
  { label: "Two or More", code: "twoOrMore" },
  { label: "None", code: "none" },
];

export const POOL_TYPES: Option[] = [
  { label: "Salt Water", code: "saltWater" },
  { label: "Chlorine", code: "chlorine" },
  { label: "UV", code: "uv" },
  { label: "Ozone", code: "ozone" },
  { label: "Mineral", code: "mineral" },
  { label: "None", code: "none" },
];

export const ROLES: Option[] = [
  { label: "View access", code: "Viewer" },
  { label: "Admin access", code: "Admin" },
];
