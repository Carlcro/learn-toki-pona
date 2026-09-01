import type { Dialogue } from "./types";

// Conversation is where the grammar stops being facts and becomes reflexes:
// the ala-question sandwich only matters when someone asks you one, and the
// dropped-li rule only becomes automatic when you answer as mi. Each dialogue
// slots into a lesson and uses only vocabulary taught by then. App lines may
// be idiomatic fragments ("toki!", "pona mute!"); learner-turn references are
// full sentences unless the turn carries `accepted` bare-answer forms.
export const DIALOGUES: Dialogue[] = [
	{
		id: "greeting-feelings",
		lessonId: "4",
		title: "Meeting a friend",
		turns: [
			{ speaker: "app", toki: "toki!", en: "Hello!" },
			{
				speaker: "learner",
				prompt: "Greet them back.",
				mustInclude: ["toki"],
				accepted: ["toki"],
				references: ["toki!"],
			},
			{ speaker: "app", toki: "sina pilin seme?", en: "How are you feeling?" },
			{
				speaker: "learner",
				prompt: "Tell them how you feel.",
				mustInclude: ["pilin"],
				references: ["mi pilin pona.", "mi pilin ike."],
				hintWordIds: ["mi", "pilin", "pona", "ike"],
			},
			{
				speaker: "app",
				toki: "sina wile ala wile moku?",
				en: "Do you want to eat?",
			},
			{
				speaker: "learner",
				prompt:
					"Answer yes or no — the toki pona way is to answer with the verb.",
				mustInclude: ["wile"],
				accepted: ["wile", "wile ala"],
				references: ["wile.", "wile ala."],
				hintWordIds: ["wile", "ala"],
			},
		],
	},
	{
		id: "come-and-give",
		lessonId: "6",
		title: "Being asked over",
		turns: [
			{
				speaker: "app",
				toki: "o kama! mi wile toki.",
				en: "Come! I want to talk.",
			},
			{
				speaker: "learner",
				prompt: "Tell them you're coming.",
				mustInclude: ["kama"],
				references: ["mi kama."],
				hintWordIds: ["mi", "kama"],
			},
			{
				speaker: "app",
				toki: "mi wile moku. o pana e moku.",
				en: "I'm hungry. Give me the food.",
			},
			{
				speaker: "learner",
				prompt: "Say that you're giving them the food.",
				mustInclude: ["pana"],
				references: ["mi pana e moku."],
				hintWordIds: ["mi", "pana", "e", "moku"],
			},
			{
				speaker: "app",
				toki: "pona mute! sina jan pona.",
				en: "Great! You're a friend.",
			},
		],
	},
	{
		id: "where-are-you",
		lessonId: "7",
		title: "Where are you?",
		turns: [
			{ speaker: "app", toki: "sina lon seme?", en: "Where are you?" },
			{
				speaker: "learner",
				prompt: "Say where you are.",
				mustInclude: ["lon"],
				references: ["mi lon tomo.", "mi lon ma."],
				hintWordIds: ["mi", "lon", "tomo", "ma"],
			},
			{ speaker: "app", toki: "sina tawa seme?", en: "Where are you going?" },
			{
				speaker: "learner",
				prompt: "Say where you're going.",
				mustInclude: ["tawa"],
				references: ["mi tawa tomo.", "mi tawa ma."],
				hintWordIds: ["mi", "tawa", "tomo", "ma"],
			},
			{
				speaker: "app",
				toki: "pona. o kama tawa tomo mi!",
				en: "Nice. Come to my house!",
			},
			{
				speaker: "learner",
				prompt: "Agree — say you're coming to their house.",
				mustInclude: ["kama"],
				references: ["mi kama.", "mi kama tawa tomo sina."],
				hintWordIds: ["mi", "kama", "tawa", "tomo", "sina"],
			},
		],
	},
	{
		id: "family-talk",
		lessonId: "9",
		title: "Talking about family",
		turns: [
			{ speaker: "app", toki: "jan ni li seme?", en: "Who is this?" },
			{
				speaker: "learner",
				prompt: "Say this person is your parent.",
				mustInclude: ["mama"],
				references: ["ona li mama mi.", "jan ni li mama mi."],
				hintWordIds: ["ona", "jan", "ni", "li", "mama", "mi"],
			},
			{
				speaker: "app",
				toki: "pona! sina olin ala olin e mama sina?",
				en: "Nice! Do you love your parent?",
			},
			{
				speaker: "learner",
				prompt: "Answer with the verb — yes or no.",
				mustInclude: ["olin"],
				accepted: ["olin", "olin ala"],
				references: ["olin.", "mi olin e ona."],
				hintWordIds: ["olin", "ala", "mi", "e", "ona"],
			},
			{
				speaker: "app",
				toki: "kulupu mama li pona tawa mi.",
				en: "Family is dear to me.",
			},
		],
	},
];

export function selectDialoguesForLesson(lessonId: string): Dialogue[] {
	return DIALOGUES.filter((dialogue) => dialogue.lessonId === lessonId);
}
