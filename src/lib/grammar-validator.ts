export type ValidationError =
	| "empty"
	| "unknown-word"
	| "missing-li"
	| "unexpected-li"
	| "empty-subject"
	| "empty-predicate"
	| "empty-object"
	| "dangling-ala"
	| "trailing-tokens";

export type ValidationResult =
	| { valid: true }
	| {
			valid: false;
			reason: ValidationError;
			tokenIndex?: number;
			/** The offending word, when naming it makes the message useful. */
			token?: string;
	  };

const BARE_PRONOUNS = new Set(["mi", "sina"]);

export function tokenize(sentence: string): string[] {
	return sentence
		.toLowerCase()
		.replace(/[.!?,]/g, " ")
		.split(/\s+/)
		.filter((token) => token.length > 0);
}

/**
 * ala negates whatever sits directly in front of it, so it can never open a
 * phrase — "mi ala moku" is the classic beginner slip for "mi moku ala".
 */
function hasDanglingAla(phrase: string[]): boolean {
	return phrase[0] === "ala";
}

/**
 * Checks the sentence structure the course has actually taught: one clause,
 * li/e placement, o commands, and ala attachment.
 *
 * `vocabulary` is the set of words the learner has been taught so far, not the
 * whole dictionary — a sentence is only rejected as unknown-word if it reaches
 * past the course, never for reusing something from an earlier lesson.
 *
 * This is a structural check, not a meaning check: it can confirm a sentence is
 * well-formed, and deliberately says nothing about whether it makes sense.
 */
export function validateLiE(
	sentence: string,
	vocabulary: Iterable<string>,
): ValidationResult {
	const tokens = tokenize(sentence);
	if (tokens.length === 0) {
		return { valid: false, reason: "empty" };
	}

	const known = new Set(vocabulary);
	for (const [index, token] of tokens.entries()) {
		if (!known.has(token)) {
			return { valid: false, reason: "unknown-word", tokenIndex: index, token };
		}
	}

	// la splits a setup phrase (time, condition, topic) from the sentence it
	// applies to. The setup's own internal grammar goes unchecked — only that
	// it isn't empty — and everything after la is validated as an ordinary
	// sentence, same as if la had never been there.
	const laIndex = tokens.indexOf("la");
	let mainTokens = tokens;
	if (laIndex !== -1) {
		if (laIndex === 0) {
			return { valid: false, reason: "empty-subject" };
		}
		mainTokens = tokens.slice(laIndex + 1);
		if (mainTokens.length === 0) {
			return { valid: false, reason: "empty-predicate" };
		}
	}

	const oIndex = mainTokens.indexOf("o");
	const liIndex = mainTokens.indexOf("li");
	let subjectTokens: string[];
	let remainder: string[];

	if (oIndex !== -1) {
		// o marks a command/request for any subject (or none) and, unlike li,
		// is never dropped — so it takes priority over the li/bare-pronoun rules.
		if (liIndex !== -1) {
			return { valid: false, reason: "trailing-tokens", tokenIndex: liIndex };
		}
		subjectTokens = mainTokens.slice(0, oIndex);
		if (subjectTokens.includes("e")) {
			return { valid: false, reason: "trailing-tokens", tokenIndex: oIndex };
		}
		remainder = mainTokens.slice(oIndex + 1);
	} else if (liIndex !== -1) {
		subjectTokens = mainTokens.slice(0, liIndex);
		if (subjectTokens.length === 0) {
			return { valid: false, reason: "empty-subject" };
		}
		if (subjectTokens.length === 1 && BARE_PRONOUNS.has(subjectTokens[0])) {
			return { valid: false, reason: "unexpected-li", tokenIndex: liIndex };
		}
		if (subjectTokens.includes("e")) {
			return { valid: false, reason: "trailing-tokens", tokenIndex: liIndex };
		}
		remainder = mainTokens.slice(liIndex + 1);
	} else {
		if (BARE_PRONOUNS.has(mainTokens[0])) {
			subjectTokens = [mainTokens[0]];
			remainder = mainTokens.slice(1);
		} else {
			return { valid: false, reason: "missing-li" };
		}
	}

	if (hasDanglingAla(subjectTokens)) {
		return { valid: false, reason: "dangling-ala" };
	}

	if (remainder.includes("li") || remainder.includes("o")) {
		return { valid: false, reason: "trailing-tokens" };
	}

	const eIndex = remainder.indexOf("e");
	let predicateTokens: string[];
	let objectTokens: string[];

	if (eIndex !== -1) {
		predicateTokens = remainder.slice(0, eIndex);
		objectTokens = remainder.slice(eIndex + 1);
		if (predicateTokens.length === 0) {
			return { valid: false, reason: "empty-predicate" };
		}
		if (objectTokens.length === 0) {
			return { valid: false, reason: "empty-object" };
		}
		if (objectTokens.includes("e")) {
			return { valid: false, reason: "trailing-tokens" };
		}
	} else {
		predicateTokens = remainder;
		objectTokens = [];
		if (predicateTokens.length === 0) {
			return { valid: false, reason: "empty-predicate" };
		}
	}

	if (hasDanglingAla(predicateTokens) || hasDanglingAla(objectTokens)) {
		return { valid: false, reason: "dangling-ala" };
	}

	return { valid: true };
}
