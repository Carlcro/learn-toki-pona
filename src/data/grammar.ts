import type { GrammarConcept } from "./types";

// Explanations are written for someone who has never been taught grammar
// terms. "Predicate", "direct object", "modifier", "clause", "verb" and the
// rest are deliberately absent: a learner who has to look up the explanation
// has been taught nothing. Where a plain phrase is needed instead, it is the
// same phrase everywhere ("action word", "describing word", "who it's
// about", "what they do") so the learner meets one name per idea.
//
// The voice is warm and a little playful, but every sentence is short and
// says one thing. No dashes are used to join clauses: a new thought gets a
// new sentence.
//
// Every concept carries at least one worked example cut into labelled pieces
// (see SentenceAnatomy). For most of these points, showing where the sentence
// splits *is* the explanation — the prose only says what the picture cannot.
export const GRAMMAR_CONCEPTS: GrammarConcept[] = [
	{
		id: "li-e",
		name: "li / e",
		explanation:
			"Every toki pona sentence has two halves. First comes who or what it's " +
			"about. Then comes what they do, or what they are. The tiny word li " +
			"sits between the halves like a fence post. It has no meaning of its " +
			"own and never gets translated. It just shows where the second half " +
			"starts. One exception: if the first half is only mi (I) or sina (you), " +
			"li stays home. And when the action is done to something, the little " +
			"word e points at that something.",
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
			"In English you say big person. In toki pona you say person big: jan " +
			"suli. A describing word always comes after the thing it describes. " +
			"You can stack as many as you like, and each new one describes " +
			"everything to its left. Now watch the same word move. jan suli means " +
			"a big person. But jan li suli means the person is big. Once suli " +
			"crosses the li fence, it stops describing and becomes the point of " +
			"the sentence. Where a word sits decides what it does.",
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
			question: "Which one means “a big animal”?",
			options: ["suli soweli", "soweli suli", "soweli li suli"],
			answer: "soweli suli",
		},
	},
	{
		id: "en",
		name: "en",
		explanation:
			"en means and, but it has one job only: joining the people or things a " +
			"sentence is about. jan en soweli li pona means the person and the " +
			"animal are good. One li still covers them both. Now watch the mi " +
			"exception. mi on its own drops li. But mi en sina is no longer mi on " +
			"its own, so li comes back: mi en sina li pona.",
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
					{ text: "mi en sina", label: "no longer mi alone…" },
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
			"Three helper words go right in front of an action word to change its " +
			"flavour. wile means want, need, or must. ken means can or may. sona " +
			"means know how to. So mi moku is I eat, and mi wile moku is I want " +
			"to eat. Nothing else about the sentence changes. The helper and the " +
			"action still sit together in the second half, and e still points at " +
			"whatever the action is done to.",
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
			"ala means not. Put it right after the word you want to cancel, and " +
			"only that word gets cancelled: mi moku ala is I'm not eating. ala " +
			"also makes questions. Toki pona has no word for a question mark, so " +
			"to ask a yes or no question you say the action, then ala, then the " +
			"same action again. sina moku ala moku? means are you eating? To " +
			"answer, say the action alone for yes (moku) or the action plus ala " +
			"for no (moku ala).",
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
			"Describing words normally stick one at a time to whatever is right " +
			"before them. That works fine until you want two of them to act as a " +
			"team. Say you want to say good-looking person. jan pona lukin " +
			"doesn't work, because it reads as a good person, seen. pi fixes it. " +
			"Everything after pi bundles into one team, and the whole team " +
			"describes the word just before pi. jan pi pona lukin: a person of " +
			"good looks.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "the thing" },
					{ text: "pi", particle: true },
					{ text: "pona lukin", label: "one bundle: “good looks”" },
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
			"o turns a sentence into a command, a request, or a suggestion. It " +
			"takes the spot where li would go. Unlike li, o never gets dropped, " +
			"not even after mi or sina: sina o kama means come here, you. Leave " +
			"out the first half completely and the command is aimed at everyone, " +
			"including yourself: o pona means let's be good.",
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
			"These five little words add extra detail to the second half of a " +
			"sentence: where, how, why, or compared to what. lon means at, in, or " +
			"on. tawa means to, toward, or for. kepeken means using or with. tan " +
			"means from or because of. sama means same as or like. They never " +
			"need e. Just put the next word straight after them: mi tawa tomo " +
			"means I'm going to the house.",
		examples: [
			{
				chunks: [
					{ text: "mi", label: "who it's about" },
					{ text: "tawa", label: "going to…" },
					{ text: "tomo", label: "…here, with no e needed" },
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
			"Toki pona has no word for phone, friend, or bathroom. Instead you " +
			"build one out of words you already know, in the usual order: the " +
			"main thing first, then what kind. ilo toki is a talking tool, which " +
			"is a phone. tomo telo is a water room, which is a bathroom. Read a " +
			"built word literally first, then ask what it would have to mean " +
			"right here. The same pair can mean something quite different in " +
			"another situation.",
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
	{
		id: "numbers",
		name: "wan / tu / ale / nanpa",
		explanation:
			"wan (one) and tu (two) are describing words like any other, so they " +
			"come after the thing they count: jan tu is two people. Toki pona " +
			"has no word for three or anything higher. For a bigger amount, use " +
			"mute (many) or ale (all). To say first or second instead of one or " +
			"two, put nanpa in front of the number: jan nanpa wan is the first " +
			"person.",
		examples: [
			{
				chunks: [
					{ text: "jan", label: "the thing" },
					{ text: "tu", label: "how many: two" },
					{ text: "li", particle: true },
					{ text: "pona", label: "what's being said about them" },
				],
				en: "Two people are good.",
			},
			{
				chunks: [
					{ text: "jan", label: "the thing" },
					{ text: "nanpa wan", label: "which one: the first" },
					{ text: "li", particle: true },
					{ text: "kama", label: "what they do" },
				],
				en: "The first person is coming.",
			},
		],
		check: {
			question: "Which one means “the first person”?",
			options: ["jan wan", "jan nanpa wan", "nanpa jan wan"],
			answer: "jan nanpa wan",
		},
	},
	{
		id: "la",
		name: "la",
		explanation:
			"la lets you set the scene before you say the main thing. Put the " +
			"setting first, then la, then the sentence it belongs to. The setting " +
			"can be a time, a condition, or a topic: when X, if X, or about X. " +
			"tenpo suno la mi moku means in the daytime, I eat. sina wile la sina " +
			"ken kama means if you want, you can come. The main sentence stays " +
			"exactly as it was. la just says: everything before me is the " +
			"backdrop.",
		examples: [
			{
				chunks: [
					{ text: "tenpo suno", label: "the setting: “in daytime”" },
					{ text: "la", particle: true },
					{ text: "mi moku", label: "the main sentence" },
				],
				en: "In the daytime, I eat.",
			},
			{
				chunks: [
					{ text: "sina wile", label: "the setting: “if you want”" },
					{ text: "la", particle: true },
					{ text: "sina ken kama", label: "the main sentence" },
				],
				en: "If you want, you can come.",
			},
		],
		check: {
			question: "Which one means “If you want, you can come”?",
			options: [
				"sina wile la, sina ken kama.",
				"sina la wile, sina ken kama.",
				"la sina wile, sina ken kama.",
			],
			answer: "sina wile la, sina ken kama.",
		},
	},
	{
		id: "anu-taso-kin",
		name: "anu / taso / kin",
		explanation:
			"Three small words that slot into a sentence without changing its " +
			"shape. anu means or, and sits between two choices: kili anu telo, " +
			"fruit or water. taso at the start of a sentence means but. Tucked in " +
			"after a word instead, it means only that one: mi taso, only me. kin " +
			"goes right after a word and adds too or even to exactly that word: " +
			"sina kin, you too.",
		examples: [
			{
				chunks: [
					{ text: "sina wile e", label: "the question" },
					{ text: "kili", label: "choice one" },
					{ text: "anu", particle: true },
					{ text: "telo", label: "choice two" },
				],
				en: "Do you want fruit or water?",
			},
			{
				chunks: [
					{ text: "taso", particle: true, label: "turns the sentence: “but…”" },
					{ text: "mi", label: "who it's about" },
					{ text: "wile lape", label: "what they want" },
				],
				en: "But I want to sleep.",
			},
			{
				chunks: [
					{ text: "sina", label: "who it's about" },
					{ text: "kin", particle: true, label: "“you too”" },
					{ text: "li", particle: true },
					{ text: "pona", label: "what's being said" },
				],
				en: "You too are good.",
			},
		],
		check: {
			question: "Which one asks “do you want water or fruit?”",
			options: [
				"sina wile e telo anu kili?",
				"sina wile e telo en kili?",
				"anu sina wile e telo kili?",
			],
			answer: "sina wile e telo anu kili?",
		},
	},
];

export const GRAMMAR_CONCEPTS_BY_ID: Record<string, GrammarConcept> =
	Object.fromEntries(GRAMMAR_CONCEPTS.map((concept) => [concept.id, concept]));
