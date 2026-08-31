import type { GrammarConcept } from "./types";

export const GRAMMAR_CONCEPTS: GrammarConcept[] = [
	{
		id: "li-e",
		name: "li / e",
		explanation:
			"li introduces the predicate for any subject — except a bare mi or sina, " +
			"where li is left out. e introduces the direct object, when there is one. " +
			"mi moku. (I eat.) jan li moku e telo. (The person drinks water.)",
		check: {
			question: "Which one is correct for “I eat”?",
			options: ["mi li moku.", "mi moku.", "moku li mi."],
			answer: "mi moku.",
		},
	},
	{
		id: "modifiers",
		name: "word order",
		explanation:
			"A modifier comes after the word it changes, never before: jan pona " +
			"(a good person), tomo suli (a big house), moku lili (a small meal). " +
			"Stack as many as you like and each one applies to everything on its " +
			"left: jan pona mute (many good people). The same word can be the " +
			"predicate instead — jan li suli (the person is big) — so position, not " +
			"the word itself, decides whether it describes or asserts.",
		check: {
			question: "Which one means “a big house”?",
			options: ["suli tomo", "tomo suli", "tomo li suli"],
			answer: "tomo suli",
		},
	},
	{
		id: "en",
		name: "en",
		explanation:
			"en joins two or more subjects into one group before a single li. " +
			"jan en soweli li pona. (The person and the animal are good.) Each joined " +
			"subject still follows the normal li rule — a lone mi or sina drops li, but " +
			"as soon as en joins it to something else, li comes back: mi en sina li pona.",
		check: {
			question: "Which one means “you and I are good”?",
			options: ["mi en sina li pona.", "mi en sina pona.", "mi pona en sina."],
			answer: "mi en sina li pona.",
		},
	},
	{
		id: "pre-verbs",
		name: "wile / ken / sona",
		explanation:
			"wile (want/need/must), ken (can/may), and sona (know how to) sit directly " +
			"in front of another verb to modify it, still inside one li ... clause. " +
			"mi wile moku. (I want to eat.) sina ken moku e telo. (You can drink water.) " +
			"jan li sona toki. (The person knows how to talk.)",
		check: {
			question: "Where does wile go in “I want to eat”?",
			options: ["mi moku wile.", "mi wile moku.", "wile mi moku."],
			answer: "mi wile moku.",
		},
	},
	{
		id: "ala",
		name: "ala",
		explanation:
			"ala negates the word directly in front of it. mi moku ala. (I'm not " +
			"eating.) ni li pona ala. (This isn't good.) telo ala (no water). " +
			"To ask a yes/no question, say the verb, then ala, then the same verb " +
			"again: sina moku ala moku? (Are you eating?) Answer with the bare verb " +
			"for yes — moku. — or the verb plus ala for no — moku ala.",
		check: {
			question: "How do you ask “are you eating?”",
			options: ["sina ala moku?", "sina moku ala moku?", "sina moku ala?"],
			answer: "sina moku ala moku?",
		},
	},
	{
		id: "pi",
		name: "pi",
		explanation:
			"Modifiers normally stack one at a time onto whatever comes right before " +
			"them. pi resets that: it groups everything after it into a single " +
			"modifier phrase for the noun just before pi. jan pi pona lukin. " +
			"(A good-looking person — literally 'person of good appearance'.) " +
			"Without pi, jan pona lukin would read as 'a good person, visibly'. " +
			"tomo pi jan mute. (A house of many people — a crowded house.)",
		check: {
			question: "Which one means “a house of many people”?",
			options: ["tomo jan mute", "tomo pi jan mute", "pi tomo jan mute"],
			answer: "tomo pi jan mute",
		},
	},
	{
		id: "o",
		name: "o",
		explanation:
			"o replaces li to turn a sentence into a command, request, or suggestion — " +
			"for any subject, and unlike li it's never dropped. sina o pona. " +
			"(Be good! / You should be good.) jan o kama! (Person, come here!) " +
			"With no subject at all, o alone opens a general command: o pona! " +
			"(Be good, everyone! / Let's be good!)",
		check: {
			question: "Which one is a command, not a statement?",
			options: ["sina li kama.", "sina o kama.", "o li kama."],
			answer: "sina o kama.",
		},
	},
	{
		id: "prepositions",
		name: "lon / tawa / kepeken / tan / sama",
		explanation:
			"lon (at/in/on), tawa (to/toward/for), kepeken (using/with), tan " +
			"(from/because), and sama (same/like) are ordinary content words that " +
			"also work as prepositions — they sit inside the predicate to say " +
			"where, how, why, or in relation to what. No e is needed; they just " +
			"add more words to the predicate. mi lon tomo. (I'm at the house.) " +
			"mi tawa tomo. (I'm going to the house.) mi toki kepeken toki pona. " +
			"(I speak using Toki Pona.) mi kama tan tomo. (I come from the house.) " +
			"ona li sama mi. (They're like me.)",
		check: {
			question: "Which one means “I'm going to the house”?",
			options: ["mi tawa e tomo.", "mi tawa tomo.", "mi e tawa tomo."],
			answer: "mi tawa tomo.",
		},
	},
	{
		id: "compounds",
		name: "building words",
		explanation:
			"Toki Pona has no word for phone, friend, or bathroom — you build one " +
			"out of what you already have, using plain modifier order. ilo toki " +
			"(talking tool) is a phone. jan pona (good person) is a friend. tomo " +
			"telo (water room) is a bathroom. telo nasa (strange liquid) is alcohol. " +
			"ma tomo (building land) is a city. Read a compound literally first, " +
			"then ask what it would have to mean here — context does the rest of " +
			"the work, and the same compound can mean different things elsewhere.",
		check: {
			question: "Which one would you use for “a phone”?",
			options: ["toki ilo", "ilo toki", "ilo pi toki"],
			answer: "ilo toki",
		},
	},
];

export const GRAMMAR_CONCEPTS_BY_ID: Record<string, GrammarConcept> =
	Object.fromEntries(GRAMMAR_CONCEPTS.map((concept) => [concept.id, concept]));
