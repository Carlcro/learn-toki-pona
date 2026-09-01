import { describe, expect, it } from "vitest";
import { GRAMMAR_CONCEPTS } from "#/data/grammar";
import { LESSONS, selectVocabularyThroughLesson } from "#/data/lessons";
import { SENSE_ITEMS } from "#/data/senses";
import { WORDS_BY_ID } from "#/data/words";
import { tokenize } from "./grammar-validator";

// Every sentence a lesson shows is a sentence the learner is implicitly asked
// to read. These checks pin the whole curriculum to one rule: nothing shown at
// lesson N may use a word first taught at lesson N+1 — the bug class that had
// lesson 1 saying "jan li suli" a lesson before suli existed.

function lessonTeachingWord(wordId: string) {
	return LESSONS.find((lesson) =>
		(lesson.wordIds as string[]).includes(wordId),
	);
}

function lessonTeachingConcept(conceptId: string) {
	return LESSONS.find((lesson) => lesson.grammarConceptIds.includes(conceptId));
}

describe("curriculum sequencing", () => {
	it("keeps every word's example inside vocabulary taught by its lesson", () => {
		const violations: string[] = [];
		for (const lesson of LESSONS) {
			const vocabulary = selectVocabularyThroughLesson(lesson.id);
			for (const wordId of lesson.wordIds) {
				const word = WORDS_BY_ID[wordId];
				for (const token of tokenize(word.example.toki)) {
					if (!vocabulary.has(token)) {
						violations.push(
							`lesson ${lesson.id} "${wordId}": "${word.example.toki}" uses untaught "${token}"`,
						);
					}
				}
			}
		}
		expect(violations).toEqual([]);
	});

	it("keeps every sense item inside vocabulary taught by its word's lesson", () => {
		const violations: string[] = [];
		for (const item of SENSE_ITEMS) {
			const lesson = lessonTeachingWord(item.wordId);
			expect(
				lesson,
				`sense item "${item.id}" asks about an untaught word`,
			).toBeDefined();
			if (!lesson) continue;
			const vocabulary = selectVocabularyThroughLesson(lesson.id);
			for (const token of tokenize(item.sentence)) {
				if (!vocabulary.has(token)) {
					violations.push(
						`lesson ${lesson.id} "${item.id}": "${item.sentence}" uses untaught "${token}"`,
					);
				}
			}
		}
		expect(violations).toEqual([]);
	});

	it("keeps every grammar example and check inside vocabulary taught by its lesson", () => {
		const violations: string[] = [];
		for (const concept of GRAMMAR_CONCEPTS) {
			const lesson = lessonTeachingConcept(concept.id);
			expect(lesson, `concept "${concept.id}" is never taught`).toBeDefined();
			if (!lesson) continue;
			const vocabulary = selectVocabularyThroughLesson(lesson.id);
			const texts = [
				...concept.examples.flatMap((example) =>
					example.chunks.map((chunk) => chunk.text),
				),
				...concept.check.options,
			];
			for (const text of texts) {
				for (const token of tokenize(text)) {
					if (!vocabulary.has(token)) {
						violations.push(
							`lesson ${lesson.id} "${concept.id}": "${text}" uses untaught "${token}"`,
						);
					}
				}
			}
		}
		expect(violations).toEqual([]);
	});
});
