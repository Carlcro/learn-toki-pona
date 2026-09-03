import { useMemo, useState } from "react";
import type { SenseItem } from "#/data/types";
import type { Grade } from "#/lib/srs";
import { CozyPanel } from "./CozyPanel";
import { RevealSlot } from "./RevealSlot";
import { SpeakerButton } from "./SpeakerButton";

const CONTINUE_BUTTON =
	"w-full rounded-full border-2 border-night bg-pink px-5 py-3 text-center font-display text-sm font-bold text-night transition-all active:brightness-90";

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function stripPunctuation(token: string): string {
	return token.toLowerCase().replace(/[.!?,]/g, "");
}

/**
 * Asks what one word is doing in one sentence. Toki Pona words cover whole
 * fields of meaning and take their part of speech from position, so reading the
 * slot is the actual skill — a gloss-matching drill trains the opposite habit.
 *
 * Like the grammar check, the answer is right or wrong on its face, so the card
 * grades itself. There is no "easy": a learner cannot meaningfully self-rate
 * how well they read a slot they have just been shown the answer to.
 */
export function SenseCheck({
	item,
	onGrade,
}: {
	item: SenseItem;
	onGrade: (grade: Grade) => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const options = useMemo(() => shuffle(item.options), [item.options]);

	const answered = selected !== null;
	const isCorrect = selected === item.answer;

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					What does {item.wordId} mean here?
				</span>

				<div className="flex items-center gap-2">
					<p className="flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-center">
						{item.sentence.split(" ").map((token, index) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: a word can repeat in a sentence, so position is the only stable identity
								key={`${token}-${index}`}
								className={`font-display text-xl font-bold ${
									stripPunctuation(token) === item.wordId
										? "text-pink"
										: "text-cream"
								}`}
							>
								{token}
							</span>
						))}
					</p>
					<SpeakerButton text={item.sentence} />
				</div>

				<div className="flex w-full flex-col gap-2">
					{options.map((option) => {
						const showCorrect = answered && option === item.answer;
						const showWrong =
							answered && selected === option && option !== item.answer;
						return (
							<button
								key={option}
								type="button"
								onClick={() => !answered && setSelected(option)}
								disabled={answered}
								className={`rounded-full border-2 px-5 py-3 text-left font-sans text-sm font-semibold transition-all disabled:cursor-default ${
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

				<RevealSlot
					show={answered}
					placeholder={
						<>
							<span className="text-center font-script text-xl">
								It's “{item.answer}” here.
							</span>
							<p className="text-center font-sans text-xs">{item.note}</p>
							<span className={CONTINUE_BUTTON}>Continue</span>
						</>
					}
				>
					<span
						className={`text-center font-script text-xl ${isCorrect ? "text-pink" : "text-mist"}`}
					>
						{isCorrect ? "Exactly." : `It's “${item.answer}” here.`}
					</span>
					<p className="text-center font-sans text-xs text-mist">{item.note}</p>
					<button
						type="button"
						onClick={() => onGrade(isCorrect ? "good" : "again")}
						className={CONTINUE_BUTTON}
					>
						Continue
					</button>
				</RevealSlot>
			</div>
		</CozyPanel>
	);
}
