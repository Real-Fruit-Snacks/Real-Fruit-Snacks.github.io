# real-fruit-snacks.github.io

The RFS site. One static page, no build step, no framework.

| File | Edit when |
|---|---|
| `tools.json` | A repo is added, renamed, retired, or its one-liner changes. This is the only file that changes routinely. |
| `index.html` | Layout or copy changes. Tokens at the top of `<style>` mirror `.github/brand/tokens/rfs.css` — change them there first. |
| `assets/`, icons, `manifest.webmanifest` | Only when the brand package in `.github/brand/` changes. Copy, don't redraw. |

Themes: Nightshift (default) / Dayshift. Follows the OS preference, remembers the toggle in `localStorage`.

Brand guide: https://github.com/Real-Fruit-Snacks/.github/blob/main/BRAND.md
