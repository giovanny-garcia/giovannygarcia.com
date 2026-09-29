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
    title: "Why there's a blog stop",
    body: "Dev log is for shipping and tech choices. The blog is for *everything else*: school, games, music, whatever I felt like writing down that week.",
  },
  {
    id: "same-floor",
    date: "2026",
    title: "Posts live here too",
    body: "Posts stay on this site. Read one, walk away, keep exploring. Guitar has its own stop if you have not been there yet.",
  },
];
