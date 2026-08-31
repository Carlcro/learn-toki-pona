import type { LibraryItem } from "./types";

// The readable library. Every piece uses only canonical Toki Pona vocabulary
// from src/data/words.ts — library.test.ts fails the build if a piece smuggles
// in a word the curriculum never teaches.
//
// grammarConceptIds must list every grammar point a reader needs, including
// "modifiers" for any piece that puts a modifier after a noun. A piece that
// under-declares its grammar would unlock early and hand the learner a
// construction nobody has explained yet.
//
// Ordered easiest first: the earliest pieces need only lesson 1 vocabulary, and
// each later group leans on words and grammar introduced further along. What a
// learner can actually read is computed from their own SRS state, not from this
// ordering.
export const LIBRARY_ITEMS: LibraryItem[] = [
	{
		id: "the-water-is-good",
		title: "The water is good",
		grammarConceptIds: ["li-e"],
		lines: [
			{ toki: "mi moku e telo.", en: "I drink water." },
			{ toki: "telo li pona.", en: "The water is good." },
			{ toki: "mi pona.", en: "I feel fine." },
		],
	},
	{
		id: "the-person-drinks",
		title: "The person drinks",
		grammarConceptIds: ["li-e"],
		lines: [{ toki: "jan li moku e telo.", en: "The person drinks water." }],
	},
	{
		id: "you-drink-water",
		title: "You drink water",
		grammarConceptIds: ["li-e"],
		lines: [{ toki: "sina moku e telo.", en: "You drink water." }],
	},
	{
		id: "you-are-good",
		title: "You are good",
		grammarConceptIds: ["li-e"],
		lines: [
			{ toki: "sina pona.", en: "You are good." },
			{ toki: "sina suli.", en: "You are important." },
			{ toki: "mi lili.", en: "I am small." },
		],
	},
	{
		id: "big-and-small",
		title: "Big and small",
		grammarConceptIds: ["li-e", "modifiers"],
		lines: [
			{ toki: "jan suli li moku.", en: "The big person is eating." },
			{ toki: "jan lili li moku e moku.", en: "The little one eats food." },
			{ toki: "moku li pona.", en: "The food is good." },
		],
	},
	{
		id: "a-small-meal",
		title: "A small meal",
		grammarConceptIds: ["li-e", "modifiers"],
		lines: [{ toki: "mi moku e moku lili.", en: "I eat a small meal." }],
	},
	{
		id: "the-person-and-the-animal",
		title: "The person and the animal",
		grammarConceptIds: ["li-e", "en"],
		lines: [
			{ toki: "jan en soweli li moku.", en: "The person and the animal eat." },
			{ toki: "soweli li lili.", en: "The animal is small." },
			{ toki: "ona li pona.", en: "It is nice." },
		],
	},
	{
		id: "you-and-i",
		title: "You and I",
		grammarConceptIds: ["li-e", "en"],
		lines: [{ toki: "mi en sina li pona.", en: "You and I are good." }],
	},
	{
		id: "i-want-to-talk",
		title: "I want to talk",
		grammarConceptIds: ["li-e", "pre-verbs"],
		lines: [
			{ toki: "mi wile toki.", en: "I want to talk." },
			{ toki: "sina ken toki.", en: "You can talk." },
			{ toki: "toki li pona.", en: "Talking is good." },
		],
	},
	{
		id: "they-know-how",
		title: "They know how",
		grammarConceptIds: ["li-e", "pre-verbs"],
		lines: [{ toki: "ona li sona toki.", en: "They know how to speak." }],
	},
	{
		id: "what-do-you-want",
		title: "What do you want?",
		grammarConceptIds: ["li-e", "pre-verbs"],
		lines: [{ toki: "sina wile moku e seme?", en: "What do you want to eat?" }],
	},
	{
		id: "what-is-this",
		title: "What is this?",
		grammarConceptIds: ["li-e", "modifiers"],
		lines: [
			{ toki: "ni li seme?", en: "What is this?" },
			{ toki: "ni li moku.", en: "It is food." },
			{ toki: "moku ni li pona.", en: "This food is good." },
		],
	},
	{
		id: "feeling-bad",
		title: "Feeling bad",
		grammarConceptIds: ["li-e", "pre-verbs", "modifiers"],
		lines: [
			{ toki: "mi pilin ike.", en: "I feel bad." },
			{ toki: "telo li ike.", en: "The water is bad." },
			{ toki: "mi wile e telo pona.", en: "I want good water." },
		],
	},
	{
		id: "not-hungry",
		title: "Not hungry",
		grammarConceptIds: ["li-e", "ala"],
		lines: [
			{ toki: "sina moku ala moku?", en: "Are you eating?" },
			{ toki: "mi moku ala.", en: "I'm not eating." },
			{ toki: "mi wile ala e moku.", en: "I don't want any food." },
		],
	},
	{
		id: "is-it-any-good",
		title: "Is it any good?",
		grammarConceptIds: ["li-e", "ala", "modifiers"],
		lines: [
			{ toki: "ni li pona ala pona?", en: "Is this good?" },
			{ toki: "ni li pona ala.", en: "It isn't good." },
			{ toki: "mi pilin ike.", en: "I feel bad about it." },
		],
	},
	{
		id: "they-dont-know",
		title: "They don't know",
		grammarConceptIds: ["li-e", "ala"],
		lines: [{ toki: "ona li sona ala e ni.", en: "They don't know this." }],
	},
	{
		id: "i-see-many-people",
		title: "I see many people",
		grammarConceptIds: ["li-e", "modifiers"],
		lines: [{ toki: "mi lukin e jan mute.", en: "I see many people." }],
	},
	{
		id: "the-good-looking-person",
		title: "The good-looking person",
		grammarConceptIds: ["li-e", "pi", "modifiers"],
		lines: [
			{
				toki: "jan pi pona lukin li toki.",
				en: "The good-looking person talks.",
			},
		],
	},
	{
		id: "a-crowded-house",
		title: "A crowded house",
		grammarConceptIds: ["li-e", "pi", "modifiers"],
		lines: [
			{ toki: "tomo li suli.", en: "The house is big." },
			{
				toki: "tomo pi jan mute li pona.",
				en: "A house of many people is good.",
			},
			{ toki: "mi lukin e tomo.", en: "I look at the house." },
		],
	},
	{
		id: "many-animals",
		title: "Many animals",
		grammarConceptIds: ["li-e", "pre-verbs", "modifiers"],
		lines: [
			{ toki: "ma li suli.", en: "The land is big." },
			{ toki: "soweli mute li moku.", en: "Many animals are eating." },
			{ toki: "mi wile lukin e soweli.", en: "I want to watch the animals." },
		],
	},
	{
		id: "my-house",
		title: "My house",
		grammarConceptIds: ["li-e", "pre-verbs", "modifiers"],
		lines: [
			{ toki: "tomo mi li lili.", en: "My house is small." },
			{ toki: "mi wile e tomo suli.", en: "I want a big house." },
			{ toki: "tomo suli li pona.", en: "A big house is good." },
		],
	},
	{
		id: "come-here",
		title: "Come here",
		grammarConceptIds: ["o"],
		lines: [{ toki: "sina o kama!", en: "Come here!" }],
	},
	{
		id: "give-the-food",
		title: "Give the food",
		grammarConceptIds: ["o"],
		lines: [{ toki: "o pana e moku.", en: "Give the food." }],
	},
	{
		id: "say-this",
		title: "Say this",
		grammarConceptIds: ["o"],
		lines: [{ toki: "sina o toki e ni.", en: "Say this." }],
	},
	{
		id: "everyone-come",
		title: "Everyone, come",
		grammarConceptIds: ["li-e", "o"],
		lines: [
			{ toki: "jan o kama!", en: "Everyone, come!" },
			{ toki: "moku li kama.", en: "The food is coming." },
			{ toki: "o moku!", en: "Eat!" },
		],
	},
	{
		id: "here-is-water",
		title: "Here is water",
		grammarConceptIds: ["li-e", "o"],
		lines: [
			{ toki: "mi pana e telo.", en: "I hand over the water." },
			{ toki: "sina o moku.", en: "Drink up." },
			{ toki: "ni li pona.", en: "That is good." },
		],
	},
	{
		id: "from-the-land",
		title: "From the land",
		grammarConceptIds: ["li-e", "prepositions"],
		lines: [
			{ toki: "soweli li kama tan ma.", en: "The animal comes from the land." },
		],
	},
	{
		id: "like-me",
		title: "Like me",
		grammarConceptIds: ["li-e", "prepositions"],
		lines: [{ toki: "ona li sama mi.", en: "They are like me." }],
	},
	{
		id: "going-home",
		title: "Going home",
		grammarConceptIds: ["li-e", "prepositions", "modifiers"],
		lines: [
			{ toki: "mi lon ma.", en: "I am out on the land." },
			{ toki: "mi tawa tomo mi.", en: "I go to my house." },
			{ toki: "tomo mi li pona tawa mi.", en: "I like my house." },
		],
	},
	{
		id: "speaking-toki-pona",
		title: "Speaking toki pona",
		grammarConceptIds: ["li-e", "prepositions", "modifiers"],
		lines: [
			{ toki: "mi toki kepeken toki pona.", en: "I speak using Toki Pona." },
			{ toki: "toki ni li lili.", en: "This language is small." },
			{ toki: "ona li pona tawa jan mute.", en: "Many people like it." },
		],
	},
	{
		id: "in-the-big-house",
		title: "In the big house",
		grammarConceptIds: ["li-e", "prepositions", "modifiers"],
		lines: [
			{
				toki: "jan mute li lon tomo suli.",
				en: "Many people are in the big house.",
			},
			{ toki: "ona li moku e telo.", en: "They are drinking water." },
			{ toki: "ona li pilin pona.", en: "They feel good." },
		],
	},
	{
		id: "i-know-this-language",
		title: "I know this language",
		grammarConceptIds: ["li-e", "prepositions", "modifiers"],
		lines: [
			{ toki: "mi sona e toki pona.", en: "I know Toki Pona." },
			{ toki: "mi toki kepeken ona.", en: "I speak using it." },
			{ toki: "ni li pona tawa mi.", en: "I like that." },
		],
	},
	{
		id: "the-whole-world",
		title: "The whole world",
		grammarConceptIds: ["li-e", "pre-verbs", "prepositions", "modifiers"],
		lines: [
			{ toki: "jan mute li lon ma.", en: "Many people are in the world." },
			{
				toki: "ona li toki kepeken toki mute.",
				en: "They speak using many languages.",
			},
			{
				toki: "jan lili li ken sona e toki pona.",
				en: "A child can come to know Toki Pona.",
			},
			{ toki: "ni li pona tawa mi.", en: "I like that." },
		],
	},
	{
		id: "what-is-that-thing",
		title: "What is that thing?",
		grammarConceptIds: ["li-e", "compounds", "modifiers"],
		lines: [
			{ toki: "ijo ni li seme?", en: "What is this thing?" },
			{ toki: "ni li ilo moku.", en: "It's an eating tool." },
			{ toki: "ilo ni li pona.", en: "This tool is good." },
		],
	},
	{
		id: "the-talking-tool",
		title: "The talking tool",
		grammarConceptIds: ["li-e", "compounds", "modifiers", "prepositions"],
		lines: [
			{ toki: "ilo toki mi li lili.", en: "My phone is small." },
			{ toki: "mi toki kepeken ilo ni.", en: "I talk using this device." },
			{ toki: "ilo li pona tawa mi.", en: "I like it." },
		],
	},
	{
		id: "strange-water",
		title: "Strange water",
		grammarConceptIds: [
			"li-e",
			"compounds",
			"modifiers",
			"ala",
			"prepositions",
		],
		lines: [
			{ toki: "telo nasa li ike tawa mi.", en: "I don't like alcohol." },
			{ toki: "mi moku ala e telo nasa.", en: "I don't drink alcohol." },
			{ toki: "jan nasa li mute.", en: "There are a lot of silly people." },
		],
	},
];

export const LIBRARY_ITEMS_BY_ID: Record<string, LibraryItem> =
	Object.fromEntries(LIBRARY_ITEMS.map((item) => [item.id, item]));

export function getLibraryItemById(id: string): LibraryItem | undefined {
	return LIBRARY_ITEMS_BY_ID[id];
}
