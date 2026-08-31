import type { GrammarConcept } from "./types";

// Explanations are written for someone who has never been taught grammar
// terms. "Predicate", "direct object", "modifier", "clause" and the rest are
// deliberately absent: a learner who has to look up the explanation has been
// taught nothing. Where a term is genuinely useful shorthand later, it is
// introduced once, in brackets, after the plain words for it.
//
// Every concept carries at least one worked example cut into labelled pieces
// (see SentenceAnatomy). For most of these points, showing where the sentence
// splits *is* the explanation — the prose only says what the picture cannot.
export const GRAMMAR_CONCEPTS: GrammarConcept[] = [
	{
		id: "li-e",
		name: "li / e",
		explanation:
			"A toki pona sentence comes in two halves: who or what it's about, then " +
			"what they do or are. li is the little word that marks where the first " +
			"half ends and the second begins — it isn't translated, it's a signpost. " +
			"Leave li out when the first half is just mi or sina on its own; that one " +
			"exception is the only time it disappears. e marks the thing the action " +
			"is done to, when there is one.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "who it's about" },
					{ text: "li", particle: true },
					{ text: "moku", label: "what they do" },
					{ text: "e", particle: true },
					{ text: "telo", label: "what they do it to" },
				],
				en: "The person drinks water.",
			},
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "moku", label: "what they do (no li)" },
				],
				en: "I eat.",
			},
		],
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
			"A describing word comes after the word it describes, never before — the " +
			"opposite of English. Stack as many as you like, and each one applies to " +
			"everything on its left. The same word can land in the other half of the " +
			"sentence instead and become the thing being said: jan suli is a big " +
			"person, but jan li suli says the person is big. Position decides, not " +
			"the word.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "the thing" },
					{ text: "pona", label: "describes jan" },
					{ text: "mute", label: "describes “jan pona”" },
				],
				en: "Many good people.",
			},
			{
				chunks: [
					{ text: "jan", label: "who it's about" },
					{ text: "li", particle: true },
					{ text: "suli", label: "what's being said about them" },
				],
				en: "The person is big.",
			},
		],
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
			"en glues two things into a single “who it's about”, so one li still " +
			"covers them both. Watch the mi exception disappear here: mi on its own " +
			"drops li, but the moment en joins mi to something else, the first half " +
			"is no longer a bare mi and li comes back.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "one of them" },
					{ text: "en", particle: true },
					{ text: "soweli", label: "the other" },
					{ text: "li", particle: true },
					{ text: "pona", label: "said about both" },
				],
				en: "The person and the animal are good.",
			},
			{
				chunks: [
					{ text: "mi en sina", label: "no longer a bare mi…" },
					{ text: "li", particle: true, label: "…so li is back" },
					{ text: "pona", label: "said about both" },
				],
				en: "You and I are good.",
			},
		],
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
			"wile (want/need/must), ken (can/may), and sona (know how to) go straight " +
			"in front of an action word to bend its meaning. Nothing else changes: " +
			"the pair still sits in the same half of the sentence as one action, and " +
			"e still marks whatever it's done to.",
		examples: [
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "wile", label: "wants to…" },
					{ text: "moku", label: "…eat" },
				],
				en: "I want to eat.",
			},
			{
				chunks: [
					{ text: "sina", label: "who it's about" },
					{ text: "ken moku", label: "can eat" },
					{ text: "e", particle: true },
					{ text: "telo", label: "what they do it to" },
				],
				en: "You can drink water.",
			},
		],
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
			"ala cancels the word directly in front of it — put it right after " +
			"whatever you mean to undo. To ask a yes/no question, say the action, " +
			"then ala, then the same action again: that sandwich is toki pona's " +
			"question mark. Answer with the bare action for yes, or the action plus " +
			"ala for no.",
		examples: [
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "moku", label: "eat…" },
					{ text: "ala", label: "…cancelled" },
				],
				en: "I'm not eating.",
			},
			{
				chunks: [
					{ text: "sina", label: "who it's about" },
					{ text: "moku ala moku", label: "action, ala, action = a question" },
				],
				en: "Are you eating?",
			},
		],
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
			"Describing words normally attach one at a time to whatever sits right " +
			"before them, which goes wrong as soon as you want two of them to work as " +
			"a pair. pi regroups: everything after pi becomes one bundle describing " +
			"the word just before pi. Without it, jan pona lukin reads as “a good " +
			"person, visibly” — pi is what makes the last two words stick together.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "the thing" },
					{ text: "pi", particle: true },
					{ text: "pona lukin", label: "one bundle: “good appearance”" },
				],
				en: "A good-looking person.",
			},
			{
				chunks: [
					{ text: "tomo", label: "the thing" },
					{ text: "pi", particle: true },
					{ text: "jan mute", label: "one bundle: “many people”" },
				],
				en: "A crowded house.",
			},
		],
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
			"o stands where li would, and turns a statement into a command, request, " +
			"or suggestion. Unlike li it is never dropped — mi and sina keep it too. " +
			"Leave out the first half entirely and o opens a command aimed at " +
			"everyone, including you.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "who you're talking to" },
					{ text: "o", particle: true, label: "makes it a command" },
					{ text: "kama", label: "what they should do" },
				],
				en: "Person, come here!",
			},
			{
				chunks: [
					{ text: "o", particle: true, label: "nobody named…" },
					{ text: "pona", label: "…so it's aimed at everyone" },
				],
				en: "Let's be good!",
			},
		],
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
			"(from/because), and sama (same/like) add where, how, why, or compared to " +
			"what onto the second half of the sentence. They are ordinary words doing " +
			"a joining job, so they need no e — the thing follows straight after.",
		examples: [
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "tawa", label: "going to…" },
					{ text: "tomo", label: "…here — no e needed" },
				],
				en: "I'm going to the house.",
			},
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "toki", label: "what they do" },
					{ text: "kepeken", label: "using…" },
					{ text: "toki pona", label: "…this" },
				],
				en: "I speak using Toki Pona.",
			},
		],
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
			"Toki Pona has no word for phone, friend, or bathroom. You build one from " +
			"what you already have, using the same after-the-word order as any other " +
			"description. Read a built word literally first, then ask what it would " +
			"have to mean in this situation — the same pair can land somewhere else " +
			"and mean something else entirely.",
		examples: [
			{
				chunks: [
					{ text: "ilo", label: "tool" },
					{ text: "toki", label: "for talking" },
				],
				en: "A phone.",
			},
			{
				chunks: [
					{ text: "tomo", label: "room" },
					{ text: "telo", label: "of water" },
				],
				en: "A bathroom.",
			},
		],
		check: {
			question: "Which one would you use for “a phone”?",
			options: ["toki ilo", "ilo toki", "ilo pi toki"],
			answer: "ilo toki",
		},
	},
];

export const GRAMMAR_CONCEPTS_BY_ID: Record<string, GrammarConcept> =
	Object.fromEntries(GRAMMAR_CONCEPTS.map((concept) => [concept.id, concept]));
