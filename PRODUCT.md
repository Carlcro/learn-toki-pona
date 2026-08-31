# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Learners studying Toki Pona from scratch — people who want to acquire the language's core vocabulary (~120-140 words) and grammar, not reference it as already-fluent speakers.

## Product Purpose

A lean, focused app for learning Toki Pona. Success means a learner reliably acquires the core vocabulary and grammar through the app's structured path, rather than assembling their own study plan from scattered resources.

## Positioning

Combines three learning mechanisms other Toki Pona resources don't combine: spaced repetition (SRS) for retention, a deliberate curated lesson sequence (not random drilling) so each lesson builds on prior words/grammar, and example-sentence/context-based learning so words are learned in use, not as isolated definitions. "Lean" refers to this method being tightly scoped and minimal, not to sparse content.

## Capabilities and Constraints

- Vocabulary and definitions must match the official/canonical Toki Pona Dictionary — no fan variants or invented words.
- No lesson content, word lists, or example sentences exist yet; this must be created or sourced before real lessons can ship. Nothing in the app should fabricate placeholder vocabulary as if canonical.
- Undecided: exact lesson sequence/curriculum structure past the first two lessons is not yet decided.
- Undecided — persistence: progress currently lives only in browser localStorage (`src/lib/store.ts`), single-device, no backup. Recommendation: keep local-only through curriculum buildout (no accounts needed to validate the learning method), then revisit once there's a concrete cross-device or backup need — the app already deploys to Cloudflare Workers, so Cloudflare D1/KV plus a lightweight auth flow is the natural next step if/when that need shows up. Not implemented; a deliberate scope call for the product owner, not an engineering default.

## Evidence on Hand

None. No word lists, lesson content, or example sentences exist yet — future work must source these from the canonical Toki Pona Dictionary rather than inventing vocabulary or definitions.

## Product Principles

1. Sequence over randomness: lessons build deliberately on prior vocabulary and grammar rather than drilling words in isolation or at random.
2. Context over definitions: introduce words through real example sentences, not bare word/definition pairs.
3. Retention by design: spaced repetition drives review scheduling so learned words stay learned.
4. Canonical vocabulary only: content is sourced from the official Toki Pona Dictionary, never invented or fan variants.
5. Lean scope: the method stays tightly focused on the core vocabulary and grammar rather than expanding into a general-purpose reference tool.
