---
version: 1
slug: "src-routes-index-tsx"
primary_target: "src/routes/index.tsx"
related_targets: []
---

# Surface: Home / Dashboard (`src/routes/index.tsx`)

**Scope & visitor mode:** Operate. Entry point for a returning learner; not a marketing surface.

**Audience & job:** Learners studying Toki Pona from scratch, returning in occasional, longer sessions rather than a daily habit loop. They land here to see where they stand and get into their next lesson or review.

**Action / task:** Orient at a glance, then act — begin lesson 1 (first-run), resume the next lesson, or start a due review. Exactly one primary action per visit.

**Proof / content:** Mock progress data only (`wordsLearned`, `totalWords`, `dueForReview`, `nextLesson`, `lastStudied`) — no backend exists yet (see PRODUCT.md). Numbers are illustrative, not real learner data.

**Chosen direction:** "The Cozy Pouch of Trinkets" world (see DESIGN.md) — a rounded navy CozyPanel holding a bare lavender Baloo 2 count numeral ("10 / 137", no pill, no zero-padding — user-requested 2026-08-19, replacing the earlier odometer-style CountPod pill) and a GemTrack due-review row, with a single pink pill action button beneath. User- and brief-pinned world (reference screenshot + #d7b0fe/#febcd5), overriding the assigned concept roll (direction 5 of 7, seed bd58a4bd). Signature moment: on-mount count-up and staggered gem-pop, both honoring reduced motion.

**States:** Zeroed first-run (0 learned, 0 due, "Begin lesson 1") and returning (partial progress, due count, "Review N words" or "Resume — lesson N", last-studied line). Same layout for both — no separate welcome screen.

**Unresolved decisions:** Persistence/backend for real progress data; exact gem-track sizing rule if due-review counts regularly exceed 8; no hover state on the primary button yet (only active/press and keyboard-focus states shipped).
