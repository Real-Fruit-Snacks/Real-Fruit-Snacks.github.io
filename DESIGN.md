# Design: real-fruit-snacks.github.io

## Concept

One job each. The page is the index of one person's tools, and every tool is entered by the job it does: what you hand it and what you get back. `Ctrl+PrintScreen` in, `screen-mark_2026-11-05_091412.png` out. Proton's `Port pair 51037->51037` in, `listening port updated: 48213 -> 51037` out. The look is a Swiss index: numbers hung in the margin, hairline rules, tabular alignment, one grotesque at very different sizes. A visitor should leave knowing what each tool is for, and that each one is small and exact.

## Audience and primary action

People who came from a tool's page, the GitHub profile or rfs.tools and want to see what else there is. They need the whole list at a glance, what each tool does in concrete terms, and a way into the one they want: the row links to that tool's own page.

## Type

- Schibsted Grotesk, variable 400 to 900, for everything that isn't code. It's a newspaper grotesque made for a media group's own titles: plain, exact, with enough weight range to set the headline at 800 and the index at 600 from one file.
- Fragment Mono 400 for what a tool literally reads or writes: file names, log lines, keys, commands. Its proportions come from a grotesque, so it sits next to Schibsted without a change of voice.
- Scale: `scale.mjs`, 16px to 18px, ratio 1.2 to 1.414. The headline is `clamp(2.9rem, 1.2rem + 6.2vw, 7.4rem)`.
- Both are self-hosted in `fonts/`, with their OFL licences.

## Color

The RFS Nightshift and Dayshift values and nothing else. The OS setting decides the theme, the Night/Day switch overrides it, and the choice is saved as `rfs-theme` like the other RFS pages.

| Role | Night | Day | Use |
|---|---|---|---|
| bg / surface / raised | `#0C0D10` / `#13151A` / `#1A1D24` | `#F6F5F2` / `#FFFFFF` / `#ECEAE4` | Page; the job display; inline code |
| line / line-strong | `#262A33` / `#636872` | `#D6D3CB` / `#89867F` | Row rules; the board's head rule is ink |
| ink / mute | `#E8E6E1` / `#8A8F99` | `#1A1B1E` / `#666A73` | Text |
| Ember | `#FF6A3D` | `#C03B0A` | The seam, the index marker, focus, the active switch |
| Amber | `#FFC247` | `#925F00` | The word "In" |
| Mint | `#3DDC97` | `#15794D` | The word "Out" |
| Raspberry | `#F06292` | `#B0306A` | The word "Archived" |

Every colour that marks a state comes with its word. Only Night glows, and only the seam.

## Layout

A 1280px wrap on a 12-column grid. The headline takes seven columns and the standfirst sits in the last four, on the headline's baseline. Under them is the board: the index in four columns on the left, the job display in eight on the right, sharing one ink rule across the top. On a phone the headline comes first, then the display, then the index, where each row also shows its own job. Below the board, each section takes its own form: a short list of the repos around the tools, the house rules set large with their numbers in the margin, the retired series as one line of names, and a sign-off.

## Signature

The seam: an Ember hairline that passes across a job from left to right. Behind it the output appears and the input it has passed over turns grey. It's also the mark: the favicon is a bold R with the seam beside it, and the wordmark in the header ends in one.

## Wow moment

The first screen is the whole collection plus one job being done. On load the display shows screen-mark's input; 300ms later the seam sweeps it and `screen-mark_2026-11-05_091412.png` appears behind it. Every 4.5s the Ember marker slides down the index to the next tool and its job runs. Pointing at or focusing any row runs that tool's job and stops the cycle; Pause stops it too.

- **No JS:** the display shows screen-mark's finished job and every row shows its own job and description.
- **Reduced motion:** no cycle and no sweep. Hover and focus still switch the display, instantly. Turning it on with the page open stops the cycle; turning it off starts it again, unless the visitor paused or picked a tool meanwhile.
- **Phone:** the display sits under the headline on the first screen and keeps cycling; the index rows below carry their jobs inline.

## Imagery and texture

None beyond type and rules. The jobs are the pictures.

## Motion

The seam runs 900ms on `cubic-bezier(.65, 0, .35, 1)`. The marker slides in 300ms. Hover and focus colour changes are 150ms. The theme switch sweeps the new theme in from the click point. Nothing else moves.

## Voice

First person where it's my reason ("jobs I kept doing by hand"), plain labels everywhere else. Jobs are quoted from what each tool really reads and writes: its log lines, file names and keys, checked against the repo. No adjectives that a fact could replace.

## Files

- `tools.json` is the list. `node scripts/build.mjs` writes it into `index.html` between the `build:` markers, so the page works without JS; CI fails if they differ, or if a listed repo is archived, private or missing.
- `index.html`, `styles.css`, `script.js`, `fonts/`, the icons and `manifest.webmanifest`.
- `assets/og.png` is the social preview, rendered from `scripts/card.html`. Its URL is unchanged.
- `scripts/mark.svg` is the favicon source; the icon files and `manifest.webmanifest` are built from it.

## Alternatives considered

- A drawing sheet: zone borders, a title block and the tools as the parts list of an engineering drawing. Exact, but it needs something to draw, and the tools would become a table on a decoration.
- A poster index: every name set at display size, filling the screen, with the details on hover. Brave, but it says how many tools there are, not what any of them does.
