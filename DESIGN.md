# HermesCN — Style Reference

> electric-blue manuscript — Hermes official blue as the field, vintage editorial typography as the discipline

**Theme:** dark blue

HermesCN should feel like a Chinese companion edition of the Hermes Agent site, not a generic community landing page. The official Hermes blue `#0000f2` is the dominant canvas. Text is near-white, surfaces are pure white, and structure comes from old printed matter: uppercase markers, thin ruled borders, framed plates, terminal blocks, and restrained emblem-like imagery. The style is classical in composition but electric in color.

## Tokens — Colors

| Name             | Value                       | Token                      | Role                                                                                                      |
| ---------------- | --------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hermes Blue      | `#0000f2`                   | `--color-hermes-blue`      | Primary page canvas, hero background, dark section background, active brand field                         |
| Hermes Blue Deep | `#0000b8`                   | `--color-hermes-blue-deep` | Pressed blue, deep bands, subtle depth under the main blue                                                |
| Hermes Blue Soft | `#2d2dff`                   | `--color-hermes-blue-soft` | Active blue surface and secondary blue panels; avoid using it as the only hover contrast                  |
| Hermes Ink       | `#f5f5f5`                   | `--color-hermes-ink`       | Primary text on blue, icon strokes, hero headings                                                         |
| Porcelain        | `#ffffff`                   | `--color-porcelain`        | Terminal/card surface, download plates, QR panels, button fill; use pure white rather than warm off-white |
| Blue Mist        | `#d8dcff`                   | `--color-blue-mist`        | Secondary text on blue, muted labels, soft borders on dark canvas                                         |
| Blue Hairline    | `rgba(245, 245, 245, 0.22)` | `--color-blue-hairline`    | Fine borders and ruled lines on blue                                                                      |
| Ink Line         | `rgba(0, 0, 242, 0.16)`     | `--color-ink-line`         | Fine borders inside white cards                                                                           |
| Brass            | `#d9c46a`                   | `--color-brass`            | Small antique accent: one dot, seal, underline, or marker; never a large fill                             |
| Signal Red       | `#d64040`                   | `--color-signal-red`       | Tiny status dot only, never primary action                                                                |

## Tokens — Typography

### Display Serif

- **Substitute:** Songti SC, STSong, Noto Serif CJK SC, Georgia, serif
- **Weights:** 400, 600 only when the Chinese font needs emphasis
- **Role:** H1, H2, large feature titles. On blue, use large, calm type with no gradient and no heavy shadow.

### UI Serif

- **Substitute:** Songti SC, STSong, Noto Serif CJK SC, serif
- **Weights:** 400, 500
- **Role:** Body copy, nav labels, buttons, card text. Keep Chinese copy short and direct.

### Mono

- **Substitute:** JetBrains Mono, ui-monospace, SFMono-Regular, monospace
- **Weights:** 400, 600
- **Role:** Install commands, section numbers, small metadata, Hermes ASCII marks such as `/\-_+=`.

### Type Scale

| Role       | Size                     | Line Height | Token               |
| ---------- | ------------------------ | ----------- | ------------------- |
| caption    | 12px                     | 1.3         | `--text-caption`    |
| body-sm    | 14px                     | 1.6         | `--text-body-sm`    |
| body       | 16px                     | 1.65        | `--text-body`       |
| subheading | 22px                     | 1.55        | `--text-subheading` |
| heading    | 40px                     | 1.1         | `--text-heading`    |
| display    | clamp(56px, 10vw, 132px) | 0.9–1.05    | `--text-display`    |

## Components

### Blue Hero

Use `#0000f2` full bleed. The hero should feel poster-like: large stacked title, small mono eyebrow, short subheading, install terminal, and a framed image plate. Avoid gradients, glass cards, and decorative blobs.

### Primary Button

White fill on Hermes Blue, square corners. Text is Hermes Blue. On hover, invert to Hermes Blue fill with white text and a white border so the state remains legible. Do not use purple, cyan, gray, or ivory CTA colors.

### Secondary Button

Transparent on blue with `1px solid rgba(245,245,245,.55)` and near-white text. On hover, invert to white fill with Hermes Blue text. On white cards, use Hermes Blue text and blue hairline border.

### Terminal Card

White surface with Hermes Blue text, 1px blue hairline, no radius. Tabs are mono text with a blue underline or solid blue active state. The command line should feel like the official site: simple, functional, and bright against the blue.

### Feature Grid

Feature cards sit either directly on blue with pale borders or on white plates. Prefer numbered entries (`#1`, `#2`) and compact copy. Icons may be used, but they should be line-based and subordinate to the title.

### Hover States

Use high-contrast states instead of translucent blue washes. Blue-canvas controls can hover to white fill with Hermes Blue text when the text color is explicitly controlled. White feature items should keep their white fill and use motion only: scale the title and icon slightly, without changing body text contrast.

### Navigation

Floating or absolute navigation over blue. Match the main content width (`max-width: 80rem / 7xl`). Use white text, small brand mark, and restrained underline/filled active state. Avoid a gray glass capsule. Do not add a white logo plate when the logo asset is already white.

### HeroUI Components

All HeroUI components should render with square corners. Set global radius tokens to `0px` and avoid local `rounded-*` utilities unless a truly circular status dot is needed.

## Do's

- Keep Hermes Blue `#0000f2` as the dominant first-viewport signal.
- Use near-white `#f5f5f5` for primary text on blue.
- Use pure white terminal/cards as sharp contrast against the blue canvas.
- Use mono markers and ASCII glyphs to echo Hermes official site.
- Keep borders thin: `1px` solid or dashed, low opacity.
- Let vintage character come from typography, framing, and ruled layouts, not brown/gray paper.

## Don'ts

- Do not return to warm gray as the page canvas.
- Do not use purple-blue gradients; Hermes Blue is already the brand color.
- Do not use beige, ivory, or parchment as a secondary surface. The secondary surface is pure white.
- Do not add heavy shadows or glassmorphism.
- Do not add long explanatory copy to force the design.

## Quick Color Reference

- background canvas: `#0000f2`
- text on blue: `#f5f5f5`
- secondary text on blue: `#d8dcff`
- white surface: `#ffffff`
- secondary surface: `#ffffff`
- border on blue: `rgba(245,245,245,.22)`
- border on white: `rgba(0,0,242,.16)`
- antique accent: `#d9c46a`

## Source Note

Hermes official site currently declares `#0000f2` as its HTML/body/main background and `#f5f5f5` as body text. This style guide treats those values as the base brand contract.
