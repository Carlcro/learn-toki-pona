import { useMemo, useState } from "react";
import { CozyPanel } from "./CozyPanel";
import { RevealSlot } from "./RevealSlot";

interface Chip {
	id: number;
	text: string;
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/**
 * Chips carry bare words. Leaving the closing punctuation on would both look
 * careless and hand over which word ends the sentence — which matters now that
 * questions like "telo li pona ala pona?" are in the course.
 */
function toChips(sentence: string): Chip[] {
	return sentence
		.replace(/[.!?]+$/, "")
		.split(" ")
		.map((text, id) => ({ id, text }));
}

const CHIP_BASE =
	"rounded-full border-2 px-4 py-2 font-display text-sm font-bold transition-all disabled:cursor-default";

export function SentenceBuilder({
	sentence,
	onNext,
}: {
	sentence: string;
	onNext: () => void;
}) {
	const targetChips = useMemo(() => toChips(sentence), [sentence]);
	const [available, setAvailable] = useState(() => shuffle(targetChips));
	const [chosen, setChosen] = useState<Chip[]>([]);
	const [checked, setChecked] = useState(false);

	function pick(chip: Chip) {
		if (checked) return;
		setAvailable(available.filter((c) => c.id !== chip.id));
		setChosen([...chosen, chip]);
	}

	function removeChosen(chip: Chip) {
		if (checked) return;
		setChosen(chosen.filter((c) => c.id !== chip.id));
		setAvailable([...available, chip]);
	}

	const isCorrect = chosen
		.map((c) => c.id)
		.every((id, i) => id === targetChips[i]?.id);

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Put the words in order
				</span>

				<div className="flex min-h-14 w-full flex-wrap items-center gap-2 rounded-2xl border-2 border-night-edge bg-night px-3 py-3">
					{chosen.length === 0 && (
						<span className="font-sans text-sm text-mist/60">
							Tap words below
						</span>
					)}
					{chosen.map((chip) => (
						<button
							key={chip.id}
							type="button"
							onClick={() => removeChosen(chip)}
							disabled={checked}
							className={`${CHIP_BASE} border-lavender-dim bg-lavender text-night`}
						>
							{chip.text}
						</button>
					))}
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					{available.map((chip) => (
						<button
							key={chip.id}
							type="button"
							onClick={() => pick(chip)}
							disabled={checked}
							className={`${CHIP_BASE} border-night-edge text-cream hover:border-lavender`}
						>
							{chip.text}
						</button>
					))}
				</div>

				<RevealSlot
					show={checked}
					placeholder={
						<span className="text-center font-script text-xl">
							It's: {sentence}
						</span>
					}
				>
					<span
						className={`text-center font-script text-xl ${isCorrect ? "text-pink" : "text-mist"}`}
					>
						{isCorrect ? "Nice, that's right!" : `It's: ${sentence}`}
					</span>
				</RevealSlot>

				{!checked ? (
					<button
						type="button"
						onClick={() => setChecked(true)}
						disabled={available.length > 0}
						className="w-full rounded-full border-2 border-night bg-lavender px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90 disabled:opacity-40"
					>
						Check
					</button>
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
