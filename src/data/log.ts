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
    body: "Built in Godot 4.3 with GDScript, then exported for the browser and published on itch.io. The goal was a complete loop people can finish in a sitting — not a tech demo that dies in an editor.",
  },
  {
    id: "self-host",
    date: "2026",
    title: "Self-hosting the web export",
    body: "Tiles Ascend now loads from this site instead of an itch embed, so players spend less time waiting on a third-party frame before they can actually play.",
  },
  {
    id: "site-as-place",
    date: "2026",
    title: "This site is a place, not a scroll",
    body: "Instead of a stacked internship landing page, the portfolio is an interactive floor. Stations open work, notes, and links. Playable builds load in-place so you can return without bouncing off-site.",
  },
  {
    id: "next",
    date: "Soon",
    title: "More stations on the way",
    body: "Freelance games and new experiments will appear as stations on this floor. The Workbench is reserved for prototypes that are almost ready to play.",
  },
];
