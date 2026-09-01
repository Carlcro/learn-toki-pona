# Feature plan: guided mini-dialogues (`toki` practice)

## Goal

The app teaches recognition (flashcards, sense checks) and description (scene
sentences), but nothing ever talks back — so learners never practice the core
conversational moves: answering a `seme` question, answering an `X ala X`
yes/no question with the bare verb, responding to an `o` request. This feature
adds short scripted dialogues where the app says a line and the learner types a
reply, validated for well-formedness and responsiveness, then shown idiomatic
reference replies.

This is a **data + one component + one lib module** feature. It reuses the
existing grammar validator, vocabulary gating, lesson step machinery, and
`SpeakerButton`. No SRS integration in v1 (dialogues are lesson steps like
scenes, which also record no grades).

## Codebase conventions (follow these)

- Tabs for indentation, formatted/linted by Biome (`npx biome check --write <files>`).
- Tests are Vitest, colocated in `src/lib/*.test.ts`. Run with `npm test`.
- Data files in `src/data/` are plain serializable objects with a
  `selectXForLesson`-style helper; types live in `src/data/types.ts`.
- Comments explain *why*, in full sentences, in the voice of the existing files
  (see the headers of `src/data/compounds.ts` and `src/data/senses.ts`).
- Learner-facing copy never uses grammar-school terminology ("predicate",
  "object"); see `src/data/grammar.ts` header comment for the rule.
- Known pre-existing failure: `npx tsc --noEmit` reports an unused variable in
  `src/components/LessonMap.tsx:243`. Leave it alone; everything else must be
  clean.

## 1. Types — `src/data/types.ts`

Add at the end (near `Compound`):

```ts
/** A line the app speaks. Shown with audio; `en` is the quiet translation. */
export interface DialogueAppTurn {
	speaker: "app";
	toki: string;
	en: string;
}

/**
 * A turn the learner must answer. A reply is accepted when it matches one of
 * `accepted` exactly (after tokenizing — punctuation and case are ignored), or
 * when every sentence in it is well-formed AND it contains every word in
 * `mustInclude`. `accepted` exists because the idiomatic answer to a yes/no
 * question is the bare verb ("wile.") — a fragment the sentence validator
 * would reject.
 */
export interface DialogueLearnerTurn {
	speaker: "learner";
	/** What the learner is being asked to do, in plain English. */
	prompt: string;
	/** Words the reply must contain for it to count as answering the question. */
	mustInclude: WordId[];
	/** Extra full replies accepted verbatim (normalized), e.g. bare-verb answers. */
	accepted?: string[];
	/** Idiomatic replies shown after answering — “you could also say”. */
	references: string[];
	/** Optional word-bank nudge, like a scene's allowedWordIds. */
	hintWordIds?: WordId[];
}

export type DialogueTurn = DialogueAppTurn | DialogueLearnerTurn;

/**
 * A short scripted conversation. The app plays its side; the learner types
 * theirs. Like compounds, a dialogue belongs to a lesson and may only lean on
 * vocabulary taught at or before it.
 */
export interface Dialogue {
	id: string;
	lessonId: string;
	/** Shown as the exercise heading, e.g. “Meeting a friend”. */
	title: string;
	turns: DialogueTurn[];
}
```

## 2. Content — new file `src/data/dialogues.ts`

Use this content **exactly as written** — the toki pona has been checked
against the validator and against each lesson's cumulative vocabulary. Do not
invent additional lines.

```ts
import type { Dialogue } from "./types";

// Conversation is where the grammar stops being facts and becomes reflexes:
// the ala-question sandwich only matters when someone asks you one, and the
// dropped-li rule only becomes automatic when you answer as mi. Each dialogue
// slots into a lesson and uses only vocabulary taught by then. App lines may
// be idiomatic fragments ("toki!", "pona mute!"); learner-turn references are
// full sentences unless the turn carries `accepted` bare-answer forms.
export const DIALOGUES: Dialogue[] = [
	{
		id: "greeting-feelings",
		lessonId: "4",
		title: "Meeting a friend",
		turns: [
			{ speaker: "app", toki: "toki!", en: "Hello!" },
			{
				speaker: "learner",
				prompt: "Greet them back.",
				mustInclude: ["toki"],
				accepted: ["toki"],
				references: ["toki!"],
			},
			{ speaker: "app", toki: "sina pilin seme?", en: "How are you feeling?" },
			{
				speaker: "learner",
				prompt: "Tell them how you feel.",
				mustInclude: ["pilin"],
				references: ["mi pilin pona.", "mi pilin ike."],
				hintWordIds: ["mi", "pilin", "pona", "ike"],
			},
			{
				speaker: "app",
				toki: "sina wile ala wile moku?",
				en: "Do you want to eat?",
			},
			{
				speaker: "learner",
				prompt:
					"Answer yes or no — the toki pona way is to answer with the verb.",
				mustInclude: ["wile"],
				accepted: ["wile", "wile ala"],
				references: ["wile.", "wile ala."],
				hintWordIds: ["wile", "ala"],
			},
		],
	},
	{
		id: "come-and-give",
		lessonId: "6",
		title: "Being asked over",
		turns: [
			{ speaker: "app", toki: "o kama! mi wile toki.", en: "Come! I want to talk." },
			{
				speaker: "learner",
				prompt: "Tell them you're coming.",
				mustInclude: ["kama"],
				references: ["mi kama."],
				hintWordIds: ["mi", "kama"],
			},
			{
				speaker: "app",
				toki: "mi wile moku. o pana e moku.",
				en: "I'm hungry. Give me the food.",
			},
			{
				speaker: "learner",
				prompt: "Say that you're giving them the food.",
				mustInclude: ["pana"],
				references: ["mi pana e moku."],
				hintWordIds: ["mi", "pana", "e", "moku"],
			},
			{ speaker: "app", toki: "pona mute! sina jan pona.", en: "Great! You're a friend." },
		],
	},
	{
		id: "where-are-you",
		lessonId: "7",
		title: "Where are you?",
		turns: [
			{ speaker: "app", toki: "sina lon seme?", en: "Where are you?" },
			{
				speaker: "learner",
				prompt: "Say where you are.",
				mustInclude: ["lon"],
				references: ["mi lon tomo.", "mi lon ma."],
				hintWordIds: ["mi", "lon", "tomo", "ma"],
			},
			{ speaker: "app", toki: "sina tawa seme?", en: "Where are you going?" },
			{
				speaker: "learner",
				prompt: "Say where you're going.",
				mustInclude: ["tawa"],
				references: ["mi tawa tomo.", "mi tawa ma."],
				hintWordIds: ["mi", "tawa", "tomo", "ma"],
			},
			{
				speaker: "app",
				toki: "pona. o kama tawa tomo mi!",
				en: "Nice. Come to my house!",
			},
			{
				speaker: "learner",
				prompt: "Agree — say you're coming to their house.",
				mustInclude: ["kama"],
				references: ["mi kama.", "mi kama tawa tomo sina."],
				hintWordIds: ["mi", "kama", "tawa", "tomo", "sina"],
			},
		],
	},
	{
		id: "family-talk",
		lessonId: "9",
		title: "Talking about family",
		turns: [
			{ speaker: "app", toki: "jan ni li seme?", en: "Who is this?" },
			{
				speaker: "learner",
				prompt: "Say this person is your parent.",
				mustInclude: ["mama"],
				references: ["ona li mama mi.", "jan ni li mama mi."],
				hintWordIds: ["ona", "jan", "ni", "li", "mama", "mi"],
			},
			{
				speaker: "app",
				toki: "pona! sina olin ala olin e mama sina?",
				en: "Nice! Do you love your parent?",
			},
			{
				speaker: "learner",
				prompt: "Answer with the verb — yes or no.",
				mustInclude: ["olin"],
				accepted: ["olin", "olin ala"],
				references: ["olin.", "mi olin e ona."],
				hintWordIds: ["olin", "ala", "mi", "e", "ona"],
			},
			{
				speaker: "app",
				toki: "kulupu mama li pona tawa mi.",
				en: "Family is dear to me.",
			},
		],
	},
];

export function selectDialoguesForLesson(lessonId: string): Dialogue[] {
	return DIALOGUES.filter((dialogue) => dialogue.lessonId === lessonId);
}
```

## 3. Reply checking — new file `src/lib/dialogue.ts`

```ts
import type { DialogueLearnerTurn } from "#/data/types";
import {
	tokenize,
	type ValidationError,
	validateLiE,
} from "./grammar-validator";

export type ReplyCheck =
	| { ok: true }
	| { ok: false; reason: ValidationError | "missing-word"; token?: string };

/** A reply can hold several sentences; each is validated on its own. */
export function splitSentences(reply: string): string[];

export function checkReply(
	turn: DialogueLearnerTurn,
	reply: string,
	vocabulary: Iterable<string>,
): ReplyCheck;
```

Semantics of `checkReply`, in order:

1. Normalize the whole reply as `tokenize(reply).join(" ")`. If it equals any
   entry in `turn.accepted` (each also normalized the same way — entries in the
   data are already lowercase/unpunctuated, but normalize anyway so data
   punctuation can't break matching), return `{ ok: true }`. This is the escape
   hatch for bare-verb answers that `validateLiE` would reject.
2. Split the reply into sentences: split on `/[.!?]+/`, trim, drop empties. If
   nothing remains, return `{ ok: false, reason: "empty" }`.
3. Validate each sentence with `validateLiE(sentence, vocabulary)`. On the
   first failure, return `{ ok: false, reason, token }` passing through the
   validator's reason and token.
4. Check `mustInclude`: every listed word must appear in `tokenize(reply)`.
   If one is missing, return `{ ok: false, reason: "missing-word", token }`
   with the missing word as `token`.
5. Return `{ ok: true }`.

The validator only handles single-clause sentences, so keeping app lines and
references inside its supported structures is a content constraint (already
satisfied by the content above — note `taso` at sentence start would fail it,
which is why no dialogue uses it).

## 4. Shared validation messages

`ContextExercise.tsx` holds a private `VALIDATION_MESSAGES` map. Extract it to
a new module `src/components/validation-messages.ts`, exporting the map typed
as `Record<ValidationError, string>`, and import it from both
`ContextExercise.tsx` (delete the local copy) and the new `DialogueExercise`.
Add one extra message used only by dialogues, in the same voice:

```ts
"missing-word": "Well formed — but it doesn't answer the question. Try using “{token}”.",
```

Since the map is keyed by `ValidationError`, keep `missing-word` out of the map
and handle it inline in `DialogueExercise` (it needs the token interpolated
anyway) — mirror how `ContextExercise` special-cases `unknown-word`.

## 5. UI — new file `src/components/DialogueExercise.tsx`

Props:

```ts
{
	dialogue: Dialogue;
	/** Every word taught up to this lesson — same set ContextExercise gets. */
	vocabulary: Set<string>;
	onNext: () => void;
}
```

State: `turnIndex` (first unresolved turn), `input`, per-attempt `feedback`
(message string or null), `failedAttempts` for the current learner turn,
`revealed` (whether the reference was shown as a rescue), and a transcript of
resolved turns.

Behavior:

- Render inside `CozyPanel` with the standard uppercase kicker label
  (`Talk with them`) and the dialogue `title` under it, matching the heading
  pattern in `ContextExercise`.
- The transcript renders resolved turns in order: app turns as
  left-aligned bubbles showing `toki` in `font-display` with a
  `SpeakerButton` beside it and `en` beneath in muted `text-mist` small text;
  resolved learner turns as right-aligned bubbles (use the existing chip
  colors: lavender background like `SentenceBuilder`'s chosen chips).
- App turns resolve automatically: when the current turn is an app turn,
  append it to the transcript and advance `turnIndex` (do this in a `useEffect`
  or by advancing eagerly in an `advanceThroughAppTurns` helper — several app
  turns can be consecutive at the end).
- When the current turn is a learner turn: show its `prompt`, the optional
  word bank built from `hintWordIds` filtered by `vocabulary` (copy the
  tap-to-append bank from `ContextExercise`, including the "nudge, not a
  boundary" behavior), and the same text input styling
  (`autoCapitalize="none"`, `autoCorrect="off"`, `spellCheck={false}`).
- On submit, run `checkReply(turn, input, vocabulary)`:
  - ok → push the learner bubble, show a small "You could also say:" line
    listing `turn.references` under the bubble for that turn, clear input and
    feedback, advance.
  - not ok → show the message (from the shared map; interpolate the token for
    `unknown-word` and `missing-word`), increment `failedAttempts`, keep the
    input editable. After 2 failed attempts show an outline button
    "Show me a reply" that reveals `turn.references[0]`; the learner can then
    type or tap it (tapping fills the input) and submit normally.
- When every turn is resolved, show the primary continue button
  ("Continue") calling `onNext` — same button classes as the other exercises.
- No grading, no store writes. Completion is just reaching the end.

## 6. Wiring — `src/routes/lesson.$lessonId.tsx`

- Import `selectDialoguesForLesson` and `DialogueExercise`; import the
  `Dialogue` type.
- Add to the `Step` union: `| { kind: "dialogue"; dialogue: Dialogue }`.
- `buildSteps` gains a `dialogues: Dialogue[]` arg; push dialogue steps **after
  the scenes loop** — conversation is the lesson's finale, after the learner
  has drilled the words and built sentences.
- In the `steps` `useMemo`, pass `dialogues: selectDialoguesForLesson(lesson.id)`.
- Render branch, following the scene pattern:

```tsx
{step.kind === "dialogue" && (
	<DialogueExercise
		key={step.dialogue.id}
		dialogue={step.dialogue}
		vocabulary={vocabulary}
		onNext={advance}
	/>
)}
```

## 7. Tests

### New `src/lib/dialogue.test.ts`

Unit-test `checkReply` with a hand-built turn and a small vocabulary set (see
`library.test.ts` for the fixture style):

1. A full well-formed reply containing the `mustInclude` word passes
   (`"mi pilin pona."` for a turn requiring `pilin`).
2. An `accepted` bare answer passes even though `validateLiE` would reject it
   (`"wile ala."` normalizes to `"wile ala"`).
3. A well-formed reply missing the required word fails with
   `reason: "missing-word"` and `token` naming it.
4. An ill-formed reply passes through the validator's reason
   (`"mi li pilin pona."` → `unexpected-li`).
5. A reply using an untaught word fails with `unknown-word` and the token.
6. A multi-sentence reply validates each sentence — one good + one bad
   sentence fails.
7. Empty/whitespace reply → `empty`.

### Extend `src/lib/curriculum-audit.test.ts`

Add a `describe("dialogue sequencing")` in the same file, same style —
accumulate violations into an array and expect it empty, so one run reports
everything:

1. **Vocabulary**: for every dialogue, every token of every app turn's `toki`,
   every learner turn's `references` and `accepted` entries, and every
   `mustInclude`/`hintWordIds` id is inside
   `selectVocabularyThroughLesson(dialogue.lessonId)`. Fail loudly if the
   `lessonId` doesn't exist in `LESSONS`.
2. **Well-formedness**: every app turn's `toki` (each sentence, split the same
   way `splitSentences` does) and every reference of a learner turn **without**
   an `accepted` list passes `validateLiE` against the full word list — the
   same standard `library.test.ts` holds library lines to. References on turns
   *with* `accepted` are exempt, because bare-verb answers are idiomatic
   fragments. Exception: standalone interjection app lines (`"toki!"`,
   `"pona mute!"`) won't validate — exempt an app line when it has no learner
   turn after it or when it tokenizes to ≤ 2 tokens with no `li`/`o`/`e`.
   Simplest robust rule: only validate app-line sentences of 3+ tokens.
3. **Answerability**: for every learner turn, every `mustInclude` word appears
   in at least one of its `references` or `accepted` entries — a reference the
   learner is shown must itself pass the turn's own check. Stronger version
   (preferred): run `checkReply(turn, reference, vocabulary)` for each
   reference and expect `ok: true`.

## 8. Acceptance checklist

- `npm test` — all green, including the new files.
- `npx biome check src` — clean (run `--write` first).
- `npx tsc --noEmit` — no new errors (the `LessonMap.tsx` one is pre-existing).
- Manual: `npm run dev`, open lesson 4, complete it — the dialogue appears
  after the scene exercises; a bare `wile` answer is accepted for the yes/no
  turn; a grammatical but off-topic reply ("mi moku") is rejected with the
  missing-word message; two failures reveal the rescue button.

## 9. Explicitly out of scope for v1

- SRS scheduling for dialogues (would mirror `senseCards`; add later if
  dialogues prove worth reviewing).
- Branching (the script is linear; `accepted`/`mustInclude` give enough reply
  freedom).
- More dialogues past the four above — add only after the mechanics are proven,
  and always under the sequencing tests.
- Extending `validateLiE` (e.g. sentence-initial `taso`) — content avoids its
  gaps instead.
