export type NoticeKind = "announcement" | "changelog";

export interface Notice {
  id: string;
  date: string;
  kind: NoticeKind;
  title: string;
  body: string;
}

/**
 * Floor HUD messages. Add new announcements and changelog notes at the top.
 * A new `id` shows as unread until the player opens Notices.
 */
export const notices: Notice[] = [
  {
    id: "2026-09-notices",
    date: "Sep 2026",
    kind: "changelog",
    title: "Notices on the floor",
    body: "Short updates land here so you don't have to hunt for them. The blue markers on the map are still worth walking to.",
  },
  {
    id: "2026-floor-open",
    date: "2026",
    kind: "announcement",
    title: "The floor is open",
    body: "Site's live. Tiles Ascend is on itch.io. Blog, guitar, dev log, and links each have a spot on the map.",
  },
];
