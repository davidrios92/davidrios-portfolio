# David E. Rios — Portfolio

Static one-page portfolio. No build step, no dependencies.

Ported from the Claude Design project **"David Emanuel portfolio design"**
(`David Rios Portfolio.dc.html`), converted from the `.dc.html` canvas format
into plain HTML/CSS/JS.

## Run

```bash
py -3 -m http.server 5173
```

Then open <http://localhost:5173>. Any static server works; there is nothing to build.

## Layout

```
index.html              markup
css/styles.css          design tokens + all styles
js/script.js            rotating case tabs, São Paulo clock
assets/                 CV PDF
stack/                  logo marks used in the Stack grid
uploads/                portrait, Claude / AWS / n8n logos
```

## Behaviour

`js/script.js` replaces the design canvas's `DCLogic` component:

- **Case tabs** rotate every 8s; clicking one selects it and restarts the timer.
  Rotation pauses on hover/focus within the cases block and while the tab is
  backgrounded, so it doesn't move under the reader.
- The 2px rail fill is an 8s CSS animation (`fillbar`) retriggered on each change.
- **Clock** shows `America/Sao_Paulo` time, refreshed every 15s.
- Tabs are a real ARIA tablist with arrow-key navigation.
- `prefers-reduced-motion` disables the animations.

## Assets

The design project's `stack/*.png` were background-removed crops of raw logo
files. Those crops were regenerated locally from the raws (edge flood-fill +
trim) rather than re-downloaded. GitHub and n8n use SVG marks instead of PNG.

## Links

| Where | Target |
|---|---|
| Email (header icon + "Email me") | `emarios.92@gmail.com` |
| LinkedIn (header icon + button) | `linkedin.com/in/davidemanuelrios` |
| GitHub (header icon) | `github.com/davidrios92` |
| CV buttons (x2) | `assets/David-Rios-CV-2026.pdf` |

## Deploy

Hosted on Vercel from `main` as a static site — no build command, no framework.
`vercel.json` sets long-lived caching for `assets/`, `stack/` and `uploads/`, and
`no-cache` for `index.html`, `css/` and `js/` (those filenames carry no content
hash, so a long max-age would strand visitors on a stale deploy).
