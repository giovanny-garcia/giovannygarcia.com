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
  kind: StationKind;
  /** Position on the floor (percent) */
  x: number;
  y: number;
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
    kind: "about",
    x: 18,
    y: 48,
  },
  {
    id: "tiles-ascend",
    title: "Tiles Ascend",
    shortLabel: "Tiles Ascend",
    tagline: "Playable build",
    kind: "playable",
    description:
      "A Godot 4.3 game written in GDScript and exported for the browser. The build is hosted on this site so it starts faster — play here, then step back onto the floor. Also on itch.io.",
    tags: ["Godot 4.3", "GDScript", "Web", "Self-hosted"],
    liveUrl: "https://cry0smith.itch.io/tiles-ascend",
    embedUrl: "/tiles-ascend/index.html",
    engine: "Godot 4.3",
    image: tilesAscendImg,
    x: 38,
    y: 58,
  },
  {
    id: "log",
    title: "Dev Log",
    shortLabel: "Dev Log",
    tagline: "Notes & process",
    kind: "log",
    x: 58,
    y: 44,
  },
  {
    id: "skills",
    title: "Toolkit",
    shortLabel: "Toolkit",
    tagline: "What I build with",
    kind: "skills",
    x: 72,
    y: 56,
  },
  {
    id: "links",
    title: "Links",
    shortLabel: "Links",
    tagline: "Find me",
    kind: "links",
    x: 86,
    y: 42,
  },
  {
    id: "workbench",
    title: "Workbench",
    shortLabel: "Workbench",
    tagline: "Coming soon",
    kind: "soon",
    x: 48,
    y: 32,
  },
];

export function getPlayableStation(id: string): PlayableStation | undefined {
  const station = worldStations.find((s) => s.id === id);
  return station?.kind === "playable" ? station : undefined;
}

export const aboutContent = {
  headline: "Building toward games",
  paragraphs: [
    "I'm Giovanny Garcia — a computer science student looking for my first software development role, with games as the software I most want to make.",
    "I ship playable work when I can. Tiles Ascend is a Godot 4.3 web build you can try from this floor. Freelance and studio-bound projects will land here as stations as they go live.",
    "This site is the place: walk the floor, play a build, read a note, leave through a link. One space instead of a stack of resume sections.",
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
] as const;
