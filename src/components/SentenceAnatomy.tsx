import type { AnnotatedExample } from "#/data/types";
import { SpeakerButton } from "./SpeakerButton";

/**
 * A sentence cut into its pieces, each piece labelled with the job it does.
 *
 * This exists because the grammar it teaches cannot be explained in words
 * without either using grammar-school terms a learner may never have met, or
 * writing a paragraph that says less than one picture. Showing where the
 * sentence splits is the explanation.
 */
export function SentenceAnatomy({ example }: { example: AnnotatedExample }) {
	const toki = example.chunks.map((chunk) => chunk.text).join(" ");

	return (
		<div className="flex w-full flex-col gap-2.5">
			<div className="flex items-start justify-center gap-2">
				<div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-3">
					{example.chunks.map((chunk, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: a word can repeat in one sentence, so position is the only stable identity
							key={`${chunk.text}-${index}`}
							className="flex flex-col items-center gap-1.5"
						>
							<span
								className={`font-display text-lg font-bold ${
									chunk.particle ? "text-lavender" : "text-cream"
								}`}
							>
								{chunk.text}
							</span>
							{/* The tick ties a label to its piece; a piece with no label
							    (a bare glue word) gets neither, so nothing dangles. */}
							{chunk.label && (
								<>
									<span className="h-2 w-px bg-night-edge" />
									<span className="max-w-[7.5rem] text-center font-sans text-[0.65rem] leading-tight text-mist">
										{chunk.label}
									</span>
								</>
							)}
						</div>
					))}
				</div>
				<SpeakerButton text={toki} />
			</div>

			<p className="text-center font-script text-lg text-pink">{example.en}</p>
		</div>
	);
}
