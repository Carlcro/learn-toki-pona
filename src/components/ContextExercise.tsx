import { useState } from "react";
import type { Scene } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import { type ValidationError, validateLiE } from "#/lib/grammar-validator";
import { CozyPanel } from "./CozyPanel";
import { SCENE_REGISTRY } from "./scenes/registry";

const VALIDATION_MESSAGES: Record<ValidationError, string> = {
	empty: "Write a sentence before submitting.",
	"unknown-word": "The course hasn't taught that word yet.",
	"missing-li": "This subject needs li before the predicate.",
	"unexpected-li": "Drop li — it's left out after a bare mi or sina.",
	"empty-subject": "The sentence needs a subject before li.",
	"empty-predicate": "The sentence needs a predicate.",
	"empty-object": "e needs an object after it.",
	"dangling-ala": "ala goes after the word it cancels, not in front of it.",
	"trailing-tokens":
		"This sentence has more structure than the course covers so far.",
};

export function ContextExercise({
	scene,
	vocabulary,
	onNext,
}: {
	scene: Scene;
	/** Every word taught up to this lesson — the fair boundary for an answer. */
	vocabulary: Set<string>;
	onNext: () => void;
}) {
	const [sentence, setSentence] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [valid, setValid] = useState(false);
	const [message, setMessage] = useState("");

	const SceneImage = SCENE_REGISTRY[scene.svgKey];
	const wordBank = scene.allowedWordIds.filter((wordId) =>
		vocabulary.has(wordId),
	);

	function handleSubmit() {
		const result = validateLiE(sentence, vocabulary);
		setSubmitted(true);
		setValid(result.valid);
		if (result.valid) {
			setMessage("That's well formed — nice work!");
			return;
		}
		setMessage(
			result.reason === "unknown-word" && result.token
				? `The course hasn't taught “${result.token}” yet.`
				: VALIDATION_MESSAGES[result.reason],
		);
	}

	return (
		<CozyPanel>
			<div className="flex flex-col items-center gap-5">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Describe this scene
				</span>

				<div className="w-full max-w-[220px] rounded-2xl border-2 border-night-edge bg-night px-4 py-4 text-lavender">
					{SceneImage && <SceneImage />}
				</div>

				{/* The bank is a nudge, not a boundary: any taught word is accepted. */}
				{!submitted && wordBank.length > 0 && (
					<div className="flex w-full flex-col items-center gap-2">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							Words that might help
						</span>
						<div className="flex flex-wrap justify-center gap-1.5">
							{wordBank.map((wordId) => (
								<button
									key={wordId}
									type="button"
									onClick={() =>
										setSentence((current) =>
											current.length === 0
												? WORDS_BY_ID[wordId].toki
												: `${current.trimEnd()} ${WORDS_BY_ID[wordId].toki}`,
										)
									}
									className="rounded-full border-2 border-night-edge px-3 py-1 font-display text-xs font-bold text-mist transition-colors hover:border-lavender hover:text-cream"
								>
									{WORDS_BY_ID[wordId].toki}
								</button>
							))}
						</div>
					</div>
				)}

				<input
					type="text"
					value={sentence}
					onChange={(event) => setSentence(event.target.value)}
					placeholder="jan li moku e telo."
					disabled={submitted}
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck={false}
					aria-label="Your sentence describing the scene"
					className="w-full rounded-full border-2 border-night-edge bg-night px-4 py-3 font-sans text-sm text-cream outline-none placeholder:text-mist/60 focus-visible:border-lavender disabled:opacity-70"
				/>

				{!submitted ? (
					<button
						type="button"
						onClick={handleSubmit}
						disabled={sentence.trim().length === 0}
						className="w-full rounded-full bg-lavender px-5 py-3 font-display text-sm font-bold text-night transition-all active:brightness-90 disabled:opacity-40"
					>
						Submit
					</button>
				) : (
					<div className="flex w-full flex-col items-center gap-4">
						<span
							className={`text-center font-script text-2xl ${valid ? "text-pink" : "text-mist"}`}
						>
							{message}
						</span>

						<div className="flex w-full flex-col items-center gap-1.5 border-t border-night-edge pt-4">
							<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
								A few ways to say it
							</span>
							{scene.referenceSentences.map((example) => (
								<span key={example} className="font-sans text-sm text-mist">
									{example}
								</span>
							))}
						</div>

						<button
							type="button"
							onClick={onNext}
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
