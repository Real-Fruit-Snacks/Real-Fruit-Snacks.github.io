# real-fruit-snacks.github.io

Flagship Cyclorama Dawn catalog for Real-Fruit-Snacks

Live at **[real-fruit-snacks.github.io](https://real-fruit-snacks.github.io/)**, built in the **Cyclorama Dawn · Steel & Beacon Orange** design system. One static, framework-free GitHub Pages site (`index.html`, `styles.css`, `app.js`, and self-hosted variable `.woff2` fonts in `fonts/`). Zero build server, zero third-party CDNs, zero tracking, full No-JS dark/light parity, WCAG AA contrast, and six interactive `LX` cyclorama lighting phases (`LX 001 Blackout` through `LX 512 Alabaster Day`).

## Structure

| Path | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | Interactive Cyclorama Dawn showcase, 17-tool Cue Sheet, sticky Proof Desk, and Core Principles |
| `tools.json` | Canonical list of the 17 active public tools and 3 supporting repos |
| `scripts/verify-catalog.mjs` | Zero-dependency Node script validating `tools.json`, `index.html`, `app.js`, and optional live GitHub visibility/archive status (`--github`) |
| `fonts/` | Self-hosted variable SIL OFL WOFF2 files (`Big Shoulders Stencil`, `Albert Sans`, `Azeret Mono`) |
| `icon.svg`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-*.png`, `manifest.webmanifest`, `assets/og.png` | Web icons and `1280×640` social card synced from [`rfs-brand`](https://github.com/Real-Fruit-Snacks/rfs-brand) |
| `DESIGN.md` | Complete Cyclorama Dawn design system reference |

## Verifying the catalog

```sh
node scripts/verify-catalog.mjs --check
node scripts/verify-catalog.mjs --check --github
```

When adding, renaming, or archiving a public repository, update `tools.json`, `index.html`, `app.js`, [`Real-Fruit-Snacks/art/make-board.py`](https://github.com/Real-Fruit-Snacks/Real-Fruit-Snacks), and [`rfs-brand/brand/org.toml`](https://github.com/Real-Fruit-Snacks/rfs-brand) together.
