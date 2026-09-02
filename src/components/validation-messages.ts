import type { ValidationError } from "#/lib/grammar-validator";

// One phrasing per structural slip, shared by every exercise that validates
// what the learner wrote — so the same mistake is named the same way whether
// it happens describing a scene or answering someone mid-conversation. The
// wording stays out of grammar-school terms: it says what to do to the
// sentence, not what part of speech went wrong.
export const VALIDATION_MESSAGES: Record<ValidationError, string> = {
	empty: "Write a sentence before submitting.",
	"unknown-word": "The course hasn't taught that word yet.",
	"missing-li": "Add li between who it's about and what they do.",
	"unexpected-li": "Drop li. After mi or sina on their own, li stays home.",
	"empty-subject": "Say who or what the sentence is about before li.",
	"empty-predicate":
		"The sentence needs a second half: what they do, or what they are.",
	"empty-object": "e needs a word after it: the thing the action is done to.",
	"dangling-ala": "ala goes after the word it cancels, not in front of it.",
	"trailing-tokens":
		"This sentence uses a shape the course hasn't covered yet. Try something simpler.",
};
