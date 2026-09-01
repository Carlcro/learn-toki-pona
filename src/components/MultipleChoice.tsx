import { useMemo, useState } from "react";
import type { Word } from "#/data/types";
import { CozyPanel } from "./CozyPanel";

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

const OPTION_COUNT = 4;

/**
 * Words of the same role first, so particles compete with particles and
 * content words with content words. Drawing from the whole dictionary lets a
 * learner answer by recognising which options they have never seen before,
 * which tests nothing.
 */
function pickDistractors(word: Word, pool: Word[], count: number): Word[] {
	const others = pool.filter((candidate) => candidate.id !== word.id);
	const sameRole = shuffle(
		others.filter((candidate) => candidate.role === word.role),
	);
	const rest = shuffle(
		others.filter((candidate) => candidate.role !== word.role),
	);
	return [...sameRole, ...rest].slice(0, count);
}

export function MultipleChoice({
	word,
	pool,
	onNext,
}: {
	word: Word;
	/** Only what the learner has been taught so far — never the full dictionary. */
	pool: Word[];
	onNext: () => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);

	const options = useMemo(
		() => shuffle([word, ...pickDistractors(word, pool, OPTION_COUNT - 1)]),
		[word, pool],
	);

	const answered = selected !== null;
	const isCorrect = selected === word.id;

	function handleSelect(optionId: string) {
		if (answered) return;
		setSelected(optionId);
	}

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Which word means this?
				</span>
				<span className="text-center font-display text-xl font-bold text-cream">
					{word.gloss}
				</span>

				<div className="flex w-full flex-col gap-2">
					{options.map((option) => {
						const showCorrect = answered && option.id === word.id;
						const showWrong =
							answered && selected === option.id && option.id !== word.id;
						return (
							<button
								key={option.id}
								type="button"
								onClick={() => handleSelect(option.id)}
								disabled={answered}
								className={`rounded-full border-2 px-5 py-3 text-left font-display text-base font-bold transition-all disabled:cursor-default ${
									showCorrect
										? "border-pink bg-pink text-night"
										: showWrong
											? "border-night-edge text-mist"
											: "border-night-edge text-cream hover:border-lavender"
								}`}
							>
								{option.toki}
							</button>
						);
					})}
				</div>

				{answered && (
					<>
						<span
							className={`font-script text-xl ${isCorrect ? "text-pink" : "text-mist"}`}
						>
							{isCorrect ? "Nice — that's right!" : `That's ${word.toki}.`}
						</span>
						<button
							type="button"
							onClick={onNext}
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
