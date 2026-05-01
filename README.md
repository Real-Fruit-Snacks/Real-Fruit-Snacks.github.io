<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-light.svg">
  <img alt="Real-Fruit-Snacks portfolio" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-dark.svg" width="100%">
</picture>

> [!IMPORTANT]
> **Portfolio and project-index site** for the [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) GitHub organization. Single-file static HTML — no React, no build step, no dependencies. Catppuccin Mocha + brutalist banner template.

> *The lobby for everything else. Felt fitting that the index itself stays the smallest possible static page.*

---

## §1 / Premise

One static `index.html` that catalogs every project under the org. Hero banner with the brutalist 800×200 wordmark, four headline stats, and a per-category grid of tool cards. Inline vanilla-JS search filters across name / description / language / topic in real time.

The repo array lives inline in `index.html` (~50 entries) so adding or removing a project is a single-line edit. No build, no bundler, no framework.

▶ **[Live site](https://Real-Fruit-Snacks.github.io/)**

---

## §2 / Specs

| KEY        | VALUE                                                          |
|------------|----------------------------------------------------------------|
| **BUILD**     | None — static HTML                                             |
| **STACK**     | Vanilla HTML/CSS/JS — zero dependencies                        |
| **DATA**      | Inline `REPOS` array in `index.html`                           |
| **STYLES**    | Inline `<style>` block — Catppuccin Mocha + brutalist template |
| **FONTS**     | Inter (display) · JetBrains Mono (mono)                        |
| **HOSTING**   | GitHub Pages (user site, root `index.html`)                    |
| **LICENSE**   | MIT                                                            |

---

## §3 / Quickstart

```bash
git clone https://github.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io.git
cd Real-Fruit-Snacks.github.io

# Open directly, or serve locally:
python -m http.server 8000
# → http://localhost:8000
```

To add a project, append an entry to the `REPOS` array near the bottom of `index.html` and push to `main`. GitHub Pages redeploys automatically.

---

## §4 / Structure

```
Real-Fruit-Snacks.github.io/
├── index.html              # Single-file static site (HTML + CSS + data + JS)
├── docs/assets/
│   ├── logo-dark.svg       # Brutalist 800×200 banner (Mocha)
│   └── logo-light.svg      # Brutalist 800×200 banner (Latte)
└── README.md
```

Brutalist template inherited from the suite's per-repo `docs/index.html` style — same status bar, hero, grid, footer pattern as every other Real-Fruit-Snacks project page.

---

[License: MIT](LICENSE) · Part of [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) — building offensive security tools, one wave at a time.
