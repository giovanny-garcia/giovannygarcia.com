/** Decorative and solid props scattered on the walkable map (world % coordinates). */

export type WorldPropKind =
  | "building"
  | "tree"
  | "bush"
  | "rock"
  | "lamp"
  | "crate"
  | "antenna"
  | "bench";

/** Ellipse collision radii in world % — footprint at the prop’s feet. */
export interface PropCollision {
  rx: number;
  ry: number;
}

export interface WorldPropDef {
  id: string;
  kind: WorldPropKind;
  x: number;
  y: number;
  /** Clockwise degrees */
  rotation?: number;
  scale?: number;
  variant?: number;
  /** Blocks movement. Optional override footprint; otherwise derived from kind + scale. */
  solid?: boolean | PropCollision;
}

/** Tuned to match CSS prop sizes on the 0–100 world map (not the inflated first pass). */
const KIND_FOOTPRINT: Partial<Record<WorldPropKind, PropCollision>> = {
  building: { rx: 1.65, ry: 1.15 },
  tree: { rx: 0.95, ry: 0.75 },
  rock: { rx: 0.65, ry: 0.5 },
  crate: { rx: 0.7, ry: 0.55 },
};

export const worldProps: WorldPropDef[] = [
  // —— Northwest: workbench district ——
  {
    id: "wb-shed",
    kind: "building",
    x: 28,
    y: 14,
    variant: 0,
    scale: 1.1,
    solid: true,
  },
  {
    id: "wb-crates",
    kind: "crate",
    x: 32,
    y: 20,
    rotation: -8,
    variant: 1,
    solid: true,
  },
  {
    id: "wb-antenna",
    kind: "antenna",
    x: 14,
    y: 12,
    scale: 0.95,
  },
  {
    id: "wb-tree-a",
    kind: "tree",
    x: 10,
    y: 22,
    variant: 0,
    solid: true,
  },
  {
    id: "wb-rock",
    kind: "rock",
    x: 36,
    y: 16,
    variant: 1,
    solid: true,
  },

  // —— West: blog / guitar lane ——
  {
    id: "w-tree-1",
    kind: "tree",
    x: 12,
    y: 38,
    variant: 1,
    solid: true,
  },
  {
    id: "w-bush-1",
    kind: "bush",
    x: 8,
    y: 44,
    variant: 0,
  },
  {
    id: "w-lamp-1",
    kind: "lamp",
    x: 14,
    y: 52,
  },
  {
    id: "w-tree-2",
    kind: "tree",
    x: 10,
    y: 66,
    variant: 0,
    solid: true,
  },
  {
    id: "w-bench",
    kind: "bench",
    x: 24,
    y: 72,
    rotation: 12,
  },
  {
    id: "w-bush-2",
    kind: "bush",
    x: 12,
    y: 88,
    variant: 2,
  },
  {
    id: "w-rock",
    kind: "rock",
    x: 26,
    y: 84,
    variant: 0,
    solid: true,
  },

  // —— North: toward dev log ——
  {
    id: "n-building",
    kind: "building",
    x: 62,
    y: 12,
    variant: 1,
    scale: 0.9,
    solid: true,
  },
  {
    id: "n-tree",
    kind: "tree",
    x: 42,
    y: 10,
    variant: 1,
    solid: true,
  },
  {
    id: "n-lamp",
    kind: "lamp",
    x: 48,
    y: 28,
  },
  {
    id: "n-crate",
    kind: "crate",
    x: 58,
    y: 26,
    variant: 0,
    solid: true,
  },

  // —— Center plaza (around About, not on top) ——
  {
    id: "c-lamp-w",
    kind: "lamp",
    x: 42,
    y: 46,
  },
  {
    id: "c-lamp-e",
    kind: "lamp",
    x: 58,
    y: 54,
  },
  {
    id: "c-bush",
    kind: "bush",
    x: 44,
    y: 58,
    variant: 1,
  },
  {
    id: "c-bench",
    kind: "bench",
    x: 56,
    y: 44,
    rotation: -18,
  },

  // —— East: toolkit ——
  {
    id: "e-tower",
    kind: "building",
    x: 72,
    y: 32,
    variant: 2,
    scale: 1.15,
    solid: true,
  },
  {
    id: "e-antenna",
    kind: "antenna",
    x: 90,
    y: 28,
    scale: 1.05,
  },
  {
    id: "e-crate",
    kind: "crate",
    x: 76,
    y: 44,
    rotation: 6,
    solid: true,
  },
  {
    id: "e-bush",
    kind: "bush",
    x: 92,
    y: 42,
    variant: 0,
  },

  // —— Southeast: links / tiles ——
  {
    id: "s-building",
    kind: "building",
    x: 68,
    y: 68,
    variant: 0,
    scale: 0.85,
    solid: true,
  },
  {
    id: "s-tree",
    kind: "tree",
    x: 88,
    y: 62,
    variant: 1,
    solid: true,
  },
  {
    id: "s-lamp",
    kind: "lamp",
    x: 72,
    y: 82,
  },
  {
    id: "s-rock-a",
    kind: "rock",
    x: 58,
    y: 76,
    variant: 1,
    solid: true,
  },
  {
    id: "s-bush",
    kind: "bush",
    x: 92,
    y: 78,
    variant: 2,
  },

  // —— South: tiles ascend ——
  {
    id: "so-tree",
    kind: "tree",
    x: 38,
    y: 86,
    variant: 0,
    solid: true,
  },
  {
    id: "so-crate",
    kind: "crate",
    x: 54,
    y: 88,
    variant: 1,
    solid: true,
  },
  {
    id: "so-bench",
    kind: "bench",
    x: 60,
    y: 82,
    rotation: -6,
  },
];

export function propCollision(prop: WorldPropDef): PropCollision | null {
  if (!prop.solid) return null;
  if (prop.solid !== true) return prop.solid;

  const base = KIND_FOOTPRINT[prop.kind];
  if (!base) return null;

  const scale = prop.scale ?? 1;
  return { rx: base.rx * scale, ry: base.ry * scale };
}

/** Explorer footprint — kept small so padding does not dwarf props. */
export const EXPLORER_RADIUS = 0.45;

/** Feet anchor sits at prop.y; shift collision up into the visible base. */
function collisionCenter(prop: WorldPropDef, col: PropCollision) {
  return {
    cx: prop.x,
    cy: prop.y - col.ry * 0.4,
  };
}

function ellipseBlocked(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  padding: number,
) {
  const dx = (x - cx) / (rx + padding);
  const dy = (y - cy) / (ry + padding);
  return dx * dx + dy * dy < 1;
}

export function isWorldPointBlocked(x: number, y: number): boolean {
  for (const prop of worldProps) {
    const col = propCollision(prop);
    if (!col) continue;
    const { cx, cy } = collisionCenter(prop, col);
    if (ellipseBlocked(x, y, cx, cy, col.rx, col.ry, EXPLORER_RADIUS)) {
      return true;
    }
  }
  return false;
}

/** Slide along axes when the direct step hits solid geometry. */
export function resolveWorldMovement(from: { x: number; y: number }, to: { x: number; y: number }) {
  if (!isWorldPointBlocked(to.x, to.y)) return to;

  const slideX = { x: to.x, y: from.y };
  if (!isWorldPointBlocked(slideX.x, slideX.y)) return slideX;

  const slideY = { x: from.x, y: to.y };
  if (!isWorldPointBlocked(slideY.x, slideY.y)) return slideY;

  return from;
}
