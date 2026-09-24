import tilesAscendImg from "../assets/screenshot.jpg";

export type GameStationKind = "playable" | "coming-soon" | "info";

export interface PlayableGame {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  tags: string[];
  kind: "playable";
  /** itch.io (or other) page for the game */
  liveUrl: string;
  /** Direct embed URL used inside the player iframe */
  embedUrl: string;
  engine: string;
  image?: string;
  /** Position on the 2D workspace floor (percent of room) */
  x: number;
  y: number;
}

export interface PlaceholderStation {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  kind: "coming-soon" | "info";
  x: number;
  y: number;
}

export type WorkspaceStation = PlayableGame | PlaceholderStation;

export const workspaceStations: WorkspaceStation[] = [
  {
    id: "tiles-ascend",
    title: "Tiles Ascend",
    shortLabel: "Tiles Ascend",
    description:
      "Godot 4.3 web export. Step onto the station to load and play, then exit back here when you are done.",
    tags: ["Godot 4.3", "GDScript", "Web"],
    kind: "playable",
    liveUrl: "https://cry0smith.itch.io/tiles-ascend",
    embedUrl: "https://itch.io/embed-upload/16870982?color=f77c13",
    engine: "Godot 4.3",
    image: tilesAscendImg,
    x: 28,
    y: 52,
  },
  {
    id: "workbench",
    title: "Workbench",
    shortLabel: "Workbench",
    description:
      "Prototype bay for upcoming freelance builds. New playable stations land here as they ship.",
    kind: "coming-soon",
    x: 55,
    y: 42,
  },
  {
    id: "archive",
    title: "Archive",
    shortLabel: "Archive",
    description:
      "Older experiments and itch uploads. Browse the scroll portfolio for write-ups and links.",
    kind: "info",
    x: 72,
    y: 62,
  },
];

export function getPlayableGame(id: string): PlayableGame | undefined {
  const station = workspaceStations.find((s) => s.id === id);
  return station?.kind === "playable" ? station : undefined;
}
