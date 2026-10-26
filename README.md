# real-fruit-snacks.github.io

The RFS site. One static page, no build step, no framework, nothing loaded from other sites.

| File | Edit when |
|---|---|
| `tools.json` | A repo is added, renamed, retired, or its one-liner changes. Feeds both the hero terminal (`short`) and the cards (`description`). This is the only file that changes routinely. |
| `index.html` | Layout or copy changes. Tokens at the top of `<style>` mirror `.github/brand/tokens/rfs.css` — change them there first. |
| `assets/`, icons, `manifest.webmanifest` | Only when the brand package in `.github/brand/` changes. Copy, don't redraw. `assets/og.png` is `.github/brand/social/rfs-social-org-dark-1280x640.png` (from `tools/make-org-art.py`). |
| `fonts/` | IBM Plex woff2 (OFL, `fonts/OFL.txt`). Sans 400/600/700, Mono 400/600. |

Themes: Nightshift (default) / Dayshift. Follows the OS preference, remembers the toggle in `localStorage`.

Brand guide: https://github.com/Real-Fruit-Snacks/.github/blob/main/BRAND.md
