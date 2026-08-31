import { useMemo, useState } from "react";
import type { Compound, WordId } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import { CozyPanel } from "./CozyPanel";
import { SpeakerButton } from "./SpeakerButton";

interface Chip {
	key: string;
	wordId: WordId;
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

const DISTRACTOR_COUNT = 3;

const CHIP_BASE =
	"rounded-full border-2 px-4 py-2 font-display text-sm font-bold transition-all disabled:cursor-default";

/**
 * Toki Pona has no word for "phone" — you build one. Composition is the move
 * that lets 137 words cover everything, so it gets practised directly instead
 * of being left to emerge from reading.
 */
export function CompoundBuilder({
	compound,
	vocabulary,
	onNext,
}: {
	compound: Compound;
	/** Words taught so far, used to draw plausible wrong chips. */
	vocabulary: WordId[];
	onNext: () => void;
}) {
	const chips = useMemo(() => {
		const answerChips: Chip[] = compound.answer.map((wordId, index) => ({
			key: `answer-${index}`,
			wordId,
		}));
		const distractors = shuffle(
			vocabulary.filter((wordId) => !compound.answer.includes(wordId)),
		)
			.slice(0, DISTRACTOR_COUNT)
			.map((wordId, index) => ({ key: `extra-${index}`, wordId }));
		return shuffle([...answerChips, ...distractors]);
	}, [compound, vocabulary]);

	const [chosen, setChosen] = useState<Chip[]>([]);
	const [checked, setChecked] = useState(false);

	const available = chips.filter(
		(chip) => !chosen.some((picked) => picked.key === chip.key),
	);
	const isCorrect =
		chosen.length === compound.answer.length &&
		chosen.every((chip, index) => chip.wordId === compound.answer[index]);
	const answerText = compound.answer.join(" ");

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Build a way to say
				</span>
				<span className="text-center font-display text-xl font-bold text-cream">
					{compound.en}
				</span>

				<div className="flex min-h-14 w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-night-edge bg-night px-3 py-3">
					{chosen.length === 0 && (
						<span className="font-sans text-sm text-mist/60">
							Tap two words below
						</span>
					)}
					{chosen.map((chip) => (
						<button
							key={chip.key}
							type="button"
							onClick={() =>
								!checked &&
								setChosen(chosen.filter((picked) => picked.key !== chip.key))
							}
							disabled={checked}
							className={`${CHIP_BASE} border-lavender-dim bg-lavender text-night`}
						>
							{WORDS_BY_ID[chip.wordId].toki}
						</button>
					))}
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					{available.map((chip) => (
						<button
							key={chip.key}
							type="button"
							onClick={() => !checked && setChosen([...chosen, chip])}
							disabled={checked}
							className={`${CHIP_BASE} border-night-edge text-cream hover:border-lavender`}
						>
							{WORDS_BY_ID[chip.wordId].toki}
						</button>
					))}
				</div>

				{!checked ? (
					<button
						type="button"
						onClick={() => setChecked(true)}
						disabled={chosen.length === 0}
						className="w-full rounded-full bg-lavender px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90 disabled:opacity-40"
					>
						Check
					</button>
				) : (
					<>
						<div className="flex flex-col items-center gap-1.5 text-center">
							<span
								className={`font-script text-xl ${isCorrect ? "text-pink" : "text-mist"}`}
							>
								{isCorrect ? "That's it." : `It's ${answerText}.`}
							</span>
							<div className="flex items-center gap-2">
								<span className="font-display text-base font-bold text-cream">
									{answerText}
								</span>
								<SpeakerButton text={answerText} />
							</div>
							<span className="font-sans text-xs text-mist">
								literally “{compound.literal}”
							</span>
						</div>
						<button
							type="button"
							onClick={onNext}
							className="w-full rounded-full bg-pink px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90"
						>
							Continue
						</button>
					</>
				)}
			</div>
		</CozyPanel>
	);
}
