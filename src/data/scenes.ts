import type { Scene } from "./types";

// Metadata only — the actual SVG illustration is looked up client-side via
// src/components/scenes/registry.ts, keyed by svgKey. Loader-returned data
// must stay plain/serializable, so JSX never lives here.
//
// allowedWordIds is the word bank offered alongside the picture: a nudge
// toward words that fit this scene. It is not the validation boundary — a
// sentence is checked against everything the course has taught so far, so
// reaching for an earlier word is never punished.
export const SCENES: Scene[] = [
	{
		id: "drinking-water",
		title: "A person drinking water",
		svgKey: "drinking-water",
		allowedWordIds: ["jan", "moku", "telo", "li", "e", "pona", "mi", "sina"],
		referenceSentences: ["jan li moku e telo.", "telo li pona."],
	},
	{
		id: "i-eat-you-drink",
		title: "I eat, you drink",
		svgKey: "i-eat-you-drink",
		allowedWordIds: ["mi", "sina", "moku", "telo", "e"],
		referenceSentences: ["mi moku e moku.", "sina moku e telo."],
	},
	{
		id: "big-small",
		title: "A big person and a small person",
		svgKey: "big-small",
		allowedWordIds: ["jan", "suli", "lili", "li", "pona", "moku"],
		referenceSentences: ["jan suli li pona.", "jan lili li moku."],
	},
	{
		id: "small-animal",
		title: "A small animal beside a person",
		svgKey: "small-animal",
		allowedWordIds: ["soweli", "lili", "suli", "mute", "li", "pona", "moku"],
		referenceSentences: ["soweli lili li pona.", "soweli mute li moku."],
	},
	{
		id: "wants-to-eat",
		title: "A person reaching for food",
		svgKey: "wants-to-eat",
		allowedWordIds: ["jan", "wile", "moku", "telo", "li", "e", "pona"],
		referenceSentences: ["jan li wile moku.", "jan li wile moku e telo."],
	},
	{
		id: "person-and-animal",
		title: "A person and an animal together",
		svgKey: "person-and-animal",
		allowedWordIds: ["jan", "soweli", "en", "li", "pona", "suli", "lili"],
		referenceSentences: ["jan en soweli li pona.", "soweli li suli."],
	},
	{
		id: "not-eating",
		title: "A person turning food down",
		svgKey: "not-eating",
		allowedWordIds: ["jan", "li", "moku", "ala", "wile", "e", "telo"],
		referenceSentences: ["jan li moku ala.", "jan li wile ala moku."],
	},
	{
		id: "asking-good",
		title: "Asking whether the food is any good",
		svgKey: "asking-good",
		allowedWordIds: ["telo", "moku", "li", "pona", "ala", "ike", "ni"],
		referenceSentences: ["telo li pona ala pona?", "moku li pona ala."],
	},
	{
		id: "good-looking-person",
		title: "A good-looking person",
		svgKey: "good-looking-person",
		allowedWordIds: ["jan", "pi", "pona", "lukin", "li"],
		referenceSentences: ["jan pi pona lukin li pona."],
	},
	{
		id: "crowded-house",
		title: "A house full of people",
		svgKey: "crowded-house",
		allowedWordIds: ["tomo", "pi", "jan", "mute", "li", "suli"],
		referenceSentences: ["tomo pi jan mute li suli.", "tomo li suli."],
	},
	{
		id: "come-here",
		title: "Waving someone over",
		svgKey: "come-here",
		allowedWordIds: ["sina", "jan", "o", "kama"],
		referenceSentences: ["sina o kama.", "jan o kama."],
	},
	{
		id: "give-food",
		title: "Handing someone food",
		svgKey: "give-food",
		allowedWordIds: ["sina", "o", "pana", "e", "moku", "telo"],
		referenceSentences: ["sina o pana e moku.", "sina o pana e telo."],
	},
	{
		id: "at-home",
		title: "A person at home",
		svgKey: "at-home",
		allowedWordIds: ["mi", "jan", "lon", "tomo", "li"],
		referenceSentences: ["mi lon tomo.", "jan li lon tomo."],
	},
	{
		id: "going-to",
		title: "A person walking toward a house",
		svgKey: "going-to",
		allowedWordIds: ["mi", "jan", "tawa", "tomo", "li"],
		referenceSentences: ["mi tawa tomo.", "jan li tawa tomo."],
	},
	{
		id: "strange-drink",
		title: "A person drinking something strange",
		svgKey: "strange-drink",
		allowedWordIds: ["jan", "moku", "telo", "nasa", "ike", "li", "e", "ilo"],
		referenceSentences: ["jan li moku e telo nasa.", "telo nasa li ike."],
	},
];

export const SCENES_BY_ID: Record<string, Scene> = Object.fromEntries(
	SCENES.map((scene) => [scene.id, scene]),
);
