import { useState } from "react";
import type { LibraryItem, WordId } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import { SpeakerButton } from "./SpeakerButton";

/** Strips sentence punctuation from a display token to get its word id. */
function wordIdOf(displayToken: string): string {
	return displayToken.toLowerCase().replace(/[.!?,]/g, "");
}

export function ReadingPassage({
	item,
	revealed,
	lookedUp,
	onLookUp,
}: {
	item: LibraryItem;
	revealed: boolean;
	lookedUp: ReadonlySet<string>;
	onLookUp: (wordId: string) => void;
}) {
	const [activeWordId, setActiveWordId] = useState<string | null>(null);
	const activeWord = activeWordId
		? WORDS_BY_ID[activeWordId as WordId]
		: undefined;

	function handleWordClick(wordId: string) {
		setActiveWordId(wordId === activeWordId ? null : wordId);
		onLookUp(wordId);
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex flex-col gap-5">
				{item.lines.map((line) => (
					<div key={line.toki} className="flex flex-col gap-2">
						<div className="flex items-start gap-2">
							<p className="flex flex-1 flex-wrap items-center gap-x-1 gap-y-2">
								{line.toki.split(" ").map((displayToken, index) => {
									const wordId = wordIdOf(displayToken);
									const isActive = wordId === activeWordId;
									const isLookedUp = lookedUp.has(wordId);
									return (
										<button
											// biome-ignore lint/suspicious/noArrayIndexKey: a word can repeat within a line, so position is the only stable identity
											key={`${wordId}-${index}`}
											type="button"
											onClick={() => handleWordClick(wordId)}
											aria-label={`Show the meaning of ${wordId}`}
											className={`rounded-full px-2 py-0.5 font-display text-2xl font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lavender ${
												isActive
													? "bg-lavender text-night"
													: isLookedUp
														? "text-lavender hover:text-cream"
														: "text-cream hover:text-lavender"
											}`}
										>
											{displayToken}
										</button>
									);
								})}
							</p>
							<div className="pt-1.5">
								<SpeakerButton text={line.toki} />
							</div>
						</div>

						{revealed && (
							<p className="px-2 font-sans text-sm text-mist">{line.en}</p>
						)}
					</div>
				))}
			</div>

			{/* Reserved space so revealing a gloss never shifts the text above it. */}
			<div className="flex min-h-20 items-center justify-center rounded-[28px] border-2 border-night-edge px-4 py-3 text-center">
				{activeWord ? (
					<div className="flex flex-col gap-0.5">
						<span className="font-sans text-sm font-semibold text-cream">
							{activeWord.toki}: {activeWord.gloss}
						</span>
						<span className="font-sans text-xs text-mist">
							{activeWord.definition}
						</span>
					</div>
				) : (
					<span className="font-sans text-xs text-mist">
						Tap any word you're unsure of to see what it means.
					</span>
				)}
			</div>
		</div>
	);
}
