export interface BlogPost {
  id: string;
  date: string;
  title: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "opening",
    date: "2026",
    title: "The blog has a station",
    body: "The *Dev Log* stays about how things ship. This station is the *blog* — writing I want on the floor even when it is not a build note. School, games, music, whatever is worth leaving here.",
  },
  {
    id: "same-floor",
    date: "2026",
    title: "Same floor, different notebook",
    body: "I did not want a separate site you have to leave for. Walk over, read a post, step back onto the map. The *guitar* has its own station too, if you have not found it yet.",
  },
];
