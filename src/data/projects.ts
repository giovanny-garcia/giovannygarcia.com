import tilesAscendImg from "../assets/screenshot.jpg";

interface ProjectBase {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  featured?: boolean;
}

export type Project = ProjectBase &
  ({ github: string; live?: string } | { github?: string; live: string });

export const projects: Project[] = [
  {
    title: "Tiles Ascend",
    description:
      "A game I built in Godot 4.3 and shipped to the web. It is written in GDScript, exported for the browser, and playable below from this site (also on itch.io).",
    image: tilesAscendImg,
    tags: ["Godot 4.3", "GDScript", "Web export"],
    live: "https://cry0smith.itch.io/tiles-ascend",
    featured: true,
  },
];
