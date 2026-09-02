import { useMemo, useState } from "react";
import type { GrammarConcept } from "#/data/types";
import type { Grade } from "#/lib/srs";
import { CozyPanel } from "./CozyPanel";
import { SentenceAnatomy } from "./SentenceAnatomy";

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/**
 * Grammar on the same schedule as vocabulary. The answer is right or wrong on
 * its face, so the card grades itself rather than asking the learner to rate
 * their own recall — self-report is where an SRS quietly goes wrong.
 */
export function GrammarCheckCard({
	concept,
	onGrade,
}: {
	concept: GrammarConcept;
	onGrade: (grade: Grade) => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const options = useMemo(
		() => shuffle(concept.check.options),
		[concept.check.options],
	);

	const answered = selected !== null;
	const isCorrect = selected === concept.check.answer;

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Grammar: {concept.name}
				</span>
				<span className="text-center font-display text-lg font-bold text-cream">
					{concept.check.question}
				</span>

				<div className="flex w-full flex-col gap-2">
					{options.map((option) => {
						const showCorrect = answered && option === concept.check.answer;
						const showWrong =
							answered &&
							selected === option &&
							option !== concept.check.answer;
						return (
							<button
								key={option}
								type="button"
								onClick={() => !answered && setSelected(option)}
								disabled={answered}
								className={`rounded-full border-2 px-5 py-3 text-left font-display text-base font-bold transition-all disabled:cursor-default ${
									showCorrect
										? "border-pink bg-pink text-night"
										: showWrong
											? "border-night-edge text-mist line-through"
											: "border-night-edge text-cream hover:border-lavender"
								}`}
							>
								{option}
							</button>
						);
					})}
				</div>

				{answered && (
					<>
						<span
							className={`font-script text-xl ${isCorrect ? "text-pink" : "text-mist"}`}
						>
							{isCorrect ? "Right." : "Not quite."}
						</span>
						<p className="text-center font-sans text-xs text-mist">
							{concept.explanation}
						</p>
						{/* One worked example on the reveal, not the whole set: the
						    reminder should fit on the card the learner just answered. */}
						{concept.examples[0] && (
							<SentenceAnatomy example={concept.examples[0]} />
						)}
						<button
							type="button"
							onClick={() => onGrade(isCorrect ? "good" : "again")}
							className="w-full rounded-full border-2 border-night bg-pink px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90"
						>
							Continue
						</button>
					</>
				)}
			</div>
		</CozyPanel>
	);
}
