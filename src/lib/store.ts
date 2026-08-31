import { useSyncExternalStore } from "react";
import type { WordId } from "#/data/types";
import {
	bringForward,
	createCard,
	type Grade,
	gradeCard,
	type SrsCard,
} from "./srs";

export interface ProgressState {
	cards: Partial<Record<WordId, SrsCard>>;
	/** Grammar points are scheduled too, keyed by concept id. */
	grammarCards: Partial<Record<string, SrsCard>>;
	completedLessonIds: string[];
	lastStudiedAt: string | null;
	/** ISO date of the most recent lesson finish, for one-new-lesson-a-day pacing. */
	lastLessonCompletedAt: string | null;
	currentStreak: number;
	longestStreak: number;
}

const STORAGE_KEY = "toki-pona-progress-v2";
const LEGACY_STORAGE_KEY = "toki-pona-progress-v1";
const CHANGE_EVENT = "toki-pona-store-change";

const emptyState: ProgressState = {
	cards: {},
	grammarCards: {},
	completedLessonIds: [],
	lastStudiedAt: null,
	lastLessonCompletedAt: null,
	currentStreak: 0,
	longestStreak: 0,
};

function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function yesterdayIsoDate(now: Date): string {
	const d = new Date(now);
	d.setDate(d.getDate() - 1);
	return toIsoDate(d);
}

/** Advances the streak counters at most once per calendar day. */
function nextStreak(
	state: ProgressState,
	now: Date,
): Pick<ProgressState, "currentStreak" | "longestStreak"> {
	const today = toIsoDate(now);
	if (state.lastStudiedAt === today) {
		return {
			currentStreak: state.currentStreak,
			longestStreak: state.longestStreak,
		};
	}
	const currentStreak =
		state.lastStudiedAt === yesterdayIsoDate(now) ? state.currentStreak + 1 : 1;
	return {
		currentStreak,
		longestStreak: Math.max(currentStreak, state.longestStreak),
	};
}

/** A card as the pre-learning-steps release stored it: day-granular, word-only. */
interface LegacyCard {
	wordId: string;
	easeFactor: number;
	intervalDays: number;
	repetitions: number;
	dueDate: string;
	lastReviewedAt: string | null;
}

/**
 * Carries a v1 card onto the timestamped schedule. A card that had never been
 * graded goes back to the first learning step; anything already on a day
 * interval keeps that interval and counts as graduated.
 */
function migrateCard(legacy: LegacyCard): SrsCard {
	return {
		id: legacy.wordId,
		kind: "word",
		easeFactor: legacy.easeFactor,
		intervalDays: legacy.intervalDays,
		repetitions: legacy.repetitions,
		learningStep: legacy.repetitions === 0 ? 0 : null,
		dueAt: `${legacy.dueDate}T00:00:00.000Z`,
		lastReviewedAt: legacy.lastReviewedAt
			? `${legacy.lastReviewedAt}T00:00:00.000Z`
			: null,
	};
}

function readLegacyState(): ProgressState | null {
	const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as {
			cards?: Record<string, LegacyCard>;
			completedLessonIds?: string[];
			lastStudiedAt?: string | null;
			currentStreak?: number;
			longestStreak?: number;
		};
		const cards: Partial<Record<WordId, SrsCard>> = {};
		for (const [wordId, legacy] of Object.entries(parsed.cards ?? {})) {
			if (legacy) cards[wordId as WordId] = migrateCard(legacy);
		}
		return {
			cards,
			grammarCards: {},
			completedLessonIds: parsed.completedLessonIds ?? [],
			lastStudiedAt: parsed.lastStudiedAt ?? null,
			lastLessonCompletedAt: null,
			currentStreak: parsed.currentStreak ?? 0,
			longestStreak: parsed.longestStreak ?? 0,
		};
	} catch {
		return null;
	}
}

function readState(): ProgressState {
	if (typeof window === "undefined") return emptyState;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return readLegacyState() ?? emptyState;
		const parsed = JSON.parse(raw) as Partial<ProgressState>;
		return {
			cards: parsed.cards ?? {},
			grammarCards: parsed.grammarCards ?? {},
			completedLessonIds: parsed.completedLessonIds ?? [],
			lastStudiedAt: parsed.lastStudiedAt ?? null,
			lastLessonCompletedAt: parsed.lastLessonCompletedAt ?? null,
			currentStreak: parsed.currentStreak ?? 0,
			longestStreak: parsed.longestStreak ?? 0,
		};
	} catch {
		return emptyState;
	}
}

let cache: ProgressState | undefined;
const listeners = new Set<() => void>();
let windowListenersInitialized = false;

function notifyListeners(): void {
	for (const listener of listeners) listener();
}

function writeState(next: ProgressState): void {
	cache = next;
	if (typeof window !== "undefined") {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		window.dispatchEvent(new Event(CHANGE_EVENT));
	}
	notifyListeners();
}

function ensureWindowListeners(): void {
	if (windowListenersInitialized || typeof window === "undefined") return;
	windowListenersInitialized = true;
	window.addEventListener(CHANGE_EVENT, notifyListeners);
	window.addEventListener("storage", (event) => {
		if (event.key !== null && event.key !== STORAGE_KEY) return;
		cache = readState();
		notifyListeners();
	});
}

function subscribe(callback: () => void): () => void {
	ensureWindowListeners();
	listeners.add(callback);
	return () => listeners.delete(callback);
}

function getSnapshot(): ProgressState {
	if (cache === undefined) {
		cache = readState();
	}
	return cache;
}

function getServerSnapshot(): ProgressState {
	return emptyState;
}

export function useProgressState(): ProgressState {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function initializeCardsForLesson(
	wordIds: WordId[],
	conceptIds: string[],
	now: Date,
): void {
	const state = getSnapshot();
	const cards = { ...state.cards };
	const grammarCards = { ...state.grammarCards };
	let changed = false;
	for (const wordId of wordIds) {
		if (!cards[wordId]) {
			cards[wordId] = createCard(wordId, now, "word");
			changed = true;
		}
	}
	for (const conceptId of conceptIds) {
		if (!grammarCards[conceptId]) {
			grammarCards[conceptId] = createCard(conceptId, now, "grammar");
			changed = true;
		}
	}
	if (changed) {
		writeState({ ...state, cards, grammarCards });
	}
}

export function recordGrade(wordId: WordId, grade: Grade, now: Date): void {
	const state = getSnapshot();
	const existing = state.cards[wordId] ?? createCard(wordId, now, "word");
	writeState({
		...state,
		cards: { ...state.cards, [wordId]: gradeCard(existing, grade, now) },
		lastStudiedAt: toIsoDate(now),
		...nextStreak(state, now),
	});
}

export function recordGrammarGrade(
	conceptId: string,
	grade: Grade,
	now: Date,
): void {
	const state = getSnapshot();
	const existing =
		state.grammarCards[conceptId] ?? createCard(conceptId, now, "grammar");
	writeState({
		...state,
		grammarCards: {
			...state.grammarCards,
			[conceptId]: gradeCard(existing, grade, now),
		},
		lastStudiedAt: toIsoDate(now),
		...nextStreak(state, now),
	});
}

/**
 * Brings a set of words forward into today's review queue. Reading a passage
 * and revealing a word is a signal that the word is weak, so it feeds the SRS
 * — but as a reschedule, never as a failed grade.
 */
export function scheduleForReview(wordIds: WordId[], now: Date): void {
	const state = getSnapshot();
	const cards = { ...state.cards };
	let changed = false;
	for (const wordId of wordIds) {
		const existing = cards[wordId];
		if (!existing) continue;
		const next = bringForward(existing, now);
		if (next !== existing) {
			cards[wordId] = next;
			changed = true;
		}
	}
	if (changed) {
		writeState({ ...state, cards });
	}
}

/** Credits a study day for activity that isn't a graded card, such as reading. */
export function recordStudyActivity(now: Date): void {
	const state = getSnapshot();
	if (state.lastStudiedAt === toIsoDate(now)) return;
	writeState({
		...state,
		lastStudiedAt: toIsoDate(now),
		...nextStreak(state, now),
	});
}

export function markLessonComplete(lessonId: string, now: Date): void {
	const state = getSnapshot();
	if (state.completedLessonIds.includes(lessonId)) return;
	writeState({
		...state,
		completedLessonIds: [...state.completedLessonIds, lessonId],
		lastStudiedAt: toIsoDate(now),
		lastLessonCompletedAt: toIsoDate(now),
		...nextStreak(state, now),
	});
}
