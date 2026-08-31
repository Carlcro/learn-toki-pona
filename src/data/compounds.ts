import type { Compound } from "./types";

// Composition is how a 137-word language covers everything, so it gets drilled
// as its own move rather than being left to emerge from reading. Every answer
// here is built only from words taught at or before its lesson.
export const COMPOUNDS: Compound[] = [
	{
		id: "friend",
		lessonId: "2",
		en: "a friend",
		literal: "good person",
		answer: ["jan", "pona"],
	},
	{
		id: "child",
		lessonId: "2",
		en: "a child",
		literal: "small person",
		answer: ["jan", "lili"],
	},
	{
		id: "bathroom",
		lessonId: "5",
		en: "a bathroom",
		literal: "water room",
		answer: ["tomo", "telo"],
	},
	{
		id: "city",
		lessonId: "5",
		en: "a city",
		literal: "building land",
		answer: ["ma", "tomo"],
	},
	{
		id: "phone",
		lessonId: "8",
		en: "a phone",
		literal: "talking tool",
		answer: ["ilo", "toki"],
	},
	{
		id: "alcohol",
		lessonId: "8",
		en: "alcohol",
		literal: "strange liquid",
		answer: ["telo", "nasa"],
	},
	{
		id: "cutlery",
		lessonId: "8",
		en: "a fork or spoon",
		literal: "eating tool",
		answer: ["ilo", "moku"],
	},
];

export function selectCompoundsForLesson(lessonId: string): Compound[] {
	return COMPOUNDS.filter((compound) => compound.lessonId === lessonId);
}
