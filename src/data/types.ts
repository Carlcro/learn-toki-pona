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
	| "ijo"
	| "mama"
	| "meli"
	| "mije"
	| "tonsi"
	| "olin"
	| "kulupu"
	| "akesi"
	| "waso"
	| "kala"
	| "pipi"
	| "soko"
	| "kijetesantakalu"
	| "sijelo"
	| "lawa"
	| "luka"
	| "noka"
	| "uta"
	| "insa"
	| "oko"
	| "loje"
	| "laso"
	| "jelo"
	| "walo"
	| "pimeja"
	| "kule"
	| "wan"
	| "tu"
	| "ale"
	| "nanpa"
	| "suno"
	| "mun"
	| "seli"
	| "lete"
	| "kon"
	| "sewi"
	| "kiwen"
	| "ko"
	| "len"
	| "palisa"
	| "poki"
	| "lupa"
	| "supa"
	| "leko"
	| "kasi"
	| "kili"
	| "pan"
	| "suwi"
	| "moli"
	| "jaki"
	| "tenpo"
	| "sin"
	| "pini"
	| "open"
	| "awen"
	| "lape"
	| "la"
	| "pali"
	| "alasa"
	| "esun"
	| "mani"
	| "jo"
	| "unpa"
	| "kalama"
	| "mu"
	| "nimi"
	| "lipu"
	| "sitelen"
	| "kute"
	| "pu"
	| "monsi"
	| "sinpin"
	| "poka"
	| "anpa"
	| "weka"
	| "nena"
	| "utala"
	| "pakala"
	| "kipisi"
	| "lanpan"
	| "monsuta"
	| "jasima"
	| "anu"
	| "taso"
	| "kin"
	| "a"
	| "n"
	| "ante"
	| "musi"
	| "nasin"
	| "linja"
	| "sike"
	| "selo"
	| "wawa"
	| "namako"
	| "epiku"
	| "meso"
	| "misikeke"
	| "kokosila"
	| "ku";

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

/** A line the app speaks. Shown with audio; `en` is the quiet translation. */
export interface DialogueAppTurn {
	speaker: "app";
	toki: string;
	en: string;
}

/**
 * A turn the learner must answer. A reply is accepted when it matches one of
 * `accepted` exactly (after tokenizing — punctuation and case are ignored), or
 * when every sentence in it is well-formed AND it contains every word in
 * `mustInclude`. `accepted` exists because the idiomatic answer to a yes/no
 * question is the bare verb ("wile.") — a fragment the sentence validator
 * would reject.
 */
export interface DialogueLearnerTurn {
	speaker: "learner";
	/** What the learner is being asked to do, in plain English. */
	prompt: string;
	/** Words the reply must contain for it to count as answering the question. */
	mustInclude: WordId[];
	/** Extra full replies accepted verbatim (normalized), e.g. bare-verb answers. */
	accepted?: string[];
	/** Idiomatic replies shown after answering — “you could also say”. */
	references: string[];
	/** Optional word-bank nudge, like a scene's allowedWordIds. */
	hintWordIds?: WordId[];
}

export type DialogueTurn = DialogueAppTurn | DialogueLearnerTurn;

/**
 * A short scripted conversation. The app plays its side; the learner types
 * theirs. Like compounds, a dialogue belongs to a lesson and may only lean on
 * vocabulary taught at or before it.
 */
export interface Dialogue {
	id: string;
	lessonId: string;
	/** Shown as the exercise heading, e.g. “Meeting a friend”. */
	title: string;
	turns: DialogueTurn[];
}
