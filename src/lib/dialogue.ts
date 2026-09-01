import type { DialogueLearnerTurn } from "#/data/types";
import {
	tokenize,
	type ValidationError,
	validateLiE,
} from "./grammar-validator";

export type ReplyCheck =
	| { ok: true }
	| { ok: false; reason: ValidationError | "missing-word"; token?: string };

/** A reply can hold several sentences; each is validated on its own. */
export function splitSentences(reply: string): string[] {
	return reply
		.split(/[.!?]+/)
		.map((sentence) => sentence.trim())
		.filter((sentence) => sentence.length > 0);
}

/** The comparable form of a reply: lowercase, unpunctuated, single-spaced. */
function normalize(reply: string): string {
	return tokenize(reply).join(" ");
}

/**
 * Judges a reply on two counts: is it well formed, and does it answer what was
 * asked. The order matters — `accepted` is checked first because the idiomatic
 * answer to a yes/no question is a bare verb, a fragment `validateLiE` would
 * rightly reject as a sentence but which is exactly right as a reply.
 */
export function checkReply(
	turn: DialogueLearnerTurn,
	reply: string,
	vocabulary: Iterable<string>,
): ReplyCheck {
	const normalized = normalize(reply);
	if (turn.accepted?.some((answer) => normalize(answer) === normalized)) {
		return { ok: true };
	}

	const sentences = splitSentences(reply);
	if (sentences.length === 0) {
		return { ok: false, reason: "empty" };
	}

	for (const sentence of sentences) {
		const result = validateLiE(sentence, vocabulary);
		if (!result.valid) {
			return { ok: false, reason: result.reason, token: result.token };
		}
	}

	// Well formed is not the same as responsive: "mi moku" is a fine sentence
	// and a non-answer to "how are you feeling?".
	const tokens = new Set(tokenize(reply));
	for (const wordId of turn.mustInclude) {
		if (!tokens.has(wordId)) {
			return { ok: false, reason: "missing-word", token: wordId };
		}
	}

	return { ok: true };
}
