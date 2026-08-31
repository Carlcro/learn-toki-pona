import { useEffect, useState } from "react";
import type { Word } from "#/data/types";
import { useSpeechSynthesis } from "#/hooks/useSpeechSynthesis";
import type { Grade } from "#/lib/srs";
import { CozyPanel } from "./CozyPanel";
import { GradeButtons } from "./GradeButtons";

export function ListeningFlashcard({
	word,
	onGrade,
}: {
	word: Word;
	onGrade: (grade: Grade) => void;
}) {
	const { isSupported, speak } = useSpeechSynthesis();
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		speak(word.toki);
	}, [word.toki, speak]);

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-6 py-2">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Listen and recall
				</span>

				<button
					type="button"
					onClick={() => speak(word.toki)}
					disabled={!isSupported}
					aria-label={`Replay pronunciation of ${word.toki}`}
					className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-lavender text-lavender transition-all active:brightness-90 disabled:opacity-40"
				>
					<svg
						viewBox="0 0 20 20"
						width="24"
						height="24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M3 8v4h3l4 3V5L6 8H3z" />
						<path d="M13.5 7.5a3.5 3.5 0 0 1 0 5" />
						<path d="M15.8 5.2a7 7 0 0 1 0 9.6" />
					</svg>
				</button>

				{!isSupported && (
					<span className="text-center font-sans text-xs text-mist">
						Speech playback isn't supported in this browser.
					</span>
				)}

				{revealed ? (
					<div className="flex w-full flex-col items-center gap-4">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="font-display text-2xl font-bold text-cream">
								{word.toki}
							</span>
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
						Show word
					</button>
				)}

				{revealed && <GradeButtons onGrade={onGrade} />}
			</div>
		</CozyPanel>
	);
}
