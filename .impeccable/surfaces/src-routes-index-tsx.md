---
version: 1
slug: "src-routes-index-tsx"
primary_target: "src/routes/index.tsx"
related_targets: ["src/components/LessonMap.tsx","src/lib/trail.ts"]
---

# Surface: Home / Dashboard (`src/routes/index.tsx`)

**Scope & visitor mode:** Operate. Entry point for a returning learner; not a marketing surface.

**Audience & job:** Learners studying Toki Pona from scratch, returning in occasional, longer sessions rather than a daily habit loop. They land here to see where they stand and get into their next lesson or review.

**Action / task:** Orient at a glance, then act — begin lesson 1 (first-run), resume the next lesson, or start a due review. Exactly one primary action per visit.

**Proof / content:** Real local progress (`src/lib/store.ts`, localStorage) over the eight lessons in `src/data/lessons.ts` — words learned, items due, streak, library coverage, per-lesson status. No backend (see PRODUCT.md); nothing here is fabricated.

**Chosen direction:** "The Cozy Pouch of Trinkets" world (see DESIGN.md) — a rounded navy CozyPanel holding a bare lavender Baloo 2 count numeral ("10 / 137", no pill, no zero-padding — user-requested 2026-08-19, replacing the earlier odometer-style CountPod pill) and a GemTrack due-review row, with a single pink pill action button beneath. User- and brief-pinned world (reference screenshot + #d7b0fe/#febcd5), overriding the assigned concept roll (direction 5 of 7, seed bd58a4bd).

Since 2026-09-01 the lesson list is the **Lesson Trail** (DESIGN.md, signature component): a scrolling forest map board beside the stats panel, where each lesson is a clearing on a winding path, walked ground is a solid lavender ribbon, ground ahead is stepping stones, and the clearing you are standing in is ringed by a slowly turning broken circle. Scroll your own clearing off the board and a bobbing chevron appears at that edge, pointing the way back and scrolling you there. User-requested — a game-like map "just like a video game", replacing the previous pill-row grid of lesson tiles.

**Signature moments:** the on-mount count-up and staggered gem-pop in the stats panel; and, on the trail, the walked path drawing itself from lesson one with each clearing popping in as the drawing reaches it. All honor `prefers-reduced-motion`.

**States:** Zeroed first-run (0 learned, 0 due, "Begin lesson 1", trail all stepping stones, clearing 1 pink and pulsing) · returning (partial progress, due count, ribbon up to the current clearing, stones beyond) · rest day (lesson done, review timing, library nudge) · course-complete (no current clearing — the trail stops at the last clearing, and the CTA points at the library). Same layout for all — no separate welcome screen.

**Unresolved decisions:** Persistence/backend for real progress data; gem-track sizing rule if due-review counts regularly exceed 8; no hover state on the primary button yet (only active/press and keyboard-focus states shipped). The trail's fixed 116px pitch means a course past ~30 lessons scrolls a long way inside the board — fine for now, worth revisiting if the curriculum grows.
