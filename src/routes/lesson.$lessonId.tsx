import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CompoundBuilder } from "#/components/CompoundBuilder";
import { ContextExercise } from "#/components/ContextExercise";
import { DialogueExercise } from "#/components/DialogueExercise";
import { Flashcard } from "#/components/Flashcard";
import { GrammarCheckCard } from "#/components/GrammarCheckCard";
import { MultipleChoice } from "#/components/MultipleChoice";
import { PageHeader } from "#/components/PageHeader";
import { SenseCheck } from "#/components/SenseCheck";
import { SentenceAnatomy } from "#/components/SentenceAnatomy";
import { SentenceBuilder } from "#/components/SentenceBuilder";
import { SpeakerButton } from "#/components/SpeakerButton";
import { StepProgress } from "#/components/StepProgress";
import { selectCompoundsForLesson } from "#/data/compounds";
import { selectDialoguesForLesson } from "#/data/dialogues";
import { GRAMMAR_CONCEPTS_BY_ID } from "#/data/grammar";
import {
	getLessonById,
	LESSONS,
	selectVocabularyThroughLesson,
} from "#/data/lessons";
import { LIBRARY_ITEMS } from "#/data/library";
import { SCENES_BY_ID } from "#/data/scenes";
import {
	selectSenseItemIdsForWords,
	selectSenseItemsForWords,
} from "#/data/senses";
import type {
	Compound,
	Dialogue,
	GrammarConcept,
	Scene,
	SenseItem,
	Word,
	WordId,
} from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import {
	selectKnownConceptIds,
	selectKnownWordIds,
	selectUnlockedByLesson,
} from "#/lib/library";
import { describeTimeUntil, selectNextDueAt } from "#/lib/progress";
import type { Grade } from "#/lib/srs";
import {
	initializeCardsForLesson,
	markLessonComplete,
	recordGrade,
	recordGrammarGrade,
	recordSenseGrade,
	useProgressState,
} from "#/lib/store";

export const Route = createFileRoute("/lesson/$lessonId")({
	loader: ({ params }) => {
		const lesson = getLessonById(params.lessonId);
		if (!lesson) throw notFound();
		return lesson;
	},
	component: LessonPage,
});

/**
 * New words per batch. Working memory holds roughly four things at once, so a
 * lesson introduces a handful, tests those, and only then moves on — rather
 * than presenting everything and quizzing it afterwards.
 */
const BATCH_SIZE = 4;

type Step =
	| { kind: "intro"; words: Word[]; concepts: GrammarConcept[] }
	| { kind: "recognize"; word: Word }
	| { kind: "drill"; word: Word }
	| { kind: "grammar"; concept: GrammarConcept }
	| { kind: "sense"; item: SenseItem }
	| { kind: "compound"; compound: Compound }
	| { kind: "build"; scene: Scene }
	| { kind: "context"; scene: Scene }
	| { kind: "dialogue"; dialogue: Dialogue };

function chunk<T>(items: T[], size: number): T[][] {
	const batches: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		batches.push(items.slice(i, i + size));
	}
	return batches;
}

function buildSteps(args: {
	words: Word[];
	concepts: GrammarConcept[];
	scenes: Scene[];
	senseItems: SenseItem[];
	compounds: Compound[];
	dialogues: Dialogue[];
}): Step[] {
	const steps: Step[] = [];
	chunk(args.words, BATCH_SIZE).forEach((batch, batchIndex) => {
		// Grammar is explained once, alongside the first batch of words.
		steps.push({
			kind: "intro",
			words: batch,
			concepts: batchIndex === 0 ? args.concepts : [],
		});
		for (const word of batch) steps.push({ kind: "recognize", word });
		for (const word of batch) steps.push({ kind: "drill", word });
	});
	for (const concept of args.concepts) steps.push({ kind: "grammar", concept });
	for (const item of args.senseItems) steps.push({ kind: "sense", item });
	for (const compound of args.compounds) {
		steps.push({ kind: "compound", compound });
	}
	for (const scene of args.scenes) {
		steps.push({ kind: "build", scene });
		steps.push({ kind: "context", scene });
	}
	// Conversation closes the lesson: by here the words have been drilled and
	// the sentences built, so a dialogue is the first place any of it has to
	// come back under time pressure, from someone else's opening line.
	for (const dialogue of args.dialogues) {
		steps.push({ kind: "dialogue", dialogue });
	}
	return steps;
}

const PRIMARY_BUTTON =
	"w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night";
const OUTLINE_BUTTON =
	"w-full rounded-full border-2 border-night-edge bg-night-soft px-6 py-3 text-center font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream";

function LessonPage() {
	const lesson = Route.useLoaderData();
	const progress = useProgressState();
	const { cards, completedLessonIds } = progress;
	const [index, setIndex] = useState(0);
	const [finished, setFinished] = useState(false);

	// Built once per lesson: the step list is the lesson's whole script, and
	// rebuilding it mid-run would reshuffle exercises under the learner.
	const steps = useMemo(
		() =>
			buildSteps({
				words: lesson.wordIds.map((id) => WORDS_BY_ID[id]),
				concepts: lesson.grammarConceptIds.map(
					(id) => GRAMMAR_CONCEPTS_BY_ID[id],
				),
				scenes: lesson.sceneIds.map((id) => SCENES_BY_ID[id]),
				senseItems: selectSenseItemsForWords(lesson.wordIds),
				compounds: selectCompoundsForLesson(lesson.id),
				dialogues: selectDialoguesForLesson(lesson.id),
			}),
		[lesson],
	);

	// Vocabulary the learner is fairly held to: this lesson and everything
	// before it, never the whole dictionary.
	const vocabulary = useMemo(
		() => selectVocabularyThroughLesson(lesson.id),
		[lesson.id],
	);
	const vocabularyWords = useMemo(
		() => [...vocabulary].map((id) => WORDS_BY_ID[id as WordId]),
		[vocabulary],
	);
	const vocabularyIds = useMemo(
		() => [...vocabulary] as WordId[],
		[vocabulary],
	);

	// What this lesson bought the learner, worked out from present state rather
	// than a count taken at mount — see selectUnlockedByLesson.
	const unlockedCount = selectUnlockedByLesson(
		LIBRARY_ITEMS,
		selectKnownWordIds(cards),
		selectKnownConceptIds(completedLessonIds, LESSONS),
		lesson,
	);

	useEffect(() => {
		initializeCardsForLesson(
			lesson.wordIds,
			lesson.grammarConceptIds,
			selectSenseItemIdsForWords(lesson.wordIds),
			new Date(),
		);
	}, [lesson]);

	function advance() {
		if (index + 1 < steps.length) {
			setIndex(index + 1);
			return;
		}
		markLessonComplete(lesson.id, new Date());
		setFinished(true);
	}

	function handleWordGrade(wordId: WordId, grade: Grade) {
		recordGrade(wordId, grade, new Date());
		advance();
	}

	function handleGrammarGrade(conceptId: string, grade: Grade) {
		recordGrammarGrade(conceptId, grade, new Date());
		advance();
	}

	function handleSenseGrade(itemId: string, grade: Grade) {
		recordSenseGrade(itemId, grade, new Date());
		advance();
	}

	const step = steps[index];
	const nextDueAt = finished ? selectNextDueAt(progress, new Date()) : null;

	// A fixed-height shell rather than a growing page: the step content scrolls
	// inside `main` so the step's primary action stays pinned in view, however
	// many words a lesson introduces.
	return (
		<div className="flex h-[100dvh] flex-col items-center gap-6 px-6 py-10 sm:gap-8 sm:py-14">
			<PageHeader
				label={`Lesson ${lesson.id} — ${lesson.topic}`}
				backTo="/"
				backLabel="Back home"
			/>

			{!finished && (
				<div className="w-full max-w-sm shrink-0">
					<StepProgress done={index} total={steps.length} label="This lesson" />
				</div>
			)}

			{/* The scroll container spans the full width so its scrollbar rides the
			    window edge instead of the content column's rounded cards. */}
			<main className="flex w-full min-h-0 flex-1 justify-center overflow-y-auto">
				<div className="flex h-fit w-full max-w-sm flex-col items-center gap-6">
					{finished ? (
						<div className="flex w-full flex-col items-center gap-6">
							<span className="font-script text-3xl text-pink">
								Lesson complete!
							</span>
							<p className="text-center font-sans text-sm text-mist">
								{unlockedCount > 0
									? `You can now read ${unlockedCount} more piece${
											unlockedCount === 1 ? "" : "s"
										} in the library — no translation needed.`
									: "These words are in your review queue now."}
							</p>
							{nextDueAt && (
								<p className="text-center font-sans text-xs text-mist">
									That's your new lesson for today. These words come back{" "}
									{describeTimeUntil(nextDueAt, new Date())} — short gaps first,
									then longer ones.
								</p>
							)}
							{unlockedCount > 0 && (
								<Link to="/library" className={PRIMARY_BUTTON}>
									Read what you unlocked
								</Link>
							)}
							<Link
								to="/"
								className={unlockedCount > 0 ? OUTLINE_BUTTON : PRIMARY_BUTTON}
							>
								Back home
							</Link>
						</div>
					) : (
						step && (
							<>
								{step.kind === "intro" && (
									<>
										<div className="flex w-full flex-col gap-3">
											{step.words.map((word) => (
												<div
													key={word.id}
													className="flex items-center gap-3 rounded-[28px] border-2 border-night-edge bg-night-soft px-5 py-3.5"
												>
													<div className="flex flex-1 flex-col">
														<span className="font-display text-base font-bold text-cream">
															{word.toki}
														</span>
														<span className="font-sans text-xs text-mist">
															{word.gloss}
														</span>
													</div>
													<SpeakerButton text={word.toki} />
												</div>
											))}
										</div>

										{step.concepts.map((concept) => (
											<div
												key={concept.id}
												className="flex w-full flex-col gap-4 rounded-[28px] border-2 border-night-edge bg-night-soft px-4 py-4"
											>
												<p className="font-sans text-sm text-mist">
													{concept.explanation}
												</p>
												{concept.examples.map((example) => (
													<SentenceAnatomy key={example.en} example={example} />
												))}
											</div>
										))}
									</>
								)}

								{step.kind === "recognize" && (
									<MultipleChoice
										key={step.word.id}
										word={step.word}
										pool={vocabularyWords}
										onNext={advance}
									/>
								)}

								{step.kind === "drill" && (
									<Flashcard
										key={step.word.id}
										word={step.word}
										onGrade={(grade) => handleWordGrade(step.word.id, grade)}
									/>
								)}

								{step.kind === "grammar" && (
									<GrammarCheckCard
										key={step.concept.id}
										concept={step.concept}
										onGrade={(grade) =>
											handleGrammarGrade(step.concept.id, grade)
										}
									/>
								)}

								{step.kind === "sense" && (
									<SenseCheck
										key={step.item.id}
										item={step.item}
										onGrade={(grade) => handleSenseGrade(step.item.id, grade)}
									/>
								)}

								{step.kind === "compound" && (
									<CompoundBuilder
										key={step.compound.id}
										compound={step.compound}
										vocabulary={vocabularyIds}
										onNext={advance}
									/>
								)}

								{step.kind === "build" && (
									<SentenceBuilder
										key={`build-${step.scene.id}`}
										sentence={step.scene.referenceSentences[0]}
										onNext={advance}
									/>
								)}

								{step.kind === "context" && (
									<ContextExercise
										key={`context-${step.scene.id}`}
										scene={step.scene}
										vocabulary={vocabulary}
										onNext={advance}
									/>
								)}

								{step.kind === "dialogue" && (
									<DialogueExercise
										key={step.dialogue.id}
										dialogue={step.dialogue}
										vocabulary={vocabulary}
										onNext={advance}
									/>
								)}
							</>
						)
					)}
				</div>
			</main>

			{!finished && step?.kind === "intro" && (
				<button
					type="button"
					onClick={advance}
					className={`${PRIMARY_BUTTON} max-w-sm shrink-0 cursor-pointer`}
				>
					{index === 0 ? "Start drilling" : "Keep going"}
				</button>
			)}
		</div>
	);
}
