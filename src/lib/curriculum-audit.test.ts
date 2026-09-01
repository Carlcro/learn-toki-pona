import { describe, expect, it } from "vitest";
import { DIALOGUES } from "#/data/dialogues";
import { GRAMMAR_CONCEPTS } from "#/data/grammar";
import { LESSONS, selectVocabularyThroughLesson } from "#/data/lessons";
import { SENSE_ITEMS } from "#/data/senses";
import type { DialogueLearnerTurn } from "#/data/types";
import { WORDS, WORDS_BY_ID } from "#/data/words";
import { checkReply, splitSentences } from "./dialogue";
import { tokenize, validateLiE } from "./grammar-validator";

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

const ALL_WORDS = new Set(WORDS.map((word) => word.id as string));

/**
 * Standalone interjections ("toki!", "pona mute!") are real toki pona and no
 * sentence at all, so holding them to validateLiE would only push the content
 * towards stiffer, less natural lines. Three tokens is the length at which an
 * app line is claiming to be a sentence.
 */
const SENTENCE_MIN_TOKENS = 3;

describe("dialogue sequencing", () => {
	it("keeps every dialogue inside vocabulary taught by its lesson", () => {
		const violations: string[] = [];
		for (const dialogue of DIALOGUES) {
			const lesson = LESSONS.find((entry) => entry.id === dialogue.lessonId);
			expect(
				lesson,
				`dialogue "${dialogue.id}" names lesson "${dialogue.lessonId}", which doesn't exist`,
			).toBeDefined();
			if (!lesson) continue;
			const vocabulary = selectVocabularyThroughLesson(dialogue.lessonId);
			const report = (source: string, token: string) => {
				violations.push(
					`lesson ${lesson.id} "${dialogue.id}": ${source} uses untaught "${token}"`,
				);
			};
			for (const turn of dialogue.turns) {
				if (turn.speaker === "app") {
					for (const token of tokenize(turn.toki)) {
						if (!vocabulary.has(token)) report(`"${turn.toki}"`, token);
					}
					continue;
				}
				for (const text of [...turn.references, ...(turn.accepted ?? [])]) {
					for (const token of tokenize(text)) {
						if (!vocabulary.has(token)) report(`"${text}"`, token);
					}
				}
				for (const wordId of [
					...turn.mustInclude,
					...(turn.hintWordIds ?? []),
				]) {
					if (!vocabulary.has(wordId)) report(`the word list`, wordId);
				}
			}
		}
		expect(violations).toEqual([]);
	});

	it("keeps every line a dialogue shows well formed", () => {
		const violations: string[] = [];
		for (const dialogue of DIALOGUES) {
			for (const [index, turn] of dialogue.turns.entries()) {
				// References on a turn with `accepted` are exempt: bare-verb answers
				// are the idiomatic reply and fragments by design.
				const lines =
					turn.speaker === "app"
						? splitSentences(turn.toki).filter(
								(sentence) => tokenize(sentence).length >= SENTENCE_MIN_TOKENS,
							)
						: turn.accepted
							? []
							: turn.references.flatMap(splitSentences);
				for (const line of lines) {
					const result = validateLiE(line, ALL_WORDS);
					if (!result.valid) {
						violations.push(
							`"${dialogue.id}" turn ${index}: "${line}" is ${result.reason}`,
						);
					}
				}
			}
		}
		expect(violations).toEqual([]);
	});

	it("shows the learner only replies that pass the turn's own check", () => {
		const violations: string[] = [];
		for (const dialogue of DIALOGUES) {
			const vocabulary = selectVocabularyThroughLesson(dialogue.lessonId);
			const learnerTurns = dialogue.turns.filter(
				(turn): turn is DialogueLearnerTurn => turn.speaker === "learner",
			);
			for (const [index, turn] of learnerTurns.entries()) {
				for (const reference of turn.references) {
					const result = checkReply(turn, reference, vocabulary);
					if (!result.ok) {
						violations.push(
							`"${dialogue.id}" reply ${index}: "${reference}" fails its own turn with ${result.reason}`,
						);
					}
				}
			}
		}
		expect(violations).toEqual([]);
	});
});
