import type { Lesson, LibraryItem, WordId } from "#/data/types";
import { tokenize } from "./grammar-validator";
import { hasBeenGraded } from "./progress";
import type { SrsCard } from "./srs";

/**
 * A word counts as known once it has survived at least one graded answer —
 * the same bar `selectWordsLearnedCount` uses, so the library never claims a
 * learner can read a word the home screen hasn't credited them with.
 */
export function selectKnownWordIds(
	cards: Partial<Record<WordId, SrsCard>>,
): Set<string> {
	const known = new Set<string>();
	for (const card of Object.values(cards)) {
		if (card && hasBeenGraded(card)) known.add(card.id);
	}
	return known;
}

/** Grammar is credited per completed lesson, not per word. */
export function selectKnownConceptIds(
	completedLessonIds: string[],
	lessons: Lesson[],
): Set<string> {
	const known = new Set<string>();
	for (const lesson of lessons) {
		if (!completedLessonIds.includes(lesson.id)) continue;
		for (const conceptId of lesson.grammarConceptIds) known.add(conceptId);
	}
	return known;
}

/**
 * The vocabulary a piece actually requires, read off its own text in order of
 * first appearance. An unknown token stays in the list rather than being
 * dropped, so a typo locks the piece instead of silently unlocking it.
 */
export function selectItemWordIds(item: LibraryItem): string[] {
	const seen = new Set<string>();
	const ordered: string[] = [];
	for (const line of item.lines) {
		for (const token of tokenize(line.toki)) {
			if (seen.has(token)) continue;
			seen.add(token);
			ordered.push(token);
		}
	}
	return ordered;
}

export interface ItemStatus {
	item: LibraryItem;
	readable: boolean;
	missingWordIds: string[];
	missingConceptIds: string[];
}

/** A piece is readable only when every word and every grammar point behind it is already known. */
export function selectItemStatus(
	item: LibraryItem,
	knownWordIds: Set<string>,
	knownConceptIds: Set<string>,
): ItemStatus {
	const missingWordIds = selectItemWordIds(item).filter(
		(wordId) => !knownWordIds.has(wordId),
	);
	const missingConceptIds = item.grammarConceptIds.filter(
		(conceptId) => !knownConceptIds.has(conceptId),
	);
	return {
		item,
		readable: missingWordIds.length === 0 && missingConceptIds.length === 0,
		missingWordIds,
		missingConceptIds,
	};
}

export function selectLibraryStatuses(
	items: LibraryItem[],
	knownWordIds: Set<string>,
	knownConceptIds: Set<string>,
): ItemStatus[] {
	return items.map((item) =>
		selectItemStatus(item, knownWordIds, knownConceptIds),
	);
}

export interface LibraryProgress {
	readable: number;
	total: number;
	percent: number;
}

export function selectLibraryProgress(statuses: ItemStatus[]): LibraryProgress {
	const readable = statuses.filter((status) => status.readable).length;
	const total = statuses.length;
	return {
		readable,
		total,
		percent: total === 0 ? 0 : Math.round((readable / total) * 100),
	};
}

/**
 * How many pieces a just-finished lesson opened up, worked out by asking what
 * would still be readable without that lesson's words and grammar.
 *
 * Derived entirely from present state rather than a count captured when the
 * lesson began: progress lives in localStorage, so anything snapshotted on
 * mount is captured from the empty server-side state during hydration.
 */
export function selectUnlockedByLesson(
	items: LibraryItem[],
	knownWordIds: Set<string>,
	knownConceptIds: Set<string>,
	lesson: Lesson,
): number {
	const withoutLesson = new Set(knownWordIds);
	for (const wordId of lesson.wordIds) withoutLesson.delete(wordId);
	const conceptsWithoutLesson = new Set(knownConceptIds);
	for (const conceptId of lesson.grammarConceptIds) {
		conceptsWithoutLesson.delete(conceptId);
	}

	const after = selectLibraryProgress(
		selectLibraryStatuses(items, knownWordIds, knownConceptIds),
	).readable;
	const before = selectLibraryProgress(
		selectLibraryStatuses(items, withoutLesson, conceptsWithoutLesson),
	).readable;
	return after - before;
}

/**
 * How many further pieces finishing `lesson` would open up — the reward a
 * learner is actually working toward, stated before they start.
 */
export function selectUnlockCountForLesson(
	items: LibraryItem[],
	knownWordIds: Set<string>,
	knownConceptIds: Set<string>,
	lesson: Lesson,
): number {
	const afterWordIds = new Set(knownWordIds);
	for (const wordId of lesson.wordIds) afterWordIds.add(wordId);
	const afterConceptIds = new Set(knownConceptIds);
	for (const conceptId of lesson.grammarConceptIds) {
		afterConceptIds.add(conceptId);
	}

	let unlocked = 0;
	for (const item of items) {
		const before = selectItemStatus(item, knownWordIds, knownConceptIds);
		if (before.readable) continue;
		if (selectItemStatus(item, afterWordIds, afterConceptIds).readable) {
			unlocked++;
		}
	}
	return unlocked;
}
