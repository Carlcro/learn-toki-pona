import { useState } from "react";
import type { Word } from "#/data/types";
import type { Grade } from "#/lib/srs";
import { CozyPanel } from "./CozyPanel";
import { GradeButtons } from "./GradeButtons";
import { SpeakerButton } from "./SpeakerButton";

export function Flashcard({
	word,
	onGrade,
}: {
	word: Word;
	onGrade: (grade: Grade) => void;
}) {
	const [revealed, setRevealed] = useState(false);

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-6 py-2">
				<div className="flex items-center gap-3">
					<span className="font-display text-4xl font-bold text-cream sm:text-5xl">
						{word.toki}
					</span>
					<SpeakerButton text={word.toki} />
				</div>

				{revealed ? (
					<div className="flex w-full flex-col items-center gap-4">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="font-sans text-sm font-semibold text-cream">
								{word.gloss}
							</span>
							<span className="font-sans text-xs text-mist">
								{word.definition}
							</span>
						</div>

						<div className="flex w-full flex-col items-center gap-1 border-t border-night-edge pt-4 text-center">
							<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
								Example
							</span>
							<span className="font-display text-base font-bold text-cream">
								{word.example.toki}
							</span>
							<span className="font-sans text-xs text-mist">
								{word.example.en}
							</span>
						</div>
					</div>
				) : (
					<button
						type="button"
						onClick={() => setRevealed(true)}
						className="rounded-full border-2 border-night-edge px-5 py-2.5 font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-lavender"
					>
						Show meaning
					</button>
				)}

				{revealed && <GradeButtons onGrade={onGrade} />}
			</div>
		</CozyPanel>
	);
}
