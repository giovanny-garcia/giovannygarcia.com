# Giovanny Garcia — portfolio monorepo

Everything portfolio-related in one place. The live site at [giovannygarcia.com](https://giovannygarcia.com) is built from `apps/site`.

| Path | What it is | Came from |
| --- | --- | --- |
| `apps/site` | Interactive floor portfolio (React 19, Vite, Tailwind) — the live site | `giovannygarcia.com` |
| `apps/game` | Interactive portfolio game (Godot 4.3, GL Compatibility) | `portfoliogame` (`animation` branch) |
| `prototypes/portfoliosite` | Early three.js character-controls prototype | `portfoliosite` |
| `prototypes/threejs-app` | React Three Fiber desk scene prototype | `my-threejs-app` |
| `prototypes/vite-portfolio` | First React + Vite portfolio layout | `Portfolio` (`vite-project/`) |

Each project's original commit history was imported, so `git log -- <path>` shows its past commits.

## Setup

Requires Node 22+. One install at the root covers every web project (npm workspaces):

```
npm install
```

## Site

```
npm run dev
npm run build
npm run preview
```

Pushing to `main` builds `apps/site` and deploys `apps/site/dist` to the `gh-pages` branch (see `.github/workflows/site.yml`).

## Prototypes

```
npm run dev:portfoliosite
npm run dev:threejs
npm run dev:vite-portfolio
```

Any workspace script can also be run directly, e.g. `npm run build -w prototypes/threejs-app`.

## Game

Open `apps/game/project.godot` in Godot 4.3 and use **Project → Export → Web**.
