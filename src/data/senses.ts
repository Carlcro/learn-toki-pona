import type { SenseItem, WordId } from "./types";

// The hard part of Toki Pona is not how many words there are — it is that each
// one covers a whole field of meaning and takes its part of speech from where
// it sits. These items put one word in two different slots and ask what it is
// doing there, which is the skill a gloss-matching drill never touches.
//
// Items are matched to lessons by their wordId, so adding one here surfaces it
// in whichever lesson introduces that word.
export const SENSE_ITEMS: SenseItem[] = [
	{
		id: "moku-verb",
		wordId: "moku",
		sentence: "jan li moku e telo.",
		options: ["drinks", "the food", "a meal"],
		answer: "drinks",
		note: "It follows li and takes an object with e, so it has to be the action.",
	},
	{
		id: "moku-noun",
		wordId: "moku",
		sentence: "moku li pona.",
		options: ["eats", "the food", "eat!"],
		answer: "the food",
		note: "It's the subject, sitting before li — the thing, not the action.",
	},
	{
		id: "pona-predicate",
		wordId: "pona",
		sentence: "telo li pona.",
		options: ["good water", "is good", "goodness"],
		answer: "is good",
		note: "After li it's the predicate: the claim the sentence is making.",
	},
	{
		id: "suli-modifier",
		wordId: "suli",
		sentence: "jan suli li moku.",
		options: ["is big", "big", "bigness"],
		answer: "big",
		note: "It sits inside the subject, right after jan, so it describes jan instead of asserting anything.",
	},
	{
		id: "suli-predicate",
		wordId: "suli",
		sentence: "jan li suli.",
		options: ["big person", "is big", "very"],
		answer: "is big",
		note: "The same word, one slot later: after li it stops describing and starts asserting.",
	},
	{
		id: "telo-verb",
		wordId: "telo",
		sentence: "mi telo e soweli.",
		options: ["water", "wash", "wet"],
		answer: "wash",
		note: "e hands it an object, so telo is an action here — watering or washing something.",
	},
	{
		id: "mute-quantity",
		wordId: "mute",
		sentence: "jan mute li pona.",
		options: ["many", "very", "a crowd"],
		answer: "many",
		note: "Modifying a noun, mute counts it. Modifying an adjective it would intensify instead: pona mute is 'very good'.",
	},
	{
		id: "toki-noun",
		wordId: "toki",
		sentence: "toki mi li pona.",
		options: ["I speak", "language", "talkative"],
		answer: "language",
		note: "It heads the subject with mi modifying it, so it's a thing you can own.",
	},
	{
		id: "toki-verb",
		wordId: "toki",
		sentence: "mi toki.",
		options: ["language", "talk", "a greeting"],
		answer: "talk",
		note: "It's the whole predicate after a bare mi, so it's what mi is doing.",
	},
	{
		id: "sona-preverb",
		wordId: "sona",
		sentence: "jan li sona toki.",
		options: ["knowledge", "knows how to", "is known"],
		answer: "knows how to",
		note: "Another verb follows it directly, which is what makes sona a pre-verb rather than the noun 'knowledge'.",
	},
	{
		id: "ala-negation",
		wordId: "ala",
		sentence: "mi moku ala.",
		options: ["nothing", "not", "no!"],
		answer: "not",
		note: "It sits directly after moku, so it cancels moku and nothing else.",
	},
	{
		id: "ala-question",
		wordId: "ala",
		sentence: "sina pona ala pona?",
		options: ["not", "or", "makes it a yes/no question"],
		answer: "makes it a yes/no question",
		note: "The same word repeats on both sides of ala — that sandwich is how Toki Pona asks yes or no.",
	},
	{
		id: "pilin-verb",
		wordId: "pilin",
		sentence: "mi pilin pona.",
		options: ["a feeling", "feel", "am touched"],
		answer: "feel",
		note: "Predicate after a bare mi, with pona describing how.",
	},
	{
		id: "lukin-verb",
		wordId: "lukin",
		sentence: "mi lukin e soweli.",
		options: ["appearance", "watch", "visible"],
		answer: "watch",
		note: "e gives it an object, so it's the act of looking.",
	},
	{
		id: "lukin-noun",
		wordId: "lukin",
		sentence: "jan pi pona lukin li toki.",
		options: ["watches", "appearance", "sees"],
		answer: "appearance",
		note: "Inside pi pona lukin it's a noun — literally 'of good appearance'.",
	},
	{
		id: "kama-preverb",
		wordId: "kama",
		sentence: "mi kama sona e toki pona.",
		options: ["arrive", "come to (begin to)", "an event"],
		answer: "come to (begin to)",
		note: "In front of another verb, kama means becoming or starting to — kama sona is how you say 'learn'.",
	},
	{
		id: "pana-verb",
		wordId: "pana",
		sentence: "o pana e moku.",
		options: ["a gift", "give", "was given"],
		answer: "give",
		note: "After o it's a command, so it's the action being asked for.",
	},
	{
		id: "tawa-preposition",
		wordId: "tawa",
		sentence: "ni li pona tawa mi.",
		options: ["goes", "to / for", "moves"],
		answer: "to / for",
		note: "pona tawa mi is literally 'good to me' — the ordinary way to say you like something.",
	},
	{
		id: "lon-verb",
		wordId: "lon",
		sentence: "mi lon.",
		options: ["at", "am here / am real", "a location"],
		answer: "am here / am real",
		note: "With nothing after it, lon can't be a preposition — it's the verb 'to be present'.",
	},
	{
		id: "nasa-compound",
		wordId: "nasa",
		sentence: "telo nasa li ike.",
		options: [
			"strange liquid, i.e. alcohol",
			"bad water",
			"the water is strange",
		],
		answer: "strange liquid, i.e. alcohol",
		note: "telo nasa is the whole subject of li ike — a built noun, not a sentence about water being odd.",
	},
	{
		id: "ilo-compound",
		wordId: "ilo",
		sentence: "mi toki kepeken ilo toki.",
		options: ["talking tool, i.e. a phone", "tool talk", "I use tools"],
		answer: "talking tool, i.e. a phone",
		note: "Read it literally first — 'tool of talking' — then let the situation pick which such tool is meant.",
	},
];

export function selectSenseItemsForWords(wordIds: WordId[]): SenseItem[] {
	const wanted = new Set<string>(wordIds);
	return SENSE_ITEMS.filter((item) => wanted.has(item.wordId));
}
