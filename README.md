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
trim) rather than re-downloaded. n8n uses the official SVG.

`stack/github.svg` is **not** the design's original asset. It is a lockup composed
here from the official GitHub wordmark (Wikimedia `GitHub_logo_2013.svg`, measured
bbox 999x272) plus the Octocat mark, scaled to a 392.4x100 viewBox. The design's
own `stack/github.png` could not be pulled through the API without exceeding the
output limit. If you want the exact original, fetch it from the design project
manually and drop it in as `stack/github.png`, updating the `<img src>`.

## Links

| Where | Target |
|---|---|
| Email (header icon + "Email me") | `emarios.92@gmail.com` |
| LinkedIn (header icon + button) | `linkedin.com/in/davidemanuelrios` |
| GitHub (header icon) | `github.com/davidrios92` |
| CV buttons (x2) | `assets/David-Rios-CV-2026.pdf` |

## Deploy

Hosted on Vercel from `main` as a static site — no build command, no framework.

**Caching rule:** files under `stack/` and `uploads/` carry an 8-char content hash
in the filename (`github.9bd44354.svg`), so they are served `immutable` for a year.
Everything else — `index.html`, `css/`, `js/`, the CV, `og-image.png`, `favicon.svg`
— keeps a stable filename and is served `max-age=0, must-revalidate`.

Rule order matters: Vercel applies every matching rule and the **last** one wins,
so the broad `/(.*)` fallback is listed first and the narrow hashed-asset rule second.
Reversing them silently downgrades the hashed assets to must-revalidate.

Note: `vercel.json` header rules accept only `source`, `headers`, `has` and `missing`.
Adding a `comment` key fails schema validation and the deployment errors out before
the build starts, with no build logs to explain it. Keep the reasoning here instead.

Never put a long `max-age` on a file whose name has no hash. A visitor who already
loaded the old copy will keep it until it expires, and `immutable` means the browser
will not even ask. Changing the URL is the only way to reach an already-poisoned cache.

To change a hashed asset, regenerate its hash and update the reference in
`index.html` together:

```bash
py -3 -c "import hashlib;print(hashlib.sha256(open('stack/github.svg','rb').read()).hexdigest()[:8])"
```

Production: <https://davidrios-portfolio-emanuel-rios-projects.vercel.app>

## Social / SEO

`og-image.png` (1200x630) is generated from the portrait, not hand-made — see the
PIL snippet in the commit history if it needs regenerating after a copy change.
`robots.txt`, `sitemap.xml`, `favicon.svg` and the OG/Twitter meta all reference the
production origin, so update them together if the domain changes.
