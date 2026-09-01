import { describe, expect, it } from "vitest";
import type { DialogueLearnerTurn } from "#/data/types";
import { checkReply } from "./dialogue";

// A small hand-built turn keeps these tests about the checker itself rather
// than about whichever dialogue happens to live in the data file.
const VOCABULARY = new Set([
	"mi",
	"sina",
	"li",
	"e",
	"jan",
	"pilin",
	"pona",
	"ike",
	"moku",
	"wile",
	"ala",
]);

const feelingTurn: DialogueLearnerTurn = {
	speaker: "learner",
	prompt: "Tell them how you feel.",
	mustInclude: ["pilin"],
	references: ["mi pilin pona."],
};

const yesNoTurn: DialogueLearnerTurn = {
	speaker: "learner",
	prompt: "Answer yes or no.",
	mustInclude: ["wile"],
	accepted: ["wile", "wile ala"],
	references: ["wile.", "wile ala."],
};

describe("checkReply", () => {
	it("accepts a well-formed reply carrying the word the question asked for", () => {
		expect(checkReply(feelingTurn, "mi pilin pona.", VOCABULARY)).toEqual({
			ok: true,
		});
	});

	it("accepts a bare-verb answer the sentence validator would reject", () => {
		expect(checkReply(yesNoTurn, "wile ala.", VOCABULARY)).toEqual({
			ok: true,
		});
	});

	it("rejects a well-formed reply that answers a different question", () => {
		expect(checkReply(feelingTurn, "mi moku.", VOCABULARY)).toEqual({
			ok: false,
			reason: "missing-word",
			token: "pilin",
		});
	});

	it("passes through the validator's own reason for an ill-formed reply", () => {
		expect(checkReply(feelingTurn, "mi li pilin pona.", VOCABULARY)).toEqual({
			ok: false,
			reason: "unexpected-li",
			token: undefined,
		});
	});

	it("rejects a word the course hasn't taught yet, naming it", () => {
		expect(checkReply(feelingTurn, "mi pilin lape.", VOCABULARY)).toEqual({
			ok: false,
			reason: "unknown-word",
			token: "lape",
		});
	});

	it("validates every sentence in a multi-sentence reply", () => {
		expect(
			checkReply(feelingTurn, "mi pilin pona. mi li moku.", VOCABULARY),
		).toEqual({ ok: false, reason: "unexpected-li", token: undefined });
	});

	it("treats a blank reply as empty", () => {
		expect(checkReply(feelingTurn, "   ", VOCABULARY)).toEqual({
			ok: false,
			reason: "empty",
		});
	});
});
