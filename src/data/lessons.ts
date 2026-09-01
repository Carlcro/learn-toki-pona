import type { Lesson } from "./types";

// The sequence is deliberate. Lesson 1 keeps every word in a bare subject or
// predicate slot so nothing depends on grammar that hasn't been named yet;
// lesson 2 then introduces modifier order, which everything after it leans on.
// pi only shows up once plain modifier stacking is solid, because pi's whole
// job is overriding it. Negation lands early — you cannot hold a conversation
// without "not" — and compounding closes lesson 8, since it is the move that
// makes a small core of grammar cover everything.
//
// Lessons 9 onward carry the rest of the canonical vocabulary — the remaining
// pu words and all 17 nimi ku suli — in loose thematic batches, since by this
// point the grammar toolkit (li/e, modifiers, pi, o, prepositions,
// compounding) is already in place and each new lesson is mostly new content
// words slotting into it. Three more grammar points get their own lesson where
// the vocabulary actually needs them: numbers/nanpa, la, and the
// anu/taso/kin connectors.
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
	{
		id: "9",
		topic: "family",
		wordIds: ["mama", "meli", "mije", "tonsi", "olin", "kulupu"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "10",
		topic: "small creatures",
		wordIds: ["akesi", "waso", "kala", "pipi", "soko", "kijetesantakalu"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "11",
		topic: "the body",
		wordIds: ["sijelo", "lawa", "luka", "noka", "uta", "insa", "oko"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "12",
		topic: "colors",
		wordIds: ["loje", "laso", "jelo", "walo", "pimeja", "kule"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "13",
		topic: "numbers",
		wordIds: ["wan", "tu", "ale", "nanpa"],
		grammarConceptIds: ["numbers"],
		sceneIds: [],
	},
	{
		id: "14",
		topic: "sky and weather",
		wordIds: ["suno", "mun", "seli", "lete", "kon", "sewi"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "15",
		topic: "materials and objects",
		wordIds: ["kiwen", "ko", "len", "palisa", "poki", "lupa", "supa", "leko"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "16",
		topic: "plants and food",
		wordIds: ["kasi", "kili", "pan", "suwi", "moli", "jaki"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "17",
		topic: "la — setting the scene",
		wordIds: ["tenpo", "sin", "pini", "open", "awen", "lape", "la"],
		grammarConceptIds: ["la"],
		sceneIds: [],
	},
	{
		id: "18",
		topic: "work and society",
		wordIds: ["pali", "alasa", "esun", "mani", "jo", "unpa"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "19",
		topic: "sound and writing",
		wordIds: ["kalama", "mu", "nimi", "lipu", "sitelen", "kute", "pu"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "20",
		topic: "where things are",
		wordIds: ["monsi", "sinpin", "poka", "anpa", "weka", "nena"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "21",
		topic: "conflict and danger",
		wordIds: ["utala", "pakala", "kipisi", "lanpan", "monsuta", "jasima"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "22",
		topic: "connectors",
		wordIds: ["anu", "taso", "kin", "a", "n", "ante"],
		grammarConceptIds: ["anu-taso-kin"],
		sceneIds: [],
	},
	{
		id: "23",
		topic: "loose ends",
		wordIds: ["musi", "nasin", "linja", "sike", "selo", "wawa"],
		grammarConceptIds: [],
		sceneIds: [],
	},
	{
		id: "24",
		topic: "the newest words",
		wordIds: ["namako", "epiku", "meso", "misikeke", "kokosila", "ku"],
		grammarConceptIds: [],
		sceneIds: [],
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
