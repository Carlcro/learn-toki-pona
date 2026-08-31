import { describe, expect, it } from "vitest";
import { COMPOUNDS } from "#/data/compounds";
import { GRAMMAR_CONCEPTS, GRAMMAR_CONCEPTS_BY_ID } from "#/data/grammar";
import { LESSONS, selectVocabularyThroughLesson } from "#/data/lessons";
import { LIBRARY_ITEMS } from "#/data/library";
import { SCENES } from "#/data/scenes";
import { SENSE_ITEMS } from "#/data/senses";
import type { Lesson, LibraryItem, WordId } from "#/data/types";
import { WORDS, WORDS_BY_ID } from "#/data/words";
import { tokenize, validateLiE } from "./grammar-validator";
import {
	selectItemStatus,
	selectItemWordIds,
	selectKnownConceptIds,
	selectKnownWordIds,
	selectLibraryProgress,
	selectLibraryStatuses,
	selectUnlockCountForLesson,
} from "./library";
import type { SrsCard } from "./srs";

const ALL_WORDS = new Set(WORDS.map((word) => word.id as string));

function card(overrides: Partial<SrsCard> = {}): SrsCard {
	return {
		id: "mi",
		kind: "word",
		easeFactor: 2.5,
		intervalDays: 0,
		repetitions: 0,
		learningStep: 0,
		dueAt: "2026-01-01T00:00:00.000Z",
		lastReviewedAt: null,
		...overrides,
	};
}

const item: LibraryItem = {
	id: "test-item",
	title: "Test item",
	grammarConceptIds: ["li-e"],
	lines: [
		{ toki: "mi moku e telo.", en: "I drink water." },
		{ toki: "telo li pona.", en: "The water is good." },
	],
};

describe("selectItemWordIds", () => {
	it("collects each word once, in order of first appearance", () => {
		expect(selectItemWordIds(item)).toEqual([
			"mi",
			"moku",
			"e",
			"telo",
			"li",
			"pona",
		]);
	});
});

describe("selectKnownWordIds", () => {
	it("only counts words that have been answered at least once", () => {
		const cards: Partial<Record<WordId, SrsCard>> = {
			mi: card({ id: "mi" }),
			telo: card({ id: "telo", lastReviewedAt: "2026-01-01T00:00:00.000Z" }),
		};
		expect(selectKnownWordIds(cards)).toEqual(new Set(["telo"]));
	});
});

describe("selectKnownConceptIds", () => {
	const lessons: Lesson[] = [
		{
			id: "1",
			topic: "One",
			wordIds: ["mi"],
			grammarConceptIds: ["li-e"],
			sceneIds: [],
		},
		{
			id: "2",
			topic: "Two",
			wordIds: ["ona"],
			grammarConceptIds: ["en"],
			sceneIds: [],
		},
	];

	it("credits grammar only from completed lessons", () => {
		expect(selectKnownConceptIds(["1"], lessons)).toEqual(new Set(["li-e"]));
	});

	it("returns nothing before any lesson is finished", () => {
		expect(selectKnownConceptIds([], lessons)).toEqual(new Set());
	});
});

describe("selectItemStatus", () => {
	const allWords = new Set(["mi", "moku", "e", "telo", "li", "pona"]);

	it("marks a piece readable when every word and concept is known", () => {
		const status = selectItemStatus(item, allWords, new Set(["li-e"]));
		expect(status.readable).toBe(true);
		expect(status.missingWordIds).toEqual([]);
		expect(status.missingConceptIds).toEqual([]);
	});

	it("reports exactly which words are still missing", () => {
		const known = new Set(["mi", "moku", "e", "li"]);
		const status = selectItemStatus(item, known, new Set(["li-e"]));
		expect(status.readable).toBe(false);
		expect(status.missingWordIds).toEqual(["telo", "pona"]);
	});

	it("locks a piece whose grammar has not been taught yet", () => {
		const status = selectItemStatus(item, allWords, new Set());
		expect(status.readable).toBe(false);
		expect(status.missingWordIds).toEqual([]);
		expect(status.missingConceptIds).toEqual(["li-e"]);
	});
});

describe("selectLibraryProgress", () => {
	it("reports the readable share as a rounded percentage", () => {
		const statuses = selectLibraryStatuses(
			[item, { ...item, id: "other" }, { ...item, id: "third" }],
			new Set(["mi", "moku", "e", "telo", "li", "pona"]),
			new Set(["li-e"]),
		);
		expect(selectLibraryProgress(statuses)).toEqual({
			readable: 3,
			total: 3,
			percent: 100,
		});
	});

	it("is zero for a learner who has read nothing", () => {
		const statuses = selectLibraryStatuses([item], new Set(), new Set());
		expect(selectLibraryProgress(statuses)).toEqual({
			readable: 0,
			total: 1,
			percent: 0,
		});
	});
});

describe("selectUnlockCountForLesson", () => {
	const lesson: Lesson = {
		id: "1",
		topic: "One",
		wordIds: ["telo", "pona"],
		grammarConceptIds: ["li-e"],
		sceneIds: [],
	};

	it("counts the pieces a lesson would newly open up", () => {
		const known = new Set(["mi", "moku", "e", "li"]);
		expect(selectUnlockCountForLesson([item], known, new Set(), lesson)).toBe(
			1,
		);
	});

	it("does not count pieces that are already readable", () => {
		const known = new Set(["mi", "moku", "e", "telo", "li", "pona"]);
		expect(
			selectUnlockCountForLesson([item], known, new Set(["li-e"]), lesson),
		).toBe(0);
	});

	it("stays at zero when the lesson does not complete any piece", () => {
		expect(
			selectUnlockCountForLesson([item], new Set(), new Set(), lesson),
		).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// Corpus guards. The library is only trustworthy if it never shows a learner
// something the curriculum has not taught — in words *or* in grammar.
// ---------------------------------------------------------------------------

const PARTICLES = new Set(["li", "e", "o", "en", "pi"]);
const PRE_VERBS = new Set(["wile", "ken", "sona"]);
const BARE_PRONOUNS = new Set(["mi", "sina"]);

/**
 * Restores the li that a bare mi/sina subject drops, so the subject and the
 * predicate don't look like two adjacent words modifying each other.
 */
function withImplicitLi(tokens: string[]): string[] {
	if (tokens.includes("li") || tokens.includes("o")) return tokens;
	if (!BARE_PRONOUNS.has(tokens[0])) return tokens;
	return [tokens[0], "li", ...tokens.slice(1)];
}

/**
 * True when two content words sit side by side — which in Toki Pona means the
 * second is modifying the first. ala is skipped (it negates rather than
 * modifies) and so are pre-verbs (they stack verbs, not descriptions).
 */
function usesModifierOrder(line: string): boolean {
	const tokens = withImplicitLi(tokenize(line));
	for (let i = 0; i < tokens.length - 1; i++) {
		const [a, b] = [tokens[i], tokens[i + 1]];
		if (PARTICLES.has(a) || PARTICLES.has(b)) continue;
		if (a === "ala" || b === "ala") continue;
		if (PRE_VERBS.has(a)) continue;
		return true;
	}
	return false;
}

function usesPreVerb(line: string): boolean {
	const tokens = tokenize(line);
	return tokens.some(
		(token, index) =>
			PRE_VERBS.has(token) &&
			index + 1 < tokens.length &&
			!PARTICLES.has(tokens[index + 1]) &&
			tokens[index + 1] !== "ala",
	);
}

describe("library corpus", () => {
	it("has unique ids", () => {
		const ids = LIBRARY_ITEMS.map((entry) => entry.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("uses only canonical curriculum vocabulary", () => {
		for (const entry of LIBRARY_ITEMS) {
			for (const wordId of selectItemWordIds(entry)) {
				expect(
					WORDS_BY_ID[wordId as WordId],
					`"${wordId}" in library item "${entry.id}" is not a curriculum word`,
				).toBeDefined();
			}
		}
	});

	it("references grammar concepts that exist and are taught by some lesson", () => {
		const taughtConceptIds = new Set(
			LESSONS.flatMap((lesson) => lesson.grammarConceptIds),
		);
		for (const entry of LIBRARY_ITEMS) {
			for (const conceptId of entry.grammarConceptIds) {
				expect(GRAMMAR_CONCEPTS_BY_ID[conceptId]).toBeDefined();
				expect(
					taughtConceptIds.has(conceptId),
					`concept "${conceptId}" in "${entry.id}" is never taught`,
				).toBe(true);
			}
		}
	});

	it("holds only grammatical sentences", () => {
		for (const entry of LIBRARY_ITEMS) {
			for (const line of entry.lines) {
				expect(
					validateLiE(line.toki, ALL_WORDS),
					`"${line.toki}" in "${entry.id}"`,
				).toEqual({ valid: true });
			}
		}
	});

	// A piece that under-declares its grammar unlocks early and hands the
	// learner a construction nobody has explained yet. This is the check that
	// would have caught modifier order being used from lesson 1 while only
	// being taught in lesson 2.
	it("declares every particle it actually uses", () => {
		const required: [string, string][] = [
			["pi", "pi"],
			["ala", "ala"],
			["en", "en"],
			["o", "o"],
		];
		for (const entry of LIBRARY_ITEMS) {
			const tokens = new Set(
				entry.lines.flatMap((line) => tokenize(line.toki)),
			);
			for (const [token, conceptId] of required) {
				if (!tokens.has(token)) continue;
				expect(
					entry.grammarConceptIds,
					`"${entry.id}" uses ${token} without declaring "${conceptId}"`,
				).toContain(conceptId);
			}
		}
	});

	it("declares pre-verbs wherever one stacks in front of another verb", () => {
		for (const entry of LIBRARY_ITEMS) {
			if (!entry.lines.some((line) => usesPreVerb(line.toki))) continue;
			expect(
				entry.grammarConceptIds,
				`"${entry.id}" stacks a pre-verb without declaring "pre-verbs"`,
			).toContain("pre-verbs");
		}
	});

	it("declares modifier order wherever two content words sit together", () => {
		for (const entry of LIBRARY_ITEMS) {
			// Prepositional phrases and pi groups both put content words side by
			// side without it being modification, so they are read past here.
			if (
				entry.grammarConceptIds.includes("prepositions") ||
				entry.grammarConceptIds.includes("pi")
			) {
				continue;
			}
			if (!entry.lines.some((line) => usesModifierOrder(line.toki))) continue;
			expect(
				entry.grammarConceptIds,
				`"${entry.id}" puts a modifier after a noun without declaring "modifiers"`,
			).toContain("modifiers");
		}
	});

	it("becomes fully readable once the whole curriculum is finished", () => {
		const knownConceptIds = selectKnownConceptIds(
			LESSONS.map((lesson) => lesson.id),
			LESSONS,
		);
		const statuses = selectLibraryStatuses(
			LIBRARY_ITEMS,
			ALL_WORDS,
			knownConceptIds,
		);
		expect(selectLibraryProgress(statuses).percent).toBe(100);
	});

	// The library only motivates if finishing a lesson visibly pays off, so
	// every lesson in the curriculum must open at least one new piece.
	it("has every lesson unlock at least one new piece", () => {
		const knownWordIds = new Set<string>();
		const knownConceptIds = new Set<string>();
		for (const lesson of LESSONS) {
			const unlocked = selectUnlockCountForLesson(
				LIBRARY_ITEMS,
				knownWordIds,
				knownConceptIds,
				lesson,
			);
			expect(
				unlocked,
				`lesson ${lesson.id} opens no new pieces`,
			).toBeGreaterThan(0);
			for (const wordId of lesson.wordIds) knownWordIds.add(wordId);
			for (const conceptId of lesson.grammarConceptIds) {
				knownConceptIds.add(conceptId);
			}
		}
	});

	it("opens at least one piece to a learner who has only finished lesson 1", () => {
		const lessonOne = LESSONS[0];
		const statuses = selectLibraryStatuses(
			LIBRARY_ITEMS,
			new Set<string>(lessonOne.wordIds),
			selectKnownConceptIds(["1"], LESSONS),
		);
		expect(selectLibraryProgress(statuses).readable).toBeGreaterThan(0);
	});
});

describe("curriculum", () => {
	it("teaches every word exactly once", () => {
		const taught = LESSONS.flatMap((lesson) => lesson.wordIds);
		expect(new Set(taught).size).toBe(taught.length);
		expect(new Set(taught)).toEqual(new Set(WORDS.map((word) => word.id)));
	});

	it("teaches every grammar concept exactly once", () => {
		const taught = LESSONS.flatMap((lesson) => lesson.grammarConceptIds);
		expect(new Set(taught).size).toBe(taught.length);
		expect(new Set(taught)).toEqual(
			new Set(GRAMMAR_CONCEPTS.map((concept) => concept.id)),
		);
	});

	// pi exists to override plain modifier stacking, so stacking has to come
	// first — teaching them the other way round was the original ordering bug.
	it("teaches modifier order before pi", () => {
		const order = LESSONS.flatMap((lesson) => lesson.grammarConceptIds);
		expect(order.indexOf("modifiers")).toBeLessThan(order.indexOf("pi"));
	});

	it("teaches negation early enough to be usable", () => {
		const lesson = LESSONS.find((entry) =>
			entry.grammarConceptIds.includes("ala"),
		);
		expect(lesson).toBeDefined();
		expect(Number(lesson?.id)).toBeLessThanOrEqual(4);
	});

	it("keeps every grammar check's answer among its own options", () => {
		for (const concept of GRAMMAR_CONCEPTS) {
			expect(
				concept.check.options,
				`"${concept.id}" check cannot be answered`,
			).toContain(concept.check.answer);
		}
	});

	it("only asks about senses of words it has taught", () => {
		for (const sense of SENSE_ITEMS) {
			expect(sense.options).toContain(sense.answer);
			expect(WORDS_BY_ID[sense.wordId]).toBeDefined();
			for (const token of tokenize(sense.sentence)) {
				expect(
					ALL_WORDS.has(token),
					`sense item "${sense.id}" uses untaught word "${token}"`,
				).toBe(true);
			}
		}
	});

	it("builds every compound out of words already taught by its lesson", () => {
		for (const compound of COMPOUNDS) {
			const vocabulary = selectVocabularyThroughLesson(compound.lessonId);
			for (const wordId of compound.answer) {
				expect(
					vocabulary.has(wordId),
					`compound "${compound.id}" needs "${wordId}" before lesson ${compound.lessonId} teaches it`,
				).toBe(true);
			}
		}
	});

	// A scene's model answers have to be sentences the learner could actually
	// have written by that point in the course.
	it("keeps every scene's reference sentences inside the lesson's vocabulary", () => {
		for (const lesson of LESSONS) {
			const vocabulary = selectVocabularyThroughLesson(lesson.id);
			for (const sceneId of lesson.sceneIds) {
				const scene = SCENES.find((entry) => entry.id === sceneId);
				expect(
					scene,
					`lesson ${lesson.id} references missing scene ${sceneId}`,
				).toBeDefined();
				if (!scene) continue;
				for (const sentence of scene.referenceSentences) {
					expect(
						validateLiE(sentence, vocabulary),
						`"${sentence}" in scene "${scene.id}"`,
					).toEqual({ valid: true });
				}
				for (const wordId of scene.allowedWordIds) {
					expect(
						vocabulary.has(wordId),
						`scene "${scene.id}" offers "${wordId}" before it is taught`,
					).toBe(true);
				}
			}
		}
	});
});
