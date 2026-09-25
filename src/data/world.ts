import tilesAscendImg from "../assets/screenshot.jpg";

export type StationKind =
  | "playable"
  | "about"
  | "log"
  | "skills"
  | "links"
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

/** Camera, explorer, and open dock. Called from the walk loop so React does not re-render per frame. */
export function paintFloorFrame(
  pos: { x: number; y: number },
  moving: boolean,
  els: {
    floor: HTMLDivElement | null;
    explorer: HTMLDivElement | null;
    dock: HTMLDivElement | null;
    dockStation: { x: number; y: number } | null;
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
  kind: "about" | "log" | "skills" | "links" | "soon";
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
];

export function getPlayableStation(id: string): PlayableStation | undefined {
  const station = worldStations.find((s) => s.id === id);
  return station?.kind === "playable" ? station : undefined;
}

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
