<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-light.svg">
  <img alt="Real-Fruit-Snacks portfolio" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io/main/docs/assets/logo-dark.svg" width="100%">
</picture>

> [!IMPORTANT]
> **Portfolio and project-index site** for the [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) GitHub organization. Static, vanilla HTML/CSS/JS. Catppuccin Mocha. Project cards generated from `data/repos.js` and `data/features.js`.

> *The lobby for everything else. Felt fitting that the index itself stays the smallest possible static page.*

---

## §1 / Premise

The site lists every project under the org with a short tagline, links to the repo, and a tag for the language and category. The data lives in two flat JS files (`data/repos.js`, `data/features.js`) so adding or removing a project is a one-line edit.

▶ **[Live site](https://Real-Fruit-Snacks.github.io/)**

---

## §2 / Specs

| KEY      | VALUE                                                          |
|----------|----------------------------------------------------------------|
| BUILD    | None — static                                                  |
| DATA     | `data/repos.js` · `data/features.js`                           |
| STYLES   | `styles/tokens.css` · Catppuccin Mocha tokens                  |
| FONTS    | Inter · JetBrains Mono                                         |
| HOSTING  | GitHub Pages (user site)                                       |
| LICENSE  | MIT                                                            |

---

## §3 / Quickstart

```bash
git clone https://github.com/Real-Fruit-Snacks/Real-Fruit-Snacks.github.io.git
cd Real-Fruit-Snacks.github.io
# Open index.html, or:
python -m http.server 8000
```

To add a project, append an entry to `data/repos.js` and push to `main`.

---

[License: MIT](LICENSE) · Part of [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) — building offensive security tools, one wave at a time.
