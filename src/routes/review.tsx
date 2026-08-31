import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flashcard } from "#/components/Flashcard";
import { GrammarCheckCard } from "#/components/GrammarCheckCard";
import { ListeningFlashcard } from "#/components/ListeningFlashcard";
import { PageHeader } from "#/components/PageHeader";
import { ProductionCard } from "#/components/ProductionCard";
import { SenseCheck } from "#/components/SenseCheck";
import { StepProgress } from "#/components/StepProgress";
import { GRAMMAR_CONCEPTS_BY_ID } from "#/data/grammar";
import { SENSE_ITEMS_BY_ID } from "#/data/senses";
import type { WordId } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import {
	describeTimeUntil,
	selectNextDueAt,
	selectReviewQueue,
} from "#/lib/progress";
import type { CardKind, Grade, SrsCard } from "#/lib/srs";
import {
	recordGrade,
	recordGrammarGrade,
	recordSenseGrade,
	useProgressState,
} from "#/lib/store";

export const Route = createFileRoute("/review")({
	component: ReviewPage,
});

interface QueueEntry {
	id: string;
	kind: CardKind;
}

/**
 * How a word is tested, escalating as it matures. A word still on the learning
 * steps is only ever shown for recognition; once it has graduated it starts
 * rotating through listening and typed production, because recognition alone
 * builds a learner who can read and not write.
 */
type WordMode = "read" | "listen" | "produce";

function modeFor(card: SrsCard | undefined): WordMode {
	if (!card || card.learningStep !== null) return "read";
	const cycle = card.repetitions % 3;
	if (cycle === 1) return "listen";
	if (cycle === 2) return "produce";
	return "read";
}

const PRIMARY_BUTTON =
	"w-full rounded-full bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night";
const OUTLINE_BUTTON =
	"w-full rounded-full border-2 border-night-edge bg-night-soft px-6 py-3 text-center font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream";

interface Session {
	queue: QueueEntry[];
	size: number;
}

function ReviewPage() {
	const progress = useProgressState();
	const { cards } = progress;

	// The session is fixed at its opening queue rather than recomputed from the
	// clock, so a card answered "again" comes back before the learner leaves
	// instead of quietly reappearing minutes after they've closed the tab.
	//
	// Seeded in an effect, not a useState initialiser: progress lives in
	// localStorage, so the first render on the client is still the server's
	// empty snapshot and a queue built there would always be empty.
	const [session, setSession] = useState<Session | null>(null);
	useEffect(() => {
		if (session !== null) return;
		const queue = selectReviewQueue(progress, new Date()).map((card) => ({
			id: card.id,
			kind: card.kind,
		}));
		setSession({ queue, size: queue.length });
	}, [session, progress]);

	const queue = session?.queue ?? [];
	const sessionSize = session?.size ?? 0;
	const [answeredIds, setAnsweredIds] = useState<ReadonlySet<string>>(
		new Set(),
	);
	// Counts answers, not position, so a card sent to the back of the queue
	// still remounts — otherwise it would come back around already answered,
	// with the solution still on screen.
	const [answerCount, setAnswerCount] = useState(0);

	const current = queue[0];

	function handleGrade(entry: QueueEntry, grade: Grade) {
		const now = new Date();
		if (entry.kind === "grammar") {
			recordGrammarGrade(entry.id, grade, now);
		} else if (entry.kind === "sense") {
			recordSenseGrade(entry.id, grade, now);
		} else {
			recordGrade(entry.id as WordId, grade, now);
		}

		// Failed cards go to the back of this session, not to tomorrow.
		setSession((previous) =>
			previous === null
				? previous
				: {
						...previous,
						queue:
							grade === "again"
								? [...previous.queue.slice(1), previous.queue[0]]
								: previous.queue.slice(1),
					},
		);
		if (grade !== "again") {
			setAnsweredIds((previous) => new Set(previous).add(entry.id));
		}
		setAnswerCount((previous) => previous + 1);
	}

	const nextDueAt = selectNextDueAt(progress, new Date());

	return (
		<div className="flex min-h-screen flex-col items-center gap-10 px-6 py-16">
			<PageHeader label="Review" backTo="/" backLabel="Back home" />

			<main className="flex w-full max-w-sm flex-col items-center gap-6">
				{sessionSize > 0 && (
					<StepProgress
						done={answeredIds.size}
						total={sessionSize}
						label="This session"
					/>
				)}

				{current ? (
					current.kind === "grammar" ? (
						<GrammarCheckCard
							key={`grammar-${current.id}-${answerCount}`}
							concept={GRAMMAR_CONCEPTS_BY_ID[current.id]}
							onGrade={(grade) => handleGrade(current, grade)}
						/>
					) : current.kind === "sense" ? (
						<SenseCheck
							key={`sense-${current.id}-${answerCount}`}
							item={SENSE_ITEMS_BY_ID[current.id]}
							onGrade={(grade) => handleGrade(current, grade)}
						/>
					) : (
						(() => {
							const word = WORDS_BY_ID[current.id as WordId];
							const mode = modeFor(cards[current.id as WordId]);
							const key = `${mode}-${current.id}-${answerCount}`;
							if (mode === "listen") {
								return (
									<ListeningFlashcard
										key={key}
										word={word}
										onGrade={(grade) => handleGrade(current, grade)}
									/>
								);
							}
							if (mode === "produce") {
								return (
									<ProductionCard
										key={key}
										word={word}
										onGrade={(grade) => handleGrade(current, grade)}
									/>
								);
							}
							return (
								<Flashcard
									key={key}
									word={word}
									onGrade={(grade) => handleGrade(current, grade)}
								/>
							);
						})()
					)
				) : session === null ? null : (
					<div className="flex w-full flex-col items-center gap-4 text-center">
						<span className="font-script text-2xl text-pink">
							{sessionSize > 0
								? "That's the whole queue — done."
								: "Nothing is due for review right now."}
						</span>
						{nextDueAt && (
							<p className="font-sans text-sm text-mist">
								{`Next batch comes back ${describeTimeUntil(nextDueAt, new Date())}.`}
							</p>
						)}
						<Link to="/library" className={PRIMARY_BUTTON}>
							Read something instead
						</Link>
					</div>
				)}

				<Link to="/" className={OUTLINE_BUTTON}>
					Back home
				</Link>
			</main>
		</div>
	);
}
