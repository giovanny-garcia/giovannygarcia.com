export interface LogEntry {
  id: string;
  date: string;
  title: string;
  body: string;
}

export const logEntries: LogEntry[] = [
  {
    id: "tiles-ship",
    date: "2025",
    title: "Shipping Tiles Ascend to the web",
    body: "Godot 4.3, GDScript, exported for the browser, posted on itch.io. I wanted a *full run* you could finish in one sitting, something I could actually ship.",
  },
  {
    id: "itch-primary",
    date: "2026",
    title: "Play opens on itch.io",
    body: "Play goes to *itch.io*. Linking out keeps this page quick. The build stays where people already look for games.",
  },
  {
    id: "site-as-place",
    date: "2026",
    title: "Portfolio as a little map",
    body: "I got tired of the same single page templates. This is an *interactive floor* with stops for projects, notes, and links. The game itself stays on itch.io.",
  },
  {
    id: "next",
    date: "Soon",
    title: "More stations on the way",
    body: "Freelance work and side experiments will show up as new stops when they're ready. *Workbench* is holding the next thing that's close to playable.",
  },
];
