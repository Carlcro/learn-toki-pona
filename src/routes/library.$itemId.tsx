import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CozyPanel } from "#/components/CozyPanel";
import { PageHeader } from "#/components/PageHeader";
import { ReadingPassage } from "#/components/ReadingPassage";
import { LESSONS } from "#/data/lessons";
import { getLibraryItemById, LIBRARY_ITEMS } from "#/data/library";
import type { WordId } from "#/data/types";
import { WORDS_BY_ID } from "#/data/words";
import {
	selectItemStatus,
	selectKnownConceptIds,
	selectKnownWordIds,
	selectLibraryStatuses,
} from "#/lib/library";
import {
	recordStudyActivity,
	scheduleForReview,
	useProgressState,
} from "#/lib/store";

export const Route = createFileRoute("/library/$itemId")({
	loader: ({ params }) => {
		const item = getLibraryItemById(params.itemId);
		if (!item) throw notFound();
		return item;
	},
	component: LibraryItemPage,
});

const PRIMARY_BUTTON =
	"w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night";
const SECONDARY_BUTTON =
	"w-full rounded-full border-2 border-night bg-lavender px-6 py-3 text-center font-display text-sm font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-night";
// Opaque fill, not a transparent outline: these sit low on the page, where the
// fixed treeline would otherwise read straight through the label.
const OUTLINE_BUTTON =
	"w-full rounded-full border-2 border-night-edge bg-night-soft px-6 py-3 text-center font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream";

function LibraryItemPage() {
	const item = Route.useLoaderData();
	const { cards, completedLessonIds } = useProgressState();
	const [lookedUp, setLookedUp] = useState<ReadonlySet<string>>(new Set());
	const [revealed, setRevealed] = useState(false);
	const [finished, setFinished] = useState(false);
	const [scheduled, setScheduled] = useState(false);

	const knownWordIds = selectKnownWordIds(cards);
	const knownConceptIds = selectKnownConceptIds(completedLessonIds, LESSONS);
	const status = selectItemStatus(item, knownWordIds, knownConceptIds);

	const statuses = selectLibraryStatuses(
		LIBRARY_ITEMS,
		knownWordIds,
		knownConceptIds,
	);
	const currentIndex = statuses.findIndex((entry) => entry.item.id === item.id);
	const nextReadable = statuses
		.slice(currentIndex + 1)
		.find((entry) => entry.readable)?.item;
	const nextHref: string = nextReadable
		? `/library/${nextReadable.id}`
		: "/library";

	const weakWordIds = [...lookedUp].filter(
		(wordId): wordId is WordId => wordId in WORDS_BY_ID,
	);

	function handleLookUp(wordId: string) {
		setLookedUp((previous) =>
			previous.has(wordId) ? previous : new Set(previous).add(wordId),
		);
	}

	function handleFinish() {
		recordStudyActivity(new Date());
		setFinished(true);
	}

	function handleScheduleReview() {
		scheduleForReview(weakWordIds, new Date());
		setScheduled(true);
	}

	return (
		<div className="flex min-h-screen flex-col items-center gap-10 px-6 py-16">
			<PageHeader
				label={item.title}
				backTo="/library"
				backLabel="Back to the library"
			/>

			<main className="flex w-full max-w-sm flex-col items-center gap-6">
				{!status.readable ? (
					<>
						<CozyPanel>
							<div className="flex flex-col items-center gap-3 text-center">
								<span className="font-display text-xl font-bold text-cream">
									Not open yet
								</span>
								<p className="font-sans text-sm text-mist">
									{status.missingWordIds.length > 0
										? `This piece uses ${status.missingWordIds.length} word${
												status.missingWordIds.length === 1 ? "" : "s"
											} you haven't learned yet: ${status.missingWordIds.join(", ")}.`
										: "This piece uses grammar the lessons haven't covered yet."}
								</p>
							</div>
						</CozyPanel>
						<Link to="/library" className={OUTLINE_BUTTON}>
							Back to the library
						</Link>
					</>
				) : (
					<>
						<CozyPanel>
							<ReadingPassage
								item={item}
								revealed={revealed}
								lookedUp={lookedUp}
								onLookUp={handleLookUp}
							/>
						</CozyPanel>

						{finished ? (
							<CozyPanel>
								<div className="flex flex-col items-center gap-4 text-center">
									{weakWordIds.length === 0 ? (
										<span className="font-script text-2xl text-pink">
											You read that with no help at all!
										</span>
									) : (
										<>
											<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
												Words you looked up
											</span>
											<div className="flex flex-wrap justify-center gap-2">
												{weakWordIds.map((wordId) => (
													<span
														key={wordId}
														className="rounded-full border-2 border-night-edge px-3 py-1 font-display text-sm font-bold text-lavender"
													>
														{wordId}
													</span>
												))}
											</div>
											{scheduled ? (
												<p className="font-sans text-sm text-mist">
													Moved into today's review — no penalty to their
													scheduling, just an earlier look.
												</p>
											) : (
												<button
													type="button"
													onClick={handleScheduleReview}
													className={SECONDARY_BUTTON}
												>
													Review {weakWordIds.length} word
													{weakWordIds.length === 1 ? "" : "s"} today
												</button>
											)}
										</>
									)}
								</div>
							</CozyPanel>
						) : (
							<button
								type="button"
								onClick={() => (revealed ? handleFinish() : setRevealed(true))}
								className={PRIMARY_BUTTON}
							>
								{revealed ? "Done reading" : "Check the translation"}
							</button>
						)}

						{finished && nextReadable && (
							<Link to={nextHref} className={PRIMARY_BUTTON}>
								Read the next piece
							</Link>
						)}

						<Link to="/library" className={OUTLINE_BUTTON}>
							Back to the library
						</Link>
					</>
				)}
			</main>
		</div>
	);
}
