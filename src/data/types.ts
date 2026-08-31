export type WordId =
	| "mi"
	| "sina"
	| "li"
	| "e"
	| "jan"
	| "moku"
	| "telo"
	| "pona"
	| "suli"
	| "lili"
	| "mute"
	| "ni"
	| "soweli"
	| "ona"
	| "en"
	| "wile"
	| "ken"
	| "sona"
	| "toki"
	| "ala"
	| "pilin"
	| "ike"
	| "seme"
	| "pi"
	| "tomo"
	| "ma"
	| "lukin"
	| "o"
	| "pana"
	| "kama"
	| "lon"
	| "tawa"
	| "kepeken"
	| "tan"
	| "sama"
	| "ilo"
	| "nasa"
	| "ijo";

export interface WordExample {
	toki: string;
	en: string;
}

export interface Word {
	id: WordId;
	toki: string;
	gloss: string;
	definition: string;
	role: "pronoun" | "particle" | "content";
	example: WordExample;
}

/**
 * A quick multiple-choice check on a grammar point, so grammar can be reviewed
 * on the same schedule as vocabulary instead of being credited forever the
 * moment its lesson ends.
 */
export interface GrammarCheck {
	question: string;
	options: string[];
	answer: string;
}

/**
 * One piece of a sentence, with a plain-language name for the job it does.
 * The label is what a learner without grammar-school vocabulary actually needs
 * — "what they do" rather than "predicate" — so it is written for them, not
 * borrowed from linguistics.
 */
export interface AnnotatedChunk {
	/** The toki pona words in this piece. */
	text: string;
	/** The job this piece does. Left off for glue words the labels around it already explain. */
	label?: string;
	/** Glue words (li, e, pi, o, en) are coloured apart from the pieces they join. */
	particle?: boolean;
}

/**
 * A worked sentence, cut into its pieces. Showing where a sentence splits
 * teaches the shape faster than any amount of prose about it — so every
 * grammar point carries at least one.
 */
export interface AnnotatedExample {
	chunks: AnnotatedChunk[];
	en: string;
}

export interface GrammarConcept {
	id: string;
	name: string;
	explanation: string;
	/** Worked sentences shown under the explanation, cut into labelled pieces. */
	examples: AnnotatedExample[];
	check: GrammarCheck;
}

export interface Lesson {
	id: string;
	/** The words/grammar the lesson covers, without the "Lesson N" prefix. */
	topic: string;
	wordIds: WordId[];
	grammarConceptIds: string[];
	sceneIds: string[];
}

export interface LibraryLine {
	toki: string;
	en: string;
}

/**
 * A readable piece for the library. It carries no word list of its own — the
 * vocabulary it requires is derived from its own text, so a piece can never
 * claim to need less than it actually uses.
 */
export interface LibraryItem {
	id: string;
	title: string;
	grammarConceptIds: string[];
	lines: LibraryLine[];
}

export interface Scene {
	id: string;
	title: string;
	svgKey: string;
	allowedWordIds: WordId[];
	referenceSentences: string[];
}

/**
 * One word, one sentence, and the question of which of its senses that slot
 * calls for. Toki Pona words cover whole semantic fields and take their part of
 * speech from position, so reading the slot is the skill — not recalling a
 * single English equivalent.
 */
export interface SenseItem {
	id: string;
	wordId: WordId;
	sentence: string;
	/** Renderings of the sentence; exactly one fits the way the word is used. */
	options: string[];
	answer: string;
	/** Why that slot forces that sense, shown after answering. */
	note: string;
}

/**
 * A concept Toki Pona has no single word for, built from words the learner
 * already has. Composition is the language's core move, so it gets drilled
 * directly rather than being left to emerge from reading.
 */
export interface Compound {
	id: string;
	lessonId: string;
	/** What the learner is asked to build. */
	en: string;
	/** The word-for-word reading, shown after answering. */
	literal: string;
	answer: WordId[];
}
