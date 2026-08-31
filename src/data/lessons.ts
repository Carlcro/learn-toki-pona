import type { Lesson } from "./types";

// The sequence is deliberate. Lesson 1 keeps every word in a bare subject or
// predicate slot so nothing depends on grammar that hasn't been named yet;
// lesson 2 then introduces modifier order, which everything after it leans on.
// pi only shows up once plain modifier stacking is solid, because pi's whole
// job is overriding it. Negation lands early — you cannot hold a conversation
// without "not" — and compounding closes the course, since it is the move that
// makes a 137-word language cover everything.
export const LESSONS: Lesson[] = [
	{
		id: "1",
		topic: "mi, sina, li, e",
		wordIds: ["mi", "sina", "li", "e", "jan", "moku", "telo", "pona"],
		grammarConceptIds: ["li-e"],
		sceneIds: ["drinking-water", "i-eat-you-drink"],
	},
	{
		id: "2",
		topic: "word order",
		wordIds: ["suli", "lili", "mute", "ni", "soweli"],
		grammarConceptIds: ["modifiers"],
		sceneIds: ["big-small", "small-animal"],
	},
	{
		id: "3",
		topic: "ona, en, pre‑verbs",
		wordIds: ["ona", "en", "wile", "ken", "sona", "toki"],
		grammarConceptIds: ["en", "pre-verbs"],
		sceneIds: ["wants-to-eat", "person-and-animal"],
	},
	{
		id: "4",
		topic: "ala — saying no",
		wordIds: ["ala", "pilin", "ike", "seme"],
		grammarConceptIds: ["ala"],
		sceneIds: ["not-eating", "asking-good"],
	},
	{
		id: "5",
		topic: "pi",
		wordIds: ["pi", "tomo", "ma", "lukin"],
		grammarConceptIds: ["pi"],
		sceneIds: ["good-looking-person", "crowded-house"],
	},
	{
		id: "6",
		topic: "o",
		wordIds: ["o", "pana", "kama"],
		grammarConceptIds: ["o"],
		sceneIds: ["come-here", "give-food"],
	},
	{
		id: "7",
		topic: "prepositions",
		wordIds: ["lon", "tawa", "kepeken", "tan", "sama"],
		grammarConceptIds: ["prepositions"],
		sceneIds: ["at-home", "going-to"],
	},
	{
		id: "8",
		topic: "building words",
		wordIds: ["ilo", "nasa", "ijo"],
		grammarConceptIds: ["compounds"],
		sceneIds: ["strange-drink"],
	},
];

export const LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
	LESSONS.map((lesson) => [lesson.id, lesson]),
);

export function getLessonById(id: string): Lesson | undefined {
	return LESSONS_BY_ID[id];
}

/**
 * Every word taught up to and including `lessonId`, in course order. This is
 * the vocabulary a learner is fairly held to when writing a sentence — not the
 * whole dictionary, and not just the current lesson's handful.
 */
export function selectVocabularyThroughLesson(lessonId: string): Set<string> {
	const vocabulary = new Set<string>();
	for (const lesson of LESSONS) {
		for (const wordId of lesson.wordIds) vocabulary.add(wordId);
		if (lesson.id === lessonId) break;
	}
	return vocabulary;
}
