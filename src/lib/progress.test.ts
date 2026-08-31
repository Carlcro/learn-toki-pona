import { describe, expect, it } from "vitest";
import type { Lesson, WordId } from "#/data/types";
import {
	type Decks,
	describeTimeUntil,
	selectDailyPlan,
	selectLessonProgress,
	selectMasteryBreakdown,
	selectNextDueAt,
	selectReviewQueue,
	selectWordsLearnedCount,
} from "./progress";
import type { SrsCard } from "./srs";

const NOW = new Date("2026-01-10T09:00:00.000Z");

function card(overrides: Partial<SrsCard> = {}): SrsCard {
	return {
		id: "mi",
		kind: "word",
		easeFactor: 2.5,
		intervalDays: 0,
		repetitions: 0,
		learningStep: 0,
		dueAt: "2026-01-10T09:00:00.000Z",
		lastReviewedAt: null,
		...overrides,
	};
}

function graded(overrides: Partial<SrsCard> = {}): SrsCard {
	return card({ lastReviewedAt: "2026-01-09T09:00:00.000Z", ...overrides });
}

function decks(overrides: Partial<Decks> = {}): Decks {
	return { cards: {}, grammarCards: {}, senseCards: {}, ...overrides };
}

const lessons: Lesson[] = [
	{ id: "1", topic: "", wordIds: [], grammarConceptIds: [], sceneIds: [] },
	{ id: "2", topic: "", wordIds: [], grammarConceptIds: [], sceneIds: [] },
	{ id: "3", topic: "", wordIds: [], grammarConceptIds: [], sceneIds: [] },
];

describe("selectMasteryBreakdown", () => {
	it("buckets cards into new, learning, and mature", () => {
		const cards: Partial<Record<WordId, SrsCard>> = {
			mi: card(),
			sina: graded({ repetitions: 2, intervalDays: 6, learningStep: null }),
			li: graded({ repetitions: 4, intervalDays: 30, learningStep: null }),
		};
		expect(selectMasteryBreakdown(cards)).toEqual({
			new: 1,
			learning: 1,
			mature: 1,
		});
	});

	it("returns all zeros for no cards", () => {
		expect(selectMasteryBreakdown({})).toEqual({
			new: 0,
			learning: 0,
			mature: 0,
		});
	});
});

describe("selectWordsLearnedCount", () => {
	// A word answered once in a lesson counts, even though it is still on the
	// learning steps — otherwise a finished lesson would read as zero progress.
	it("counts every card that has been answered at least once", () => {
		const cards: Partial<Record<WordId, SrsCard>> = {
			mi: card(),
			sina: graded({ learningStep: 1 }),
			li: graded({ repetitions: 3, learningStep: null }),
		};
		expect(selectWordsLearnedCount(cards)).toBe(2);
	});
});

describe("selectReviewQueue", () => {
	it("merges word, grammar, and sense cards, soonest first", () => {
		const queue = selectReviewQueue(
			decks({
				cards: { mi: graded({ id: "mi", dueAt: "2026-01-10T08:00:00.000Z" }) },
				grammarCards: {
					"li-e": graded({
						id: "li-e",
						kind: "grammar",
						dueAt: "2026-01-10T07:00:00.000Z",
					}),
				},
				senseCards: {
					"moku-noun": graded({
						id: "moku-noun",
						kind: "sense",
						dueAt: "2026-01-10T06:00:00.000Z",
					}),
				},
			}),
			NOW,
		);
		expect(queue.map((entry) => entry.id)).toEqual(["moku-noun", "li-e", "mi"]);
	});

	// The whole point of the sense deck: reading which meaning a slot forces is
	// scheduled like anything else, not credited once at lesson end.
	it("keeps a card's kind so the reviewer knows how to ask it", () => {
		const queue = selectReviewQueue(
			decks({
				senseCards: {
					"pona-predicate": graded({ id: "pona-predicate", kind: "sense" }),
				},
			}),
			NOW,
		);
		expect(queue.map((entry) => entry.kind)).toEqual(["sense"]);
	});

	it("leaves out anything not yet due", () => {
		const queue = selectReviewQueue(
			decks({ cards: { mi: graded({ dueAt: "2026-01-11T09:00:00.000Z" }) } }),
			NOW,
		);
		expect(queue).toEqual([]);
	});
});

describe("selectNextDueAt", () => {
	it("returns the soonest future due time", () => {
		expect(
			selectNextDueAt(
				decks({
					cards: {
						mi: graded({ dueAt: "2026-01-12T09:00:00.000Z" }),
						sina: graded({ dueAt: "2026-01-11T09:00:00.000Z" }),
					},
				}),
				NOW,
			),
		).toBe("2026-01-11T09:00:00.000Z");
	});

	it("counts a pending sense card as something still to come back", () => {
		expect(
			selectNextDueAt(
				decks({
					senseCards: {
						"moku-verb": graded({
							id: "moku-verb",
							kind: "sense",
							dueAt: "2026-01-11T09:00:00.000Z",
						}),
					},
				}),
				NOW,
			),
		).toBe("2026-01-11T09:00:00.000Z");
	});

	it("is null when everything is already due", () => {
		expect(selectNextDueAt(decks({ cards: { mi: graded() } }), NOW)).toBeNull();
	});
});

describe("selectLessonProgress", () => {
	it("marks completed lessons, one current lesson, and the rest locked", () => {
		expect(
			selectLessonProgress(["1"], lessons).map((entry) => entry.status),
		).toEqual(["completed", "current", "locked"]);
	});

	it("marks the first lesson current when nothing is completed", () => {
		expect(
			selectLessonProgress([], lessons).map((entry) => entry.status),
		).toEqual(["current", "locked", "locked"]);
	});

	it("marks every lesson completed when all are done", () => {
		expect(
			selectLessonProgress(["1", "2", "3"], lessons).map(
				(entry) => entry.status,
			),
		).toEqual(["completed", "completed", "completed"]);
	});
});

describe("selectDailyPlan", () => {
	function plan(overrides: Partial<Parameters<typeof selectDailyPlan>[0]>) {
		return selectDailyPlan({
			decks: decks(),
			completedLessonIds: [],
			lastLessonCompletedAt: null,
			lessons,
			now: NOW,
			...overrides,
		});
	}

	it("opens a brand-new learner on lesson 1", () => {
		expect(plan({})).toEqual({ kind: "first-lesson", lessonId: "1" });
	});

	// Reviews are the part that decays, so they outrank new material.
	it("puts due reviews ahead of the next lesson", () => {
		expect(
			plan({
				decks: decks({ cards: { mi: graded() } }),
				completedLessonIds: ["1"],
			}),
		).toEqual({ kind: "review", dueCount: 1 });
	});

	it("counts due grammar alongside due words", () => {
		const result = plan({
			decks: decks({
				grammarCards: { "li-e": graded({ id: "li-e", kind: "grammar" }) },
			}),
		});
		expect(result).toEqual({ kind: "review", dueCount: 1 });
	});

	it("counts a due sense check as review work in its own right", () => {
		const result = plan({
			decks: decks({
				senseCards: {
					"suli-modifier": graded({ id: "suli-modifier", kind: "sense" }),
				},
			}),
		});
		expect(result).toEqual({ kind: "review", dueCount: 1 });
	});

	it("offers the next lesson once nothing is due", () => {
		expect(
			plan({
				completedLessonIds: ["1"],
				lastLessonCompletedAt: "2026-01-09",
				decks: decks({
					cards: { mi: graded({ dueAt: "2026-01-20T09:00:00.000Z" }) },
				}),
			}),
		).toEqual({ kind: "lesson", lessonId: "2" });
	});

	// One new lesson a day: a course crammed in an evening is a course forgotten
	// by the weekend.
	it("suggests resting after the day's lesson is already done", () => {
		expect(
			plan({
				completedLessonIds: ["1"],
				lastLessonCompletedAt: "2026-01-10",
				decks: decks({
					cards: { mi: graded({ dueAt: "2026-01-20T09:00:00.000Z" }) },
				}),
			}),
		).toEqual({
			kind: "rest",
			nextLessonId: "2",
			nextDueAt: "2026-01-20T09:00:00.000Z",
		});
	});

	it("reports a real ending instead of looping back to lesson 1", () => {
		expect(
			plan({
				completedLessonIds: ["1", "2", "3"],
				lastLessonCompletedAt: "2026-01-10",
				decks: decks({
					cards: { mi: graded({ dueAt: "2026-01-20T09:00:00.000Z" }) },
				}),
			}),
		).toEqual({
			kind: "course-complete",
			nextDueAt: "2026-01-20T09:00:00.000Z",
		});
	});
});

describe("describeTimeUntil", () => {
	it("describes minutes, hours, and days in plain words", () => {
		expect(describeTimeUntil("2026-01-10T09:09:00.000Z", NOW)).toBe(
			"in 9 minutes",
		);
		expect(describeTimeUntil("2026-01-10T12:00:00.000Z", NOW)).toBe(
			"in 3 hours",
		);
		expect(describeTimeUntil("2026-01-11T09:00:00.000Z", NOW)).toBe("tomorrow");
		expect(describeTimeUntil("2026-01-15T09:00:00.000Z", NOW)).toBe(
			"in 5 days",
		);
	});

	it("says now for anything already due", () => {
		expect(describeTimeUntil("2026-01-01T09:00:00.000Z", NOW)).toBe("now");
	});
});
