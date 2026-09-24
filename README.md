# giovannygarcia.com

Portfolio site for Giovanny Garcia. Built with React + Vite + Tailwind.

## Run it on your computer

You need [Node.js](https://nodejs.org/) (version 20 or newer) installed.

```bash
# 1. Open a terminal in this folder, then install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).  
Edit files under `src/` and the page will update automatically.

Other useful commands:

| Command | What it does |
|---|---|
| `npm run dev` | Run locally while you edit |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code for problems |

## GitHub Pages — you already have this set up

This repo **is** your GitHub Pages site. You do not need a separate repo.

| Setting | Value |
|---|---|
| Live site | https://giovannygarcia.com |
| GitHub Pages branch | `gh-pages` |
| Custom domain | `giovannygarcia.com` |

How it works:

1. You edit code on the `main` branch (this is the source).
2. When you push to `main`, GitHub Actions builds the site and updates the `gh-pages` branch.
3. GitHub Pages serves whatever is on `gh-pages` at your domain.

### First time after this PR merges

1. Make sure GitHub Pages is enabled:  
   **Repo → Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `/ (root)`**
2. Custom domain should already be `giovannygarcia.com` (there is a `CNAME` file on `gh-pages`).
3. Push (or merge) to `main` and wait for the **Deploy to GitHub Pages** workflow to finish under the **Actions** tab.

### If the live site looks wrong

- Check **Actions** for a failed deploy.
- Confirm DNS for `giovannygarcia.com` still points at GitHub Pages (A/AAAA or CNAME records from GitHub’s docs).
- In **Settings → Pages**, turn on **Enforce HTTPS** once the certificate is ready.
