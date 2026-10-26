export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: ["TypeScript", "JavaScript", "Python", "C#", "GDScript", "C++"],
  },
  {
    name: "Software",
    skills: [
      "React",
      "Vite",
      "Tailwind CSS",
      "HTML/CSS",
      "Node.js",
      "Git",
      "VS Code",
      "Linux",
    ],
  },
  {
    name: "Game Development",
    skills: [
      "Godot 4",
      "Godot Engine",
      "GDScript",
      "Shaders (GLSL)",
      "Game Design",
      "Level Design",
      "Pixel Art",
      "Aseprite",
      "Blender",
    ],
  },
];
