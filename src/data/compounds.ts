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
	{
		id: "car",
		lessonId: "8",
		en: "a car",
		literal: "moving structure",
		answer: ["tomo", "tawa"],
	},
	{
		id: "family",
		lessonId: "9",
		en: "a family",
		literal: "parent group",
		answer: ["kulupu", "mama"],
	},
	{
		id: "pet",
		lessonId: "10",
		en: "a pet",
		literal: "house animal",
		answer: ["soweli", "tomo"],
	},
	{
		id: "tears",
		lessonId: "11",
		en: "tears",
		literal: "eye water",
		answer: ["telo", "oko"],
	},
	{
		id: "blood",
		lessonId: "12",
		en: "blood",
		literal: "red liquid",
		answer: ["telo", "loje"],
	},
	{
		id: "lamp",
		lessonId: "14",
		en: "a lamp",
		literal: "light tool",
		answer: ["ilo", "suno"],
	},
	{
		id: "fridge",
		lessonId: "15",
		en: "a fridge",
		literal: "cold container",
		answer: ["poki", "lete"],
	},
	{
		id: "juice",
		lessonId: "16",
		en: "juice",
		literal: "fruit liquid",
		answer: ["telo", "kili"],
	},
	{
		id: "restaurant",
		lessonId: "16",
		en: "a restaurant",
		literal: "eating house",
		answer: ["tomo", "moku"],
	},
	{
		id: "clock",
		lessonId: "17",
		en: "a clock",
		literal: "time tool",
		answer: ["ilo", "tenpo"],
	},
	{
		id: "key",
		lessonId: "17",
		en: "a key",
		literal: "opening tool",
		answer: ["ilo", "open"],
	},
	{
		id: "shop",
		lessonId: "18",
		en: "a shop",
		literal: "trading building",
		answer: ["tomo", "esun"],
	},
	{
		id: "book",
		lessonId: "19",
		en: "a book (of facts)",
		literal: "knowledge document",
		answer: ["lipu", "sona"],
	},
	{
		id: "knife",
		lessonId: "21",
		en: "a knife",
		literal: "cutting tool",
		answer: ["ilo", "kipisi"],
	},
	{
		id: "year",
		lessonId: "23",
		en: "a year",
		literal: "round time — time that loops",
		answer: ["tenpo", "sike"],
	},
	{
		id: "doctor",
		lessonId: "24",
		en: "a doctor",
		literal: "medicine person",
		answer: ["jan", "misikeke"],
	},
];

export function selectCompoundsForLesson(lessonId: string): Compound[] {
	return COMPOUNDS.filter((compound) => compound.lessonId === lessonId);
}
