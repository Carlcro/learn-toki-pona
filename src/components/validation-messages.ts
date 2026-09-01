import type { ValidationError } from "#/lib/grammar-validator";

// One phrasing per structural slip, shared by every exercise that validates
// what the learner wrote — so the same mistake is named the same way whether
// it happens describing a scene or answering someone mid-conversation. The
// wording stays out of grammar-school terms: it says what to do to the
// sentence, not what part of speech went wrong.
export const VALIDATION_MESSAGES: Record<ValidationError, string> = {
	empty: "Write a sentence before submitting.",
	"unknown-word": "The course hasn't taught that word yet.",
	"missing-li": "This subject needs li before the predicate.",
	"unexpected-li": "Drop li — it's left out after a bare mi or sina.",
	"empty-subject": "The sentence needs a subject before li.",
	"empty-predicate": "The sentence needs a predicate.",
	"empty-object": "e needs an object after it.",
	"dangling-ala": "ala goes after the word it cancels, not in front of it.",
	"trailing-tokens":
		"This sentence has more structure than the course covers so far.",
};
