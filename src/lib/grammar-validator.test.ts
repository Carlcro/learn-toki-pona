import { describe, expect, it } from "vitest";
import { WORDS } from "#/data/words";
import { tokenize, validateLiE } from "./grammar-validator";

const ALL_WORDS = new Set(WORDS.map((word) => word.id as string));

describe("tokenize", () => {
	it("lowercases, strips punctuation, and splits on whitespace", () => {
		expect(tokenize("Jan li moku e telo.")).toEqual([
			"jan",
			"li",
			"moku",
			"e",
			"telo",
		]);
	});

	it("drops empty tokens from repeated whitespace", () => {
		expect(tokenize("mi   moku")).toEqual(["mi", "moku"]);
	});
});

describe("validateLiE", () => {
	it("accepts a bare pronoun subject with li omitted", () => {
		expect(validateLiE("mi moku.", ALL_WORDS)).toEqual({ valid: true });
		expect(validateLiE("sina moku e telo.", ALL_WORDS)).toEqual({
			valid: true,
		});
	});

	it("accepts a non-pronoun subject with li present", () => {
		expect(validateLiE("jan li moku e telo.", ALL_WORDS)).toEqual({
			valid: true,
		});
		expect(validateLiE("jan li pona.", ALL_WORDS)).toEqual({ valid: true });
	});

	it("rejects an empty sentence", () => {
		expect(validateLiE("", ALL_WORDS)).toEqual({
			valid: false,
			reason: "empty",
		});
	});

	it("rejects unknown words", () => {
		expect(validateLiE("mi kamalasi.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "unknown-word",
			tokenIndex: 1,
			token: "kamalasi",
		});
	});

	// A learner is held to what the course has taught them, not the dictionary.
	it("rejects a word the learner has not reached yet", () => {
		const lessonOneVocabulary = new Set(["mi", "moku", "e", "telo"]);
		expect(validateLiE("mi moku e soweli.", lessonOneVocabulary)).toEqual({
			valid: false,
			reason: "unknown-word",
			tokenIndex: 3,
			token: "soweli",
		});
	});

	it("accepts ala directly after the word it cancels", () => {
		expect(validateLiE("mi moku ala.", ALL_WORDS)).toEqual({ valid: true });
		expect(validateLiE("jan li moku ala e telo.", ALL_WORDS)).toEqual({
			valid: true,
		});
	});

	it("accepts the verb-ala-verb yes/no question", () => {
		expect(validateLiE("sina moku ala moku?", ALL_WORDS)).toEqual({
			valid: true,
		});
		expect(validateLiE("telo li pona ala pona?", ALL_WORDS)).toEqual({
			valid: true,
		});
	});

	it("rejects ala placed in front of what it should cancel", () => {
		expect(validateLiE("mi ala moku.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "dangling-ala",
		});
		expect(validateLiE("jan li ala moku.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "dangling-ala",
		});
	});

	it("rejects li after a bare pronoun subject", () => {
		expect(validateLiE("mi li moku.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "unexpected-li",
			tokenIndex: 1,
		});
	});

	it("rejects a missing li for a non-pronoun subject", () => {
		expect(validateLiE("jan moku.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "missing-li",
		});
	});

	it("rejects an empty predicate", () => {
		expect(validateLiE("jan li e telo.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "empty-predicate",
		});
	});

	it("rejects an empty object after e", () => {
		expect(validateLiE("jan li moku e", ALL_WORDS)).toEqual({
			valid: false,
			reason: "empty-object",
		});
	});

	it("rejects a second li as trailing structure", () => {
		expect(validateLiE("jan li moku li pona", ALL_WORDS)).toEqual({
			valid: false,
			reason: "trailing-tokens",
		});
	});

	it("accepts o as a command marker for a bare-pronoun subject", () => {
		expect(validateLiE("sina o pona.", ALL_WORDS)).toEqual({ valid: true });
	});

	it("accepts o as a command marker for a non-pronoun subject without li", () => {
		expect(validateLiE("jan o kama.", ALL_WORDS)).toEqual({ valid: true });
	});

	it("accepts o with no subject at all", () => {
		expect(validateLiE("o pona.", ALL_WORDS)).toEqual({ valid: true });
	});

	it("accepts o with a direct object", () => {
		expect(validateLiE("sina o pana e moku.", ALL_WORDS)).toEqual({
			valid: true,
		});
	});

	it("rejects li and o combined in one sentence", () => {
		expect(validateLiE("jan li o moku.", ALL_WORDS)).toEqual({
			valid: false,
			reason: "trailing-tokens",
			tokenIndex: 1,
		});
	});

	it("rejects a second o as trailing structure", () => {
		expect(validateLiE("jan o moku o pona", ALL_WORDS)).toEqual({
			valid: false,
			reason: "trailing-tokens",
		});
	});
});

describe("word examples", () => {
	it("every word's example sentence is structurally valid and uses that word", () => {
		for (const word of WORDS) {
			const result = validateLiE(word.example.toki, ALL_WORDS);
			expect(result, `${word.id}: "${word.example.toki}"`).toEqual({
				valid: true,
			});
			expect(
				tokenize(word.example.toki),
				`${word.id}'s example should use the word itself`,
			).toContain(word.toki);
		}
	});
});
