---
name: toki lili
description: A flat, cozy pouch of collected trinkets in a purple-and-pink treeline, for learning Toki Pona's core vocabulary.
colors:
  night: "#1e1836"
  night-soft: "#2b2450"
  night-edge: "#4a3f7a"
  lavender: "#d7b0fe"
  lavender-dim: "#b98ee6"
  pink: "#febcd5"
  pink-dim: "#f195b7"
  cream: "#f8f3ff"
  mist: "#b6acd6"
typography:
  display:
    fontFamily: "Baloo 2, ui-rounded, SF Pro Rounded, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "Quicksand, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Quicksand, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.18em"
  script:
    fontFamily: "Caveat, cursive"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
rounded:
  pill-row: "28px"
  panel: "32px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    padding: "10px 14px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.mist}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  cozy-panel:
    backgroundColor: "{colors.night-soft}"
    rounded: "{rounded.panel}"
    padding: "32px 24px"
  count-numeral:
    textColor: "{colors.lavender}"
    fontFamily: "{typography.display.fontFamily}"
  word-row:
    backgroundColor: "{colors.night-soft}"
    rounded: "{rounded.pill-row}"
    padding: "12px 16px"
---

# Design System: toki lili

## Overview

**Creative North Star: "The Purple Treeline"**

This system treats progress as something small and huggable to collect, never a stern readout to audit. Every screen is a single flat card resting on a solid indigo-navy ground, framed by a fixed treeline of stylized pine and blossom trees along the bottom edge — a whole world in lavender and pink, holding pill-shaped rows, a big lavender count numeral, and a row of gem dots. This is the visual grammar of a friendly mobile dashboard, borrowed for a solo learner's vocabulary practice rather than a social feed: no leaderboard, no invented friends list, no fabricated social chrome, only what this app actually has (words learned, words due, a next action) rendered as something worth reaching for.

Two pastel accents, lavender and pink, carry the whole system against the navy ground — no third hue is introduced, not even for the trees themselves, which are flat lavender or pink silhouettes rather than naturalistic green-and-brown. Depth is deliberately absent: no drop shadows, no glow, no blur anywhere — every shape is a flat color fill separated from its neighbors by a border or plain color contrast, never a shadow. Type splits along a functional line: Baloo 2's chunky rounded geometry carries numerals, headings, and every button label; Quicksand's lighter rounded sans carries body copy and tracked labels; Caveat's handwritten script is reserved for the wordmark and small celebratory lines ("Structurally valid — nice work!", "Lesson complete!").

**Key Characteristics:**
- Solid indigo-navy ground (#1e1836) — no gradient blooms, no glow — with a fixed treeline of flat-color pine/blossom tree silhouettes along the bottom edge and a faint grain texture.
- Zero shadows anywhere in the system: cards, pods, gems, and buttons are all flat color fills bounded by a border, never lifted or glowing.
- The treeline is monochrome-per-tree: each tree is either solid lavender or solid pink, trunk included — never a naturalistic green/brown palette.
- Rounded-[32px] cards, rounded-[28px] pill rows, and rounded-full buttons/pods/gems — no sharp or lightly-rounded corners anywhere in the system.
- Lessons are a trail through a wood, not a list: a scrolling map board where each lesson is a clearing on a winding path, walked ground is a solid lavender ribbon and ground ahead is stepping stones.
- Baloo 2 for numerals, headings, and buttons; Quicksand for body and tracked labels; Caveat script reserved for the wordmark and celebratory microcopy only.
- Buttons give feedback on press with a flat brightness dip (`active:brightness-90`) — never a shadow collapse or a translate.

## Colors

Full palette strategy: the navy ground and two pinned pastel accents (lavender, pink) carry the whole surface, including the background scenery — no additional hues are introduced for state, emphasis, or atmosphere.

### Primary
- **Lavender** (#d7b0fe): The words-learned count numeral, filled gem dots' gradient, the "Good" grade button, focus rings, hover borders, and roughly half the background treeline's pine trees. The system's cooler accent.

### Secondary
- **Pink** (#febcd5): The primary action button on every screen, the "Easy" grade button, celebratory script text, and the background treeline's blossom trees. The system's warmer accent — reserved for the single primary action per screen plus grading/celebration/scenery moments.

### Neutral
- **Night** (#1e1836): The page ground — a solid flat fill plus a faint grain texture, never a gradient or glow. Also the dark text color set on top of the light lavender/pink surfaces (button labels).
- **Night, Soft** (#2b2450): The background of every card and pill row — one step lighter than the page ground so cards read as objects resting on the surface, not sections of it. Separated by color and a border only, never a shadow.
- **Night, Edge** (#4a3f7a): Borders, dividers, empty gem-dot outlines — the system's structural line color, and the only device used to separate surfaces.
- **Cream** (#f8f3ff): Primary text set on the navy ground.
- **Mist** (#b6acd6): Secondary text — labels, captions, supporting numerals, placeholder text. Tinted from the navy/lavender hue, never a flat gray.

### Named Rules
**The Two-Accent Rule.** Only lavender and pink carry saturated color in this system — including the background treeline and the lesson map's forest, whose trees are flat lavender or pink silhouettes, never naturalistic green or brown. A third hue is never introduced for a new state, scenery element, or emphasis; alternate between the two instead. The single figure painted in neither accent is the trail walker, in Cream: it stands beside a lavender or pink marker, and either accent would sink into it. Cream is a palette neutral, so this is the rule holding, not an exception to it.

## Typography

**Display Font:** Baloo 2 (with ui-rounded, SF Pro Rounded, system-ui, sans-serif)
**Body Font:** Quicksand (with ui-sans-serif, system-ui, sans-serif)
**Script Font:** Caveat (with cursive)

**Character:** A three-way split by function. Baloo 2's chunky, high-x-height rounded geometry is the language of anything counted, headed, or acted on. Quicksand's lighter rounded sans is the language of anything read at length. Caveat's handwritten script is a rare, deliberate accent — the wordmark's second word and a small number of celebratory lines — never a body or label face.

### Hierarchy
- **Display** (800, clamp(2rem, 5vw, 3rem), line-height 1): The words-learned count numeral, and the lesson word-list's headword. Tabular figures where numeric.
- **Body** (600, 0.875rem): Grade button labels, primary button labels, word-list gloss text, grammar explanation copy.
- **Label** (700, 0.65rem, tracking 0.18em, uppercase): Section labels ("WORDS LEARNED", "DUE FOR REVIEW", "DESCRIBE THIS SCENE") and the page eyebrow header. Always Quicksand, never Baloo 2 or Caveat.
- **Script** (600, 1.5rem–1.875rem, line-height 1.1): The wordmark's second word ("lili") and celebratory feedback lines only.

### Named Rules
**The Script-Is-Rare Rule.** Caveat sets at most one short line per screen — the wordmark or a single celebratory moment. It never sets a heading, a button, or a paragraph; its rarity is what keeps it feeling handwritten rather than decorative.

## Layout

Below the `lg` breakpoint (1024px): a single centered column, capped at a narrow measure (24rem / `max-w-sm`) so the card and its action sit like an object on the page. Outer page padding is generous (24px horizontal, 64px vertical) with wide vertical rhythm between the wordmark, the card, and the action (40px). Inside a card, sections are separated by a hairline divider at 24px vertical spacing; word-list pill rows stack with 12px gaps.

Every dimension is fluid below `lg`: cards and buttons are full-width within their max-width container, and the layout compresses gracefully at narrow viewports without dedicated breakpoints in between, matching phone-first use.

### Named Rules
**The Desktop Dashboard Grid.** At `lg` (1024px) and up, the home dashboard stops stacking as a single column and becomes a two-region CSS grid, capped at `max-w-6xl`: a fixed ~22rem sidebar (stats CozyPanel, primary action, last-studied line) alongside a wide main region holding the Lesson Trail board, which centres itself at a `32rem` cap rather than stretching to fill. Sub-`lg`, the same two regions stack, the trail keeping its full column width and a shorter `28rem` window. This is a layout reflow, not a restyle: every component keeps its existing shape, color, and spacing rules. Sub-`lg` surfaces (lesson, review) stay single-column; the grid is specific to the dashboard.

**The Trail Is Not In A Card.** The Lesson Trail board is a panel in its own right — a `rounded-[32px]` window cut down to the darker Night ground, with its own `LESSONS` label and count sitting above it, outside the border. It is never wrapped in a CozyPanel: a rounded card inside a rounded card is the one nesting this system does not do, and it would turn a map into a widget.

The navy ground is a flat solid fill (no gradient blooms) plus a fixed treeline silhouette tiling along the bottom edge and a faint grain texture — a system invariant, not a one-off decorative choice. The treeline uses `background-attachment: fixed`, so it stays anchored to the bottom of the viewport rather than scrolling away on tall pages (e.g. a long lesson word list).

## Elevation & Depth

This system has no elevation model: it is intentionally flat. No box-shadow appears anywhere — not on cards, not on buttons, not on the gem dots. Every surface is separated from its neighbor by a solid border (Night Edge) or a plain color-contrast step (Night → Night Soft), never by a lift, glow, or blur. Button press feedback is a flat brightness dip (`active:brightness-90`) rather than a shadow collapsing or a translate — the whole system reads as cut-out flat shapes, not physical objects with depth.

### Named Rules
**The No-Shadow Rule.** `box-shadow` is never used in this system, for any purpose — not ambient lift, not glow, not a pressable ledge. Depth and separation come from color and border alone.

## Shapes

Corners are uniformly generous and huggable: 32px on cards, 28px on pill rows, and fully round (`9999px`) on every button, pod, and gem — there is no sharp or lightly-rounded corner anywhere in this system. Circles are used deliberately for small identity marks (gem dots, the speaker icon button) and contrast with the pill rows' longer rounded-rectangle silhouette. The background treeline is the one exception to pure roundness: pine trees are drawn as stacked triangles (a flat conifer silhouette) while blossom trees stay circular/rounded, giving the treeline its own silhouette rhythm distinct from the UI chrome.

## Components

### Buttons
- **Shape:** Fully rounded (`9999px`), full-width within their container, flat fill, no shadow.
- **Primary:** Pink background, Night text, 14px/24-28px padding, Baloo 2 bold.
- **Secondary (grade "Good"):** Lavender background, Night text.
- **Outline (grade "Again", "Back home", "Show meaning"):** Transparent background, 2px Night Edge border, Mist text; hover shifts border and text to Lavender/Cream.
- **Active:** `brightness-90` — a flat color dip, never a shadow change or translate.

### Cozy Panel (signature)
A rounded-[32px] card in Night Soft with a 2px Night Edge border, no shadow. Holds one or more sections — a Count Numeral, a Gem Track, a word list, a flashcard — separated by a 1px Night Edge divider at 24px spacing.

### Count Numeral (signature)
A bare Baloo 2 extrabold numeral in Lavender, tabular figures, set directly on the panel with no pill, box, or zero-padding, its total ("/ 137") sharing the same baseline at a smaller size in Mist. The same bare-numeral grammar the Reading Meter uses (its big pink "%"), keeping every stat in the panel typographic rather than boxed. On mount, the value counts up from zero over ~900ms with a cubic ease-out; instant when `prefers-reduced-motion` is set.

### Gem Track (signature)
A horizontal row of small circles: filled ones carry a pink-to-lavender gradient, empty ones are a plain 2px Night Edge outline. No shadow on either state. An overflow count past the track's slots shows as a Baloo 2 "+N" beside it. Gems pop in with a staggered scale-in on mount (respecting reduced motion).

### Word Row
A rounded-[28px] pill row in Night Soft with a 2px Night Edge border, holding the headword in Baloo 2 and its gloss in Quicksand Mist on the left, and a circular outline speaker-icon button on the right. Deliberately unornamented — no per-word badge, icon, or shadow.

### Treeline (signature)
A fixed background layer tiling along the bottom of the viewport, built as two independently-tiling silhouette rows so it reads as a forest rather than a lined-up row of identical trees:
- **Foreground row** (`/treeline-front.svg`, tiles every 820px, planted at the very bottom edge): four silhouette types — full pine (3-tier conifer), sapling (2-tier conifer), blossom (trunk + 4-circle canopy), and shrub (trunk + 3-circle low bush) — sized irregularly from ~26px to ~156px tall, in full-saturation Lavender or Pink. Conifers (pine, sapling) are always Lavender; round-canopy trees (blossom, shrub) are always Pink — a fixed silhouette-to-hue mapping, not a random alternation.
- **Background row** (`/treeline-back.svg`, tiles every 700px, offset 18px above the bottom edge): the same four silhouette types, smaller (~18–66px) and denser, in Lavender Dimmed / Pink Dimmed at 55% opacity to read as misty and further away.
- The two rows use different tile periods so their repeats never fall in visible sync, and tree placement within each tile is irregular (varied spacing, varied size) rather than evenly spaced — this asymmetry is what keeps the treeline from reading as a repeating row of soldiers.

Every tree is still a single flat fill color — no gradient, no shadow, no naturalistic green/brown; distance is conveyed only by scale, vertical offset, and the existing Lavender Dimmed/Pink Dimmed tokens at reduced opacity, never a third hue or a blur. Sits behind all foreground content; opaque cards paint over it without legibility loss.

### Lesson Trail (signature)
The course, drawn as a path climbing through the wood rather than listed as rows. A `rounded-[32px]` board bordered in Night Edge and floored in Night — one step *darker* than the CozyPanel beside it, so it reads as ground rather than card — scrolling vertically over a trail that is taller than its window and opening centred on the clearing the learner is standing in.

- **The path.** Lesson one sits at the bottom and the trail climbs: progress is ground covered, not a list scrolled. Ground already walked is a solid 7px Lavender ribbon with round caps; ground ahead is a line of 7px Night Edge stepping stones, evenly spaced along the same curve and cleared away from each marker. Both are one Catmull-Rom spline through the clearings *and* a wandering halfway point between each pair, so the trail winds instead of running as straight hops. When every lesson is finished the stones stop at the last clearing — a path running on would promise lessons that do not exist.
- **The clearings.** Each lesson is a `rounded-full` disc on an oval patch of Night Soft forest floor: completed is 46px Lavender, current is 62px Pink with a slowly expanding Pink ring, locked is a 38px Night Edge outline at 75% opacity. The lesson number is always visible — a number is how you find your place. Locked clearings are plain `span`s, not links.
- **The signpost.** Every lesson's topic sits *beside* its marker, on whichever side the trail is not, never underneath it — under it is exactly where the path leaves the clearing.
- **The walker.** A Cream soweli silhouette stands in the clearing the learner has reached, turned towards its marker and shifting its weight on a slow idle. It is a place-marker, never a person, an avatar, or anyone else's.
- **The wood.** The same four treeline silhouettes, scattered by seeded rejection sampling around the path, the clearings, and the signposts — grown, not planted in rows. Trees past the walker are dimmed to 70% and scaled down; the forest thickens where the trail leaves the top of the board. Three to seven Lavender/Pink fireflies drift slowly across it at 35% opacity.
- **The edges.** The board's own ground is overlaid as a 40px gradient over the top and bottom, inside the border, so the trail dissolves into the wood in both directions instead of being cut off square.
- **The entrance.** The walked stretch draws itself from lesson one along the path (an SVG mask of one long dash, 820ms), each clearing popping in as the drawing reaches it; the stones and the clearings ahead fade in quietly afterwards. Every entrance is `backwards`, never `forwards`, so hover and focus still win once it has finished. All of it stops under `prefers-reduced-motion`.

### Inputs
- **Style:** Rounded-full, Night background, 2px Night Edge border, Cream text, Mist placeholder, no shadow.
- **Focus:** Border shifts to Lavender.
- **Disabled:** 70% opacity.

## Do's and Don'ts

### Do:
- **Do** keep every corner fully rounded or generously rounded (32px/28px/full) — no sharp or lightly-rounded shapes, except the treeline's flat conifer triangles.
- **Do** reserve Caveat script for the wordmark and at most one celebratory line per screen.
- **Do** alternate Lavender/Pink for repeated small identity marks (e.g. gems, grade buttons, treeline trees) rather than introducing a third color.
- **Do** keep the navy ground's fixed treeline and grain texture on every screen; separate surfaces with color and border only.

### Don't:
- **Don't** use `box-shadow` anywhere in this system — no lift, no glow, no pressable ledge. This includes not reintroducing the earlier "gumdrop ledge" button or "glow bloom" background this system used before it was flattened.
- **Don't** invent social features, avatars-as-people, or fake friend/leaderboard content this app doesn't have — borrow the reference world's pill-row grammar, never its social *content*.
- **Don't** set a heading, button, or paragraph in Caveat — script is a rare accent, not a body or label face.
- **Don't** introduce a third saturated color beyond Lavender and Pink — including in background scenery; a "forest" mood comes from the treeline's silhouette shapes, never from adding green.
- **Don't** use a sharp or lightly-rounded (2px/6px) corner anywhere in the UI chrome — that belonged to the discarded Instrument Panel system.
- **Don't** put a lesson's caption under its marker on the trail, or wrap the trail board in a CozyPanel — see the named rules above.
