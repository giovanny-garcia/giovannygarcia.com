import tilesAscendImg from "../assets/screenshot.jpg";

export type StationKind =
  | "playable"
  | "about"
  | "log"
  | "skills"
  | "links"
  | "blog"
  | "guitar"
  | "soon";

export interface WorldStationBase {
  id: string;
  title: string;
  shortLabel: string;
  tagline: string;
  /** One line in the overhead pill — why this station is worth a stop */
  callout: string;
  kind: StationKind;
  /** Position on the world map (percent of the map, which is larger than the viewport) */
  x: number;
  y: number;
}

/** Map size relative to the floor viewport. Above 1, the view stays fixed and the map scrolls. */
export const WORLD_SCALE = 2.2;

export const WORLD_SIZE = {
  width: 100 * WORLD_SCALE,
  height: 100 * WORLD_SCALE,
} as const;

/** Viewport offset (percent of the floor view) that keeps the explorer centered, clamped to the map. */
export function mapCamera(player: { x: number; y: number }) {
  const px = (player.x / 100) * WORLD_SIZE.width;
  const py = (player.y / 100) * WORLD_SIZE.height;
  return {
    x: Math.min(0, Math.max(100 - WORLD_SIZE.width, 50 - px)),
    y: Math.min(0, Math.max(100 - WORLD_SIZE.height, 50 - py)),
  };
}

/** Floor-viewport inset (percent) the off-screen waypoint is allowed to occupy. */
const WAYPOINT_INSET = { minX: 14, maxX: 86, minY: 16, maxY: 78 } as const;

export interface WaypointPlacement {
  x: number;
  y: number;
  /** Degrees clockwise from screen-right, matching CSS rotate. */
  angle: number;
  visible: boolean;
}

/** Pin a marker to the floor edge when the next station is outside the view. */
export function edgeWaypoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
): WaypointPlacement {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const inside =
    to.x >= WAYPOINT_INSET.minX &&
    to.x <= WAYPOINT_INSET.maxX &&
    to.y >= WAYPOINT_INSET.minY &&
    to.y <= WAYPOINT_INSET.maxY;
  if (inside || (dx === 0 && dy === 0)) {
    return { x: to.x, y: to.y, angle, visible: false };
  }

  let t = Infinity;
  if (dx !== 0) {
    const edge = dx > 0 ? WAYPOINT_INSET.maxX : WAYPOINT_INSET.minX;
    const hit = (edge - from.x) / dx;
    if (hit > 0) t = Math.min(t, hit);
  }
  if (dy !== 0) {
    const edge = dy > 0 ? WAYPOINT_INSET.maxY : WAYPOINT_INSET.minY;
    const hit = (edge - from.y) / dy;
    if (hit > 0) t = Math.min(t, hit);
  }
  if (!Number.isFinite(t)) {
    return { x: from.x, y: from.y, angle, visible: false };
  }

  return {
    x: Math.min(WAYPOINT_INSET.maxX, Math.max(WAYPOINT_INSET.minX, from.x + dx * t)),
    y: Math.min(WAYPOINT_INSET.maxY, Math.max(WAYPOINT_INSET.minY, from.y + dy * t)),
    angle,
    visible: true,
  };
}

/** World point converted into percentages of the floor viewport. */
export function viewportPoint(
  worldPoint: { x: number; y: number },
  camera: { x: number; y: number },
) {
  return {
    x: camera.x + (worldPoint.x / 100) * WORLD_SIZE.width,
    y: camera.y + (worldPoint.y / 100) * WORLD_SIZE.height,
  };
}

export interface DockPlacement {
  placeBelow: boolean;
  left: string;
  top: string;
  bottom: string;
  maxHeight: string;
}

/** Keep the dock beside a station and inside the floor viewport. */
export function dockPlacement(anchor: { x: number; y: number }): DockPlacement {
  const left = Math.min(82, Math.max(18, anchor.x));
  const placeBelow = anchor.y < 46;
  const maxHeight = placeBelow
    ? `min(28rem, 48vh, calc(${100 - anchor.y}% - 3.5rem))`
    : `min(28rem, 48vh, calc(${anchor.y}% - 8rem))`;
  return {
    placeBelow,
    left: `${left}%`,
    maxHeight,
    top: placeBelow ? `calc(${anchor.y}% + 2.75rem)` : "auto",
    bottom: placeBelow ? "auto" : `calc(${100 - anchor.y}% + 6.75rem)`,
  };
}

export function applyDockPlacement(
  el: HTMLElement,
  anchor: { x: number; y: number },
) {
  const place = dockPlacement(anchor);
  el.style.left = place.left;
  el.style.top = place.top;
  el.style.bottom = place.bottom;
  el.style.maxHeight = place.maxHeight;
}

function paintWaypoint(
  pos: { x: number; y: number },
  camera: { x: number; y: number },
  el: HTMLButtonElement | null,
  target: { x: number; y: number } | null,
) {
  if (!el) return;
  if (!target) {
    el.style.visibility = "hidden";
    el.tabIndex = -1;
    return;
  }
  const place = edgeWaypoint(
    viewportPoint(pos, camera),
    viewportPoint(target, camera),
  );
  el.style.visibility = place.visible ? "visible" : "hidden";
  el.tabIndex = place.visible ? 0 : -1;
  if (!place.visible) return;
  el.style.left = `${place.x}%`;
  el.style.top = `${place.y}%`;
  // Grow the label inward so a long name does not clip on the frame edge.
  const shift = (value: number, min: number, max: number) =>
    value <= min + 0.6 ? "0%" : value >= max - 0.6 ? "-100%" : "-50%";
  el.style.transform = `translate(${shift(place.x, WAYPOINT_INSET.minX, WAYPOINT_INSET.maxX)}, ${shift(place.y, WAYPOINT_INSET.minY, WAYPOINT_INSET.maxY)})`;
  const arrow = el.querySelector<HTMLElement>("[data-waypoint-arrow]");
  if (arrow) arrow.style.transform = `rotate(${place.angle}deg)`;
}

/** Camera, explorer, dock, and off-screen waypoint. Called from the walk loop so React does not re-render per frame. */
export function paintFloorFrame(
  pos: { x: number; y: number },
  moving: boolean,
  els: {
    floor: HTMLDivElement | null;
    explorer: HTMLDivElement | null;
    dock: HTMLDivElement | null;
    dockStation: { x: number; y: number } | null;
    waypoint: HTMLButtonElement | null;
    waypointTarget: { x: number; y: number } | null;
  },
) {
  const camera = mapCamera(pos);
  if (els.floor) {
    els.floor.style.transform = `translate(${camera.x / WORLD_SCALE}%, ${camera.y / WORLD_SCALE}%)`;
    els.floor.style.willChange = moving ? "transform" : "";
  }
  if (els.explorer) {
    els.explorer.style.left = `${pos.x}%`;
    els.explorer.style.top = `${pos.y}%`;
  }
  if (els.dock && els.dockStation) {
    applyDockPlacement(els.dock, viewportPoint(els.dockStation, camera));
  }
  paintWaypoint(pos, camera, els.waypoint, els.waypointTarget);
}

export interface PlayableStation extends WorldStationBase {
  kind: "playable";
  description: string;
  tags: string[];
  liveUrl: string;
  embedUrl: string;
  engine: string;
  image?: string;
}

export interface ContentStation extends WorldStationBase {
  kind: "about" | "log" | "skills" | "links" | "blog" | "guitar" | "soon";
}

export type WorldStation = PlayableStation | ContentStation;

export const worldStations: WorldStation[] = [
  {
    id: "about",
    title: "About",
    shortLabel: "About",
    tagline: "Who I am",
    callout: "CS student, games first",
    kind: "about",
    x: 50,
    y: 50,
  },
  {
    id: "tiles-ascend",
    title: "Tiles Ascend",
    shortLabel: "Tiles Ascend",
    tagline: "Playable build",
    callout: "Godot 4.3 · play it here",
    kind: "playable",
    description:
      "A *Godot 4.3* game written in *GDScript* and exported for the browser. The build is hosted on *this site* so it starts faster — play here, then step back onto the floor. Also on itch.io.",
    tags: ["Godot 4.3", "GDScript", "Web", "Self-hosted"],
    liveUrl: "https://cry0smith.itch.io/tiles-ascend",
    embedUrl: "/tiles-ascend/index.html",
    engine: "Godot 4.3",
    image: tilesAscendImg,
    x: 46,
    y: 78,
  },
  {
    id: "log",
    title: "Dev Log",
    shortLabel: "Dev Log",
    tagline: "Notes & process",
    callout: "How this floor got built",
    kind: "log",
    x: 52,
    y: 22,
  },
  {
    id: "skills",
    title: "Toolkit",
    shortLabel: "Toolkit",
    tagline: "What I build with",
    callout: "TypeScript, Godot, C++",
    kind: "skills",
    x: 84,
    y: 38,
  },
  {
    id: "links",
    title: "Links",
    shortLabel: "Links",
    tagline: "Find me",
    callout: "GitHub, itch.io, LinkedIn",
    kind: "links",
    x: 80,
    y: 74,
  },
  {
    id: "workbench",
    title: "Workbench",
    shortLabel: "Workbench",
    tagline: "Coming soon",
    callout: "Next build, not playable yet",
    kind: "soon",
    x: 22,
    y: 18,
  },
  {
    id: "blog",
    title: "Blog",
    shortLabel: "Blog",
    tagline: "Writing",
    callout: "Posts beyond the dev log",
    kind: "blog",
    x: 18,
    y: 48,
  },
  {
    id: "guitar",
    title: "Guitar",
    shortLabel: "Guitar",
    tagline: "Playing",
    callout: "The instrument I keep playing",
    kind: "guitar",
    x: 18,
    y: 80,
  },
];

export function getPlayableStation(id: string): PlayableStation | undefined {
  const station = worldStations.find((s) => s.id === id);
  return station?.kind === "playable" ? station : undefined;
}

export const guitarContent = {
  headline: "I love the *guitar*",
  paragraphs: [
    "Playing *guitar* is the part of my time that is not a screen. I come back to it for the sound, the repetition, and the feeling of getting a phrase under my hands.",
    "Making a build and learning a song ask for the same patience. You stay with it until it works, then you try it again a little cleaner.",
    "This stop is on the floor because that love belongs next to the games and the notes. It is not a project. It is something I do because I love it.",
  ],
};

export const aboutContent = {
  headline: "Building toward *games*",
  paragraphs: [
    "I'm *Giovanny Garcia* — a computer science student looking for my first *software development* role, with *games* as the software I most want to make.",
    "I ship playable work when I can. *Tiles Ascend* is a *Godot 4.3* web build you can try from this floor. Freelance and studio-bound projects will land here as stations as they go live.",
    "This site is the place: *walk the floor*, *play a build*, *read a note*, leave through a link. One space instead of a stack of resume sections.",
  ],
};

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/giovanny-garcia",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/giovanny-garcia-482376243/",
  },
  {
    label: "itch.io",
    href: "https://cry0smith.itch.io/",
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/optionselect.bsky.social",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sleeplessgio/",
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/sleeplessgio",
  },
] as const;
