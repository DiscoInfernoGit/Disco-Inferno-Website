# Disco Inferno — Windsor's Retro Dance Bar

Static website (plain HTML/CSS/JS) for Disco Inferno, 29 Park St W, Windsor ON. Hosted for free on Netlify from this repo. Owner-editable events + announcement banner via Decap CMS at `/admin`.

**Start here → [HANDOVER.md](HANDOVER.md)** (setup steps, how the owner updates things, content log).

## Previewing it locally

There is **no build step** — no bundler, no framework, nothing to compile. The `.html` files in this folder *are* the website. You just need any local web server to view them.

```bash
npm run dev
```

Then open <http://localhost:5173>. (Requires [Node.js](https://nodejs.org). The script just runs `npx serve` — there are no dependencies to install, so you can skip `npm install`.)

**No Node installed?** Use the VS Code **Live Server** extension instead: install it from the Extensions panel, then right-click `index.html` → *Open with Live Server*.

⚠️ Don't just double-click `index.html` to open it in a browser. The pages link to `/css/styles.css`, `/js/main.js` etc. from the site root, which only resolves when it's being served. Opening the file directly gives you an unstyled page.

## Previewing the /admin editor locally

Normally `/admin` asks you to log in with GitHub and saves changes to this repo. To try it on your own machine without logging in:

1. Uncomment `local_backend: true` in `admin/config.yml`
2. In a second terminal, run `npm run admin` (starts the Decap proxy on port 8081)
3. Open <http://localhost:5173/admin/> and click **Login**

Changes save straight to the files in this folder. **Re-comment that line before deploying.**
