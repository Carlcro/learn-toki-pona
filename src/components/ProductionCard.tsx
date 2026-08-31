import { type FormEvent, useState } from "react";
import type { Word } from "#/data/types";
import type { Grade } from "#/lib/srs";
import { CozyPanel } from "./CozyPanel";
import { SpeakerButton } from "./SpeakerButton";

/**
 * Recall in the hard direction: meaning in, Toki Pona out, typed rather than
 * picked from a list. Recognition-only review produces learners who can read
 * and not write, so the queue mixes this in alongside the reading cards.
 *
 * Typed answers grade themselves — there is nothing to be honest with yourself
 * about once the word is either on screen or not.
 */
export function ProductionCard({
	word,
	onGrade,
}: {
	word: Word;
	onGrade: (grade: Grade) => void;
}) {
	const [answer, setAnswer] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const isCorrect = answer.trim().toLowerCase() === word.toki;

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (answer.trim().length === 0) return;
		setSubmitted(true);
	}

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-6 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Write it in toki pona
				</span>
				<span className="text-center font-display text-2xl font-bold text-cream">
					{word.gloss}
				</span>

				{!submitted ? (
					<form
						onSubmit={handleSubmit}
						className="flex w-full flex-col items-center gap-4"
					>
						<input
							type="text"
							value={answer}
							onChange={(event) => setAnswer(event.target.value)}
							// biome-ignore lint/a11y/noAutofocus: the card exists only to be typed into and is replaced on every answer, so focus belongs here
							autoFocus
							autoCapitalize="none"
							autoCorrect="off"
							spellCheck={false}
							aria-label={`Toki Pona for ${word.gloss}`}
							className="w-full rounded-full border-2 border-night-edge bg-night px-4 py-3 text-center font-display text-lg font-bold text-cream outline-none focus-visible:border-lavender"
						/>
						<button
							type="submit"
							disabled={answer.trim().length === 0}
							className="w-full rounded-full bg-lavender px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90 disabled:opacity-40"
						>
							Check
						</button>
					</form>
				) : (
					<div className="flex w-full flex-col items-center gap-4">
						<span
							className={`font-script text-2xl ${isCorrect ? "text-pink" : "text-mist"}`}
						>
							{isCorrect ? "Nice — that's right!" : "Not this time."}
						</span>

						<div className="flex items-center gap-3">
							<span className="font-display text-3xl font-bold text-cream">
								{word.toki}
							</span>
							<SpeakerButton text={word.toki} />
						</div>

						<div className="flex w-full flex-col items-center gap-1 border-t border-night-edge pt-4 text-center">
							<span className="font-display text-base font-bold text-cream">
								{word.example.toki}
							</span>
							<span className="font-sans text-xs text-mist">
								{word.example.en}
							</span>
						</div>

						<button
							type="button"
							onClick={() => onGrade(isCorrect ? "good" : "again")}
							className="w-full rounded-full bg-pink px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90"
						>
							Continue
						</button>
					</div>
				)}
			</div>
		</CozyPanel>
	);
}
