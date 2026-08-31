import type { Word, WordId } from "./types";

// Canonical Toki Pona (pu) vocabulary — glosses sourced from the standard
// Toki Pona Dictionary, no invented/fan words.
//
// Toki Pona's full canonical vocabulary is 137 words. This course does not
// teach all of them yet, so progress is measured against what is actually
// built (COURSE_WORD_COUNT) and the full figure is shown only as context.
export const FULL_LANGUAGE_WORD_COUNT = 137;

export const WORDS: Word[] = [
	{
		id: "mi",
		toki: "mi",
		gloss: "I / me / we / us",
		definition: "I, me, we, us; my, our (as a modifier).",
		role: "pronoun",
		example: { toki: "mi moku e telo.", en: "I drink water." },
	},
	{
		id: "sina",
		toki: "sina",
		gloss: "you",
		definition: "You (singular or plural); your (as a modifier).",
		role: "pronoun",
		example: { toki: "sina pona.", en: "You are good." },
	},
	{
		id: "li",
		toki: "li",
		gloss: "predicate marker",
		definition:
			"Introduces the predicate. Omitted only when the subject is a bare mi or sina.",
		role: "particle",
		example: { toki: "jan li moku.", en: "The person eats." },
	},
	{
		id: "e",
		toki: "e",
		gloss: "direct-object marker",
		definition: "Introduces the direct object of the predicate.",
		role: "particle",
		example: { toki: "sina moku e telo.", en: "You drink water." },
	},
	{
		id: "jan",
		toki: "jan",
		gloss: "person",
		definition: "Person, human being, somebody.",
		role: "content",
		example: { toki: "jan li suli.", en: "The person is important." },
	},
	{
		id: "moku",
		toki: "moku",
		gloss: "food; to eat/drink",
		definition: "Food, meal; to eat, drink, consume, ingest.",
		role: "content",
		example: { toki: "mi moku e moku.", en: "I eat food." },
	},
	{
		id: "telo",
		toki: "telo",
		gloss: "water, liquid",
		definition: "Water, liquid, wet substance, juice; to wash, to water.",
		role: "content",
		example: { toki: "telo li pona.", en: "The water is good." },
	},
	{
		id: "pona",
		toki: "pona",
		gloss: "good, simple",
		definition: "Good, simple, positive; to fix, improve, simplify.",
		role: "content",
		example: { toki: "mi pona.", en: "I'm good." },
	},
	{
		id: "suli",
		toki: "suli",
		gloss: "big, important",
		definition: "Big, tall, long, adult, important.",
		role: "content",
		example: { toki: "mi suli.", en: "I'm important." },
	},
	{
		id: "lili",
		toki: "lili",
		gloss: "small, young",
		definition: "Small, little, young, a bit, few.",
		role: "content",
		example: { toki: "jan li lili.", en: "The person is young." },
	},
	{
		id: "mute",
		toki: "mute",
		gloss: "many, very",
		definition: "Many, several, a lot, very; quantity, amount.",
		role: "content",
		example: { toki: "jan mute li pona.", en: "The many people are good." },
	},
	{
		id: "ni",
		toki: "ni",
		gloss: "this, that",
		definition:
			"This, that (demonstrative) — points at something in or near the sentence.",
		role: "pronoun",
		example: { toki: "ni li pona.", en: "This is good." },
	},
	{
		id: "soweli",
		toki: "soweli",
		gloss: "animal",
		definition: "Land animal, especially a four-legged one; creature, beast.",
		role: "content",
		example: { toki: "soweli li suli.", en: "The animal is big." },
	},
	{
		id: "ona",
		toki: "ona",
		gloss: "he / she / it / they",
		definition:
			"He, she, it, they (third person, any number); his, her, its, their (as a modifier).",
		role: "pronoun",
		example: { toki: "ona li pona.", en: "They are good." },
	},
	{
		id: "en",
		toki: "en",
		gloss: "and (joining subjects)",
		definition:
			"Joins two or more subjects into a single group before li. Not used to join anything other than subjects.",
		role: "particle",
		example: {
			toki: "jan en soweli li pona.",
			en: "The person and the animal are good.",
		},
	},
	{
		id: "wile",
		toki: "wile",
		gloss: "want, need, must",
		definition:
			"To want, need, wish, have to; placed before another verb to modify it.",
		role: "content",
		example: { toki: "mi wile moku.", en: "I want to eat." },
	},
	{
		id: "ken",
		toki: "ken",
		gloss: "can, may",
		definition:
			"To be able to, be allowed to, be possible; placed before another verb to modify it.",
		role: "content",
		example: { toki: "sina ken moku e telo.", en: "You can drink water." },
	},
	{
		id: "sona",
		toki: "sona",
		gloss: "know, know how to",
		definition:
			"Knowledge; to know, understand, know how to; placed before another verb to modify it.",
		role: "content",
		example: {
			toki: "jan li sona toki.",
			en: "The person knows how to talk.",
		},
	},
	{
		id: "toki",
		toki: "toki",
		gloss: "language, talk",
		definition:
			"Language, speech, communication; to speak, talk, communicate. Also a greeting.",
		role: "content",
		example: { toki: "mi toki.", en: "I talk." },
	},
	{
		id: "ala",
		toki: "ala",
		gloss: "not, no, zero",
		definition:
			"Not, none, zero. Negates the word directly in front of it, and doubles a verb to ask a yes/no question.",
		role: "content",
		example: { toki: "mi moku ala.", en: "I'm not eating." },
	},
	{
		id: "pilin",
		toki: "pilin",
		gloss: "feel, feeling",
		definition: "Heart, feeling, emotion; to feel, think, sense, touch.",
		role: "content",
		example: { toki: "mi pilin pona.", en: "I feel good." },
	},
	{
		id: "ike",
		toki: "ike",
		gloss: "bad, negative",
		definition: "Bad, negative, unpleasant, wrong; to be bad, harm.",
		role: "content",
		example: { toki: "ni li ike.", en: "This is bad." },
	},
	{
		id: "seme",
		toki: "seme",
		gloss: "what, which, who",
		definition:
			"Question word — stands in for the unknown part of a sentence. sina wile e seme? (What do you want?)",
		role: "pronoun",
		example: { toki: "sina wile e seme?", en: "What do you want?" },
	},
	{
		id: "pi",
		toki: "pi",
		gloss: "of (groups a modifier phrase)",
		definition:
			"Groups the words that follow into a single modifier phrase for the noun before it, instead of each word modifying in a chain.",
		role: "particle",
		example: {
			toki: "jan pi pona lukin li pona.",
			en: "The good-looking person is good.",
		},
	},
	{
		id: "tomo",
		toki: "tomo",
		gloss: "house, building",
		definition: "House, building, room, home, structure; indoor space.",
		role: "content",
		example: { toki: "tomo li suli.", en: "The house is big." },
	},
	{
		id: "ma",
		toki: "ma",
		gloss: "land, place",
		definition: "Land, earth, ground, country, world, outdoor area.",
		role: "content",
		example: { toki: "mi lukin e ma.", en: "I look at the land." },
	},
	{
		id: "lukin",
		toki: "lukin",
		gloss: "see, look, appearance",
		definition: "To see, look, watch; sight, appearance, visible.",
		role: "content",
		example: { toki: "mi wile lukin e ni.", en: "I want to look at this." },
	},
	{
		id: "o",
		toki: "o",
		gloss: "command marker",
		definition:
			"Marks a command, request, or suggestion in place of li. Works with any subject (or none) and, unlike li, is never dropped.",
		role: "particle",
		example: { toki: "sina o pona.", en: "Be good!" },
	},
	{
		id: "pana",
		toki: "pana",
		gloss: "give, put, send",
		definition: "To give, put, place, send, emit, release, cause.",
		role: "content",
		example: { toki: "sina o pana e moku.", en: "Give the food!" },
	},
	{
		id: "kama",
		toki: "kama",
		gloss: "come, become",
		definition: "To come, arrive, become, happen; an event, arrival.",
		role: "content",
		example: { toki: "sina o kama.", en: "Come here!" },
	},
	{
		id: "lon",
		toki: "lon",
		gloss: "at, in, on, real",
		definition: "At, in, on, present; to exist, be real, be true.",
		role: "content",
		example: { toki: "mi lon tomo.", en: "I'm at the house." },
	},
	{
		id: "tawa",
		toki: "tawa",
		gloss: "to, toward; go, move",
		definition: "To, toward, for; to go, move, travel.",
		role: "content",
		example: { toki: "mi tawa tomo.", en: "I'm going to the house." },
	},
	{
		id: "kepeken",
		toki: "kepeken",
		gloss: "using, with",
		definition: "Using, with (a tool or method); to use.",
		role: "content",
		example: {
			toki: "mi toki kepeken toki pona.",
			en: "I speak using Toki Pona.",
		},
	},
	{
		id: "tan",
		toki: "tan",
		gloss: "from, because",
		definition: "From, because of, since; cause, origin, reason.",
		role: "content",
		example: { toki: "mi kama tan tomo.", en: "I come from the house." },
	},
	{
		id: "sama",
		toki: "sama",
		gloss: "same, like",
		definition: "Same, similar, equal; as, like, together with.",
		role: "content",
		example: { toki: "ona li sama mi.", en: "They're like me." },
	},
	{
		id: "ilo",
		toki: "ilo",
		gloss: "tool, device",
		definition:
			"Tool, device, machine, instrument; anything used to get something done.",
		role: "content",
		example: { toki: "ilo li pona.", en: "The tool is good." },
	},
	{
		id: "nasa",
		toki: "nasa",
		gloss: "strange, silly",
		definition:
			"Strange, unusual, odd, silly, foolish; drunk, intoxicated; to confuse.",
		role: "content",
		example: { toki: "jan ni li nasa.", en: "That person is strange." },
	},
	{
		id: "ijo",
		toki: "ijo",
		gloss: "thing",
		definition: "Thing, object, matter, phenomenon; something, anything.",
		role: "content",
		example: { toki: "ijo ni li seme?", en: "What is this thing?" },
	},
];

export const COURSE_WORD_COUNT = WORDS.length;

export const WORDS_BY_ID: Record<WordId, Word> = Object.fromEntries(
	WORDS.map((word) => [word.id, word]),
) as Record<WordId, Word>;
