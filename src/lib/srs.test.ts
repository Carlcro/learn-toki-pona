import { describe, expect, it } from "vitest";
import {
	bringForward,
	createCard,
	gradeCard,
	isDue,
	isGraduated,
	LEARNING_STEP_MINUTES,
} from "./srs";

const DAY1 = new Date("2026-01-01T09:00:00.000Z");

function minutesAfter(start: Date, minutes: number): Date {
	return new Date(start.getTime() + minutes * 60_000);
}

function daysAfter(start: Date, days: number): Date {
	return minutesAfter(start, days * 24 * 60);
}

/** Walks a fresh card through the learning steps so tests can start mature. */
function graduate(now: Date) {
	let card = createCard("mi", now, "word");
	for (let step = 0; step < LEARNING_STEP_MINUTES.length; step++) {
		card = gradeCard(card, "good", now);
	}
	return card;
}

describe("srs learning steps", () => {
	it("creates a card due immediately, on the first learning step", () => {
		const card = createCard("mi", DAY1, "word");
		expect(card.repetitions).toBe(0);
		expect(card.learningStep).toBe(0);
		expect(isGraduated(card)).toBe(false);
		expect(isDue(card, DAY1)).toBe(true);
	});

	it("walks a new card up the steps before letting it onto the day scale", () => {
		let card = createCard("mi", DAY1, "word");

		card = gradeCard(card, "good", DAY1);
		expect(card.learningStep).toBe(1);
		expect(isGraduated(card)).toBe(false);
		expect(new Date(card.dueAt)).toEqual(
			minutesAfter(DAY1, LEARNING_STEP_MINUTES[1]),
		);

		card = gradeCard(card, "good", DAY1);
		expect(isGraduated(card)).toBe(true);
		expect(card.repetitions).toBe(1);
		expect(card.intervalDays).toBe(1);
	});

	// The whole point of the rewrite: a word you just got wrong has to come back
	// while you are still sitting there, not tomorrow.
	it("brings a failed card back within minutes, not the next day", () => {
		const card = gradeCard(graduate(DAY1), "again", DAY1);
		expect(card.learningStep).toBe(0);
		expect(card.repetitions).toBe(0);
		expect(isGraduated(card)).toBe(false);
		expect(new Date(card.dueAt)).toEqual(
			minutesAfter(DAY1, LEARNING_STEP_MINUTES[0]),
		);
		expect(isDue(card, minutesAfter(DAY1, LEARNING_STEP_MINUTES[0]))).toBe(
			true,
		);
	});

	it("fails a brand-new card back to the first step too", () => {
		let card = createCard("mi", DAY1, "word");
		card = gradeCard(card, "good", DAY1);
		card = gradeCard(card, "again", DAY1);
		expect(card.learningStep).toBe(0);
	});

	it("skips the remaining steps when a new card is graded easy", () => {
		const card = gradeCard(createCard("mi", DAY1, "word"), "easy", DAY1);
		expect(isGraduated(card)).toBe(true);
		expect(card.intervalDays).toBe(4);
	});

	it("grows the interval by the ease factor once graduated", () => {
		let card = graduate(DAY1);
		expect(card.intervalDays).toBe(1);

		const ease = card.easeFactor;
		card = gradeCard(card, "good", daysAfter(DAY1, 1));
		expect(card.intervalDays).toBe(Math.round(1 * ease));
		expect(card.repetitions).toBe(2);

		const previousInterval = card.intervalDays;
		const previousEase = card.easeFactor;
		card = gradeCard(card, "good", daysAfter(DAY1, 2));
		expect(card.intervalDays).toBe(Math.round(previousInterval * previousEase));
	});

	it("always moves a graduated interval forward by at least a day", () => {
		let card = graduate(DAY1);
		card = gradeCard(card, "good", DAY1);
		card = gradeCard(card, "good", DAY1);
		expect(card.intervalDays).toBeGreaterThan(1);
	});

	it("gives easy a longer interval than good from the same card", () => {
		const card = graduate(DAY1);
		const good = gradeCard(card, "good", DAY1);
		const easy = gradeCard(card, "easy", DAY1);
		expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
	});

	it("never lets ease factor drop below the floor", () => {
		let card = createCard("mi", DAY1, "word");
		for (let i = 0; i < 20; i++) {
			card = gradeCard(card, "again", DAY1);
		}
		expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
	});

	it("is not due before its timestamp, down to the minute", () => {
		const card = gradeCard(createCard("mi", DAY1, "word"), "good", DAY1);
		expect(isDue(card, minutesAfter(DAY1, 1))).toBe(false);
		expect(isDue(card, minutesAfter(DAY1, LEARNING_STEP_MINUTES[1]))).toBe(
			true,
		);
	});

	it("records grammar cards on the same schedule as words", () => {
		const card = createCard("li-e", DAY1, "grammar");
		expect(card.kind).toBe("grammar");
		expect(gradeCard(card, "good", DAY1).kind).toBe("grammar");
	});
});

describe("bringForward", () => {
	it("makes a future card due now without altering its history", () => {
		const card = gradeCard(graduate(DAY1), "easy", DAY1);
		const pulled = bringForward(card, DAY1);
		expect(isDue(pulled, DAY1)).toBe(true);
		expect(pulled.easeFactor).toBe(card.easeFactor);
		expect(pulled.intervalDays).toBe(card.intervalDays);
		expect(pulled.repetitions).toBe(card.repetitions);
		expect(pulled.learningStep).toBe(card.learningStep);
	});

	it("leaves an already-due card untouched", () => {
		const card = createCard("mi", DAY1, "word");
		expect(bringForward(card, DAY1)).toBe(card);
	});
});
