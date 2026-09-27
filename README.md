# Pulse — CSS & Interaction Pattern Collection

**Topic:** 9. CSS / Interaction
**Type:** Individual/team UI contribution (HTML, CSS, vanilla JavaScript)

A single, self-contained page that gathers fourteen small CSS and
interaction patterns into one polished, pink-themed showcase — built
as original implementations rather than copied from any existing site.

## Live sections

| Pattern | Where |
|---|---|
| Flexbox layout | `#layout` (toggle set to "Flexbox") |
| CSS Grid layout | `#layout` (toggle set to "Grid") |
| Hover effects (tilt, lift, underline sweep, icon spin, press, ripple) | `#hover` |
| Micro-interactions | magnetic hero card, layout toggle, ripple button |
| Animated cards / card sliding animation | `#gallery` (snap-scroll carousel) |
| CSS-only modal | `#modal` |
| Dark mode / theme switcher | top-right toggle, persisted per browser |
| Responsive typography | hero headline and `.fluid-demo` use `clamp()` |
| Glassmorphism | `#glass` cards (`backdrop-filter: blur()`) |
| Gradient UI | hero background, buttons, gradient-filled text |
| Command palette | press `⌘K` / `Ctrl+K`, or the header button |
| Keyboard shortcuts | `⌘K` palette, `⌘D` theme, `Esc` closes any overlay |

## 1. What the UI pattern is

"CSS & Interaction" patterns are the small, reusable behaviors that
make an interface feel alive without needing a framework: hover
states, layout switches, modals, palettes, and theme toggles that
respond immediately to a cursor, a keystroke, or a click.

## 2. Where it is commonly used

These exact patterns appear across most modern SaaS products: a
command palette (Linear, Notion, GitHub), a dark-mode switch (nearly
every dashboard), glassmorphic panels (macOS-style settings and
marketing sites), and sliding template/product carousels (pricing and
feature pages).

## 3. Why it is relevant to modern web interfaces

Interfaces are increasingly judged on responsiveness of *feel*, not
just of layout. Micro-interactions (a button that presses, a card
that tilts) give a person immediate feedback that their input
registered, which builds trust in the interface before any data has
even loaded.

## 4. Design/interaction patterns observed (research)

Before building, the reference sites in the assignment brief
(ThemeForest, Kombai, Dribbble, MUI templates, n8n workflows) were
reviewed for how they handle these patterns. Recurring observations:
keyboard-first command palettes with fuzzy filtering and arrow-key
navigation; theme toggles built as a sliding pill rather than a plain
checkbox; glass panels always paired with a moving gradient behind
them, never a flat color; and card carousels that snap to a grid
rather than scrolling freely.

## 5. What this implementation does differently / adds

- A single **pink/plum** palette (not the default cream-and-terracotta
  or dark-and-neon look) applied consistently across every pattern,
  including a dedicated dark variant of the same palette rather than
  a generic gray dark mode.
- The **CSS-only modal** genuinely uses no JavaScript — it is driven
  entirely by `:target` and anchor links, which is called out directly
  in the UI so the technique is visible, not just the result.
- The **command palette** doubles as a live remote control for the
  rest of the page (it can flip the theme, switch the layout demo, or
  jump to any section), rather than a static list of unclickable
  suggestions.
- The **flex/grid layout demo** reuses the identical markup for both
  modes so the difference between the two layout models is isolated
  and visible, instead of showing two separate examples.

## Project structure

```
pulse-ui/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Running it

No build step or dependencies. Open `index.html` in any modern
browser, or serve the folder with any static file server, e.g.:

```bash
npx serve .
```

## Technologies used

- Semantic HTML5
- CSS3 (custom properties, `clamp()`, `backdrop-filter`, `:target`,
  Flexbox, Grid, keyframe animation)
- Vanilla JavaScript (no libraries or frameworks)
- Google Fonts: Fraunces (display) and Manrope (body)

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘ / Ctrl` + `K` | Open or close the command palette |
| `⌘ / Ctrl` + `D` | Toggle light / dark theme |
| `↑` / `↓` | Move through palette results |
| `Enter` | Run the highlighted palette command |
| `Esc` | Close the palette or the CSS-only modal |
