import type { Lesson, WordId } from "#/data/types";
import { isDue, MATURE_INTERVAL_DAYS, type SrsCard } from "./srs";

/**
 * A word counts as learned the moment it survives its first graded answer, not
 * when it graduates off the learning steps. Anything stricter would leave the
 * home screen and the library reading zero right after a finished lesson,
 * which is exactly when the learner has earned the opposite.
 */
export function hasBeenGraded(card: SrsCard): boolean {
	return card.lastReviewedAt !== null;
}

function presentCards(cards: Partial<Record<string, SrsCard>>): SrsCard[] {
	return Object.values(cards).filter(
		(card): card is SrsCard => card !== undefined,
	);
}

export function selectWordsLearnedCount(
	cards: Partial<Record<WordId, SrsCard>>,
): number {
	return presentCards(cards).filter(hasBeenGraded).length;
}

/**
 * Everything due right now, words and grammar together, soonest first. One
 * queue rather than two so grammar is genuinely revisited instead of being
 * credited once at lesson end and never checked again.
 */
export function selectReviewQueue(
	cards: Partial<Record<WordId, SrsCard>>,
	grammarCards: Partial<Record<string, SrsCard>>,
	now: Date,
): SrsCard[] {
	return [...presentCards(cards), ...presentCards(grammarCards)]
		.filter((card) => isDue(card, now))
		.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/** The soonest moment anything comes back, or null if nothing is scheduled. */
export function selectNextDueAt(
	cards: Partial<Record<WordId, SrsCard>>,
	grammarCards: Partial<Record<string, SrsCard>>,
	now: Date,
): string | null {
	const upcoming = [...presentCards(cards), ...presentCards(grammarCards)]
		.filter((card) => !isDue(card, now))
		.map((card) => card.dueAt)
		.sort();
	return upcoming[0] ?? null;
}

export interface MasteryBreakdown {
	new: number;
	learning: number;
	mature: number;
}

/**
 * Classifies cards by SRS progress: never answered (new), answered but still on
 * short intervals (learning), or out past the mature interval (mature).
 */
export function selectMasteryBreakdown(
	cards: Partial<Record<WordId, SrsCard>>,
): MasteryBreakdown {
	const breakdown: MasteryBreakdown = { new: 0, learning: 0, mature: 0 };
	for (const card of presentCards(cards)) {
		if (!hasBeenGraded(card)) breakdown.new++;
		else if (card.intervalDays >= MATURE_INTERVAL_DAYS) breakdown.mature++;
		else breakdown.learning++;
	}
	return breakdown;
}

export function selectNextLessonId(
	completedLessonIds: string[],
	lessons: Lesson[],
): string | null {
	const next = lessons.find(
		(lesson) => !completedLessonIds.includes(lesson.id),
	);
	return next?.id ?? null;
}

export type LessonStatus = "completed" | "current" | "locked";

export interface LessonProgress {
	lesson: Lesson;
	status: LessonStatus;
}

/** Lessons unlock in sequence: the first not-yet-completed lesson is "current", the rest are "locked". */
export function selectLessonProgress(
	completedLessonIds: string[],
	lessons: Lesson[],
): LessonProgress[] {
	let unlocked = true;
	return lessons.map((lesson) => {
		if (completedLessonIds.includes(lesson.id)) {
			return { lesson, status: "completed" as const };
		}
		if (unlocked) {
			unlocked = false;
			return { lesson, status: "current" as const };
		}
		return { lesson, status: "locked" as const };
	});
}

/**
 * What the learner should do next.
 *
 * Reviews outrank new material — they are the part that decays — and at most
 * one new lesson is offered per day, because a course crammed in one evening is
 * a course forgotten by the weekend. "rest" is a suggestion, never a lock: the
 * caller still offers the next lesson, just not as the loud button.
 */
export type DailyPlan =
	| { kind: "first-lesson"; lessonId: string }
	| { kind: "lesson"; lessonId: string }
	| { kind: "review"; dueCount: number }
	| { kind: "rest"; nextLessonId: string | null; nextDueAt: string | null }
	| { kind: "course-complete"; nextDueAt: string | null };

export function selectDailyPlan(args: {
	cards: Partial<Record<WordId, SrsCard>>;
	grammarCards: Partial<Record<string, SrsCard>>;
	completedLessonIds: string[];
	lastLessonCompletedAt: string | null;
	lessons: Lesson[];
	now: Date;
}): DailyPlan {
	const { cards, grammarCards, completedLessonIds, lessons, now } = args;
	const dueCount = selectReviewQueue(cards, grammarCards, now).length;
	if (dueCount > 0) return { kind: "review", dueCount };

	const nextDueAt = selectNextDueAt(cards, grammarCards, now);
	const nextLessonId = selectNextLessonId(completedLessonIds, lessons);
	if (nextLessonId === null) return { kind: "course-complete", nextDueAt };

	const today = now.toISOString().slice(0, 10);
	if (args.lastLessonCompletedAt === today) {
		return { kind: "rest", nextLessonId, nextDueAt };
	}

	return completedLessonIds.length === 0
		? { kind: "first-lesson", lessonId: nextLessonId }
		: { kind: "lesson", lessonId: nextLessonId };
}

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** "in 9 minutes", "in 3 hours", "tomorrow", "in 5 days" — never a bare timestamp. */
export function describeTimeUntil(isoTimestamp: string, now: Date): string {
	const ms = new Date(isoTimestamp).getTime() - now.getTime();
	if (ms <= 0) return "now";
	if (ms < HOUR_MS) {
		const minutes = Math.max(1, Math.round(ms / MINUTE_MS));
		return `in ${minutes} minute${minutes === 1 ? "" : "s"}`;
	}
	if (ms < DAY_MS) {
		const hours = Math.round(ms / HOUR_MS);
		return `in ${hours} hour${hours === 1 ? "" : "s"}`;
	}
	const days = Math.round(ms / DAY_MS);
	return days === 1 ? "tomorrow" : `in ${days} days`;
}
