import { useMemo, useState } from "react";
import type { Dialogue, DialogueLearnerTurn, DialogueTurn } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import { checkReply } from "#/lib/dialogue";
import type { ValidationError } from "#/lib/grammar-validator";
import { CozyPanel } from "./CozyPanel";
import { SpeakerButton } from "./SpeakerButton";
import { VALIDATION_MESSAGES } from "./validation-messages";

/** How many misses before the exercise offers a way out. */
const RESCUE_AFTER = 2;

/**
 * The app's own lines need no answer, so they are never "current" — they land
 * in the transcript the moment the turn before them resolves. Several can run
 * together, which is how a dialogue ends on the app having the last word.
 */
function advanceThroughAppTurns(turns: DialogueTurn[], from: number): number {
	let index = from;
	while (index < turns.length && turns[index].speaker === "app") index += 1;
	return index;
}

/**
 * A turn paired with a key that stays put. The script is fixed data that never
 * reorders, so a turn's position in it *is* its identity — this just settles
 * that identity once instead of at every render of the transcript.
 */
interface KeyedTurn {
	key: string;
	turn: DialogueTurn;
}

export function DialogueExercise({
	dialogue,
	vocabulary,
	onNext,
}: {
	dialogue: Dialogue;
	/** Every word taught up to this lesson — same set ContextExercise gets. */
	vocabulary: Set<string>;
	onNext: () => void;
}) {
	const script = useMemo<KeyedTurn[]>(
		() =>
			dialogue.turns.map((turn, index) => ({
				key: `${dialogue.id}-${index}`,
				turn,
			})),
		[dialogue],
	);

	// Turns before this index are settled and shown in the transcript; the turn
	// at it, if any, is the one waiting on the learner.
	const [resolved, setResolved] = useState(() =>
		advanceThroughAppTurns(dialogue.turns, 0),
	);
	const [replies, setReplies] = useState<Record<string, string>>({});
	const [input, setInput] = useState("");
	const [feedback, setFeedback] = useState<string | null>(null);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [revealed, setRevealed] = useState(false);

	const current = dialogue.turns[resolved] as DialogueLearnerTurn | undefined;
	const wordBank = (current?.hintWordIds ?? []).filter((wordId) =>
		vocabulary.has(wordId),
	);

	function handleSubmit() {
		if (!current) return;
		const result = checkReply(current, input, vocabulary);
		if (!result.ok) {
			setFailedAttempts(failedAttempts + 1);
			setFeedback(describeFailure(result.reason, result.token));
			return;
		}
		setReplies({ ...replies, [script[resolved].key]: input.trim() });
		setResolved(advanceThroughAppTurns(dialogue.turns, resolved + 1));
		setInput("");
		setFeedback(null);
		setFailedAttempts(0);
		setRevealed(false);
	}

	return (
		<CozyPanel>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col items-center gap-1">
					<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
						Talk with them
					</span>
					<span className="font-script text-2xl text-cream">
						{dialogue.title}
					</span>
				</div>

				<div className="flex flex-col gap-3">
					{script.slice(0, resolved).map(({ key, turn }) =>
						turn.speaker === "app" ? (
							<div
								key={key}
								className="flex max-w-[85%] items-center gap-2 self-start rounded-2xl border-2 border-night-edge bg-night px-4 py-3"
							>
								<div className="flex flex-col">
									<span className="font-display text-sm font-bold text-cream">
										{turn.toki}
									</span>
									<span className="font-sans text-xs text-mist">{turn.en}</span>
								</div>
								<SpeakerButton text={turn.toki} />
							</div>
						) : (
							<div
								key={key}
								className="flex max-w-[85%] flex-col items-end gap-1 self-end"
							>
								<span className="rounded-2xl border-2 border-lavender-dim bg-lavender px-4 py-2 font-display text-sm font-bold text-night">
									{replies[key]}
								</span>
								<span className="text-right font-sans text-[0.65rem] text-mist">
									You could also say: {turn.references.join(" · ")}
								</span>
							</div>
						),
					)}
				</div>

				{current ? (
					<div className="flex flex-col items-center gap-4 border-t border-night-edge pt-4">
						<span className="text-center font-sans text-sm text-mist">
							{current.prompt}
						</span>

						{/* The bank is a nudge, not a boundary: any taught word is accepted. */}
						{wordBank.length > 0 && (
							<div className="flex flex-wrap justify-center gap-1.5">
								{wordBank.map((wordId) => (
									<button
										key={wordId}
										type="button"
										onClick={() =>
											setInput((currentInput) =>
												currentInput.length === 0
													? WORDS_BY_ID[wordId].toki
													: `${currentInput.trimEnd()} ${WORDS_BY_ID[wordId].toki}`,
											)
										}
										className="rounded-full border-2 border-night-edge px-3 py-1 font-display text-xs font-bold text-mist transition-colors hover:border-lavender hover:text-cream"
									>
										{WORDS_BY_ID[wordId].toki}
									</button>
								))}
							</div>
						)}

						<input
							type="text"
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder="mi pilin pona."
							autoCapitalize="none"
							autoCorrect="off"
							spellCheck={false}
							aria-label="Your reply"
							className="w-full rounded-full border-2 border-night-edge bg-night px-4 py-3 font-sans text-sm text-cream outline-none placeholder:text-mist/60 focus-visible:border-lavender"
						/>

						{feedback && (
							<span className="text-center font-script text-xl text-mist">
								{feedback}
							</span>
						)}

						<button
							type="button"
							onClick={handleSubmit}
							disabled={input.trim().length === 0}
							className="w-full rounded-full border-2 border-night bg-lavender px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90 disabled:opacity-40"
						>
							Reply
						</button>

						{/* A stuck learner should get out with the answer in hand, not by
						    skipping the turn — tapping the reply loads it to be sent. */}
						{failedAttempts >= RESCUE_AFTER &&
							(revealed ? (
								<button
									type="button"
									onClick={() => setInput(current.references[0])}
									className="rounded-full border-2 border-night-edge px-4 py-2 font-display text-sm font-bold text-cream transition-colors hover:border-lavender"
								>
									{current.references[0]}
								</button>
							) : (
								<button
									type="button"
									onClick={() => setRevealed(true)}
									className="w-full rounded-full border-2 border-night-edge bg-night-soft px-5 py-3 font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream"
								>
									Show me a reply
								</button>
							))}
					</div>
				) : (
					<button
						type="button"
						onClick={onNext}
						className="w-full rounded-full border-2 border-night bg-pink px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90"
					>
						Continue
					</button>
				)}
			</div>
		</CozyPanel>
	);
}

/**
 * missing-word is handled here rather than in the shared map because it is the
 * one failure that is not about form at all — the sentence was fine, it just
 * answered a different question — and, like unknown-word, it reads far better
 * with the word itself named in the message.
 */
function describeFailure(
	reason: ValidationError | "missing-word",
	token?: string,
): string {
	if (reason === "missing-word" && token) {
		return `Well formed — but it doesn't answer the question. Try using “${token}”.`;
	}
	if (reason === "unknown-word" && token) {
		return `The course hasn't taught “${token}” yet.`;
	}
	return reason === "missing-word"
		? "That doesn't answer the question yet."
		: VALIDATION_MESSAGES[reason];
}
