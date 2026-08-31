export type Grade = "again" | "good" | "easy";

/** Words and grammar points are scheduled by the same engine, on separate decks. */
export type CardKind = "word" | "grammar";

export interface SrsCard {
	id: string;
	kind: CardKind;
	easeFactor: number;
	intervalDays: number;
	repetitions: number;
	/**
	 * Position in LEARNING_STEP_MINUTES while the card is still being learned,
	 * or null once it has graduated to day-scale intervals. A graduated card
	 * that is failed drops back to step 0 rather than waiting until tomorrow.
	 */
	learningStep: number | null;
	dueAt: string; // ISO timestamp — minutes matter during learning
	lastReviewedAt: string | null; // ISO timestamp
}

/**
 * Same-session relearning. A word met once and never seen again that day is a
 * word forgotten by tomorrow, so a new card comes back after a minute and again
 * ten minutes later before it is allowed onto the day scale.
 */
export const LEARNING_STEP_MINUTES = [1, 10];

const GRADUATING_INTERVAL_DAYS = 1;
const EASY_GRADUATING_INTERVAL_DAYS = 4;
const EASY_BONUS = 1.3;
const MIN_EASE_FACTOR = 1.3;
const STARTING_EASE_FACTOR = 2.5;
export const MATURE_INTERVAL_DAYS = 21;

const GRADE_QUALITY: Record<Grade, number> = {
	again: 2,
	good: 4,
	easy: 5,
};

const MS_PER_MINUTE = 60_000;

function addMinutes(date: Date, minutes: number): string {
	return new Date(date.getTime() + minutes * MS_PER_MINUTE).toISOString();
}

function addDays(date: Date, days: number): string {
	return addMinutes(date, days * 24 * 60);
}

export function createCard(id: string, now: Date, kind: CardKind): SrsCard {
	return {
		id,
		kind,
		easeFactor: STARTING_EASE_FACTOR,
		intervalDays: 0,
		repetitions: 0,
		learningStep: 0,
		dueAt: now.toISOString(),
		lastReviewedAt: null,
	};
}

function nextEaseFactor(card: SrsCard, grade: Grade): number {
	const quality = GRADE_QUALITY[grade];
	return Math.max(
		MIN_EASE_FACTOR,
		card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
	);
}

export function gradeCard(card: SrsCard, grade: Grade, now: Date): SrsCard {
	const easeFactor = nextEaseFactor(card, grade);
	const lastReviewedAt = now.toISOString();
	const base = { ...card, easeFactor, lastReviewedAt };

	// A failed card — whether new or long-since graduated — re-enters learning
	// and comes back within the same sitting.
	if (grade === "again") {
		return {
			...base,
			repetitions: 0,
			intervalDays: 0,
			learningStep: 0,
			dueAt: addMinutes(now, LEARNING_STEP_MINUTES[0]),
		};
	}

	if (card.learningStep !== null) {
		if (grade === "easy") {
			return {
				...base,
				repetitions: 1,
				intervalDays: EASY_GRADUATING_INTERVAL_DAYS,
				learningStep: null,
				dueAt: addDays(now, EASY_GRADUATING_INTERVAL_DAYS),
			};
		}
		const nextStep = card.learningStep + 1;
		if (nextStep < LEARNING_STEP_MINUTES.length) {
			return {
				...base,
				learningStep: nextStep,
				dueAt: addMinutes(now, LEARNING_STEP_MINUTES[nextStep]),
			};
		}
		return {
			...base,
			repetitions: 1,
			intervalDays: GRADUATING_INTERVAL_DAYS,
			learningStep: null,
			dueAt: addDays(now, GRADUATING_INTERVAL_DAYS),
		};
	}

	const goodInterval = Math.max(
		card.intervalDays + 1,
		Math.round(card.intervalDays * easeFactor),
	);
	// Easy has to outrun good even at short intervals, where rounding would
	// otherwise collapse the two onto the same number and make the button a lie.
	const intervalDays =
		grade === "easy"
			? Math.max(
					goodInterval + 1,
					Math.round(card.intervalDays * easeFactor * EASY_BONUS),
				)
			: goodInterval;
	return {
		...base,
		repetitions: card.repetitions + 1,
		intervalDays,
		learningStep: null,
		dueAt: addDays(now, intervalDays),
	};
}

export function isDue(card: SrsCard, now: Date): boolean {
	return card.dueAt <= now.toISOString();
}

/** True once a card is off the learning steps and onto real day intervals. */
export function isGraduated(card: SrsCard): boolean {
	return card.learningStep === null;
}

/**
 * Pulls a card's next review forward to now without touching its ease,
 * interval, or repetition history. Used when a learner reveals a word while
 * reading: that is evidence the word is shaky, but it isn't a graded answer,
 * so it should reschedule the card rather than penalise it.
 */
export function bringForward(card: SrsCard, now: Date): SrsCard {
	if (isDue(card, now)) return card;
	return { ...card, dueAt: now.toISOString() };
}
