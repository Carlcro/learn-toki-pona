import { createFileRoute, Link } from "@tanstack/react-router";
import { CozyPanel } from "#/components/CozyPanel";
import { LibraryShelf } from "#/components/LibraryShelf";
import { ReadingMeter } from "#/components/ReadingMeter";
import { ScreenShell } from "#/components/ScreenShell";
import { LESSONS, LESSONS_BY_ID } from "#/data/lessons";
import { LIBRARY_ITEMS } from "#/data/library";
import {
	selectKnownConceptIds,
	selectKnownWordIds,
	selectLibraryProgress,
	selectLibraryStatuses,
	selectUnlockCountForLesson,
} from "#/lib/library";
import { selectNextLessonId } from "#/lib/progress";
import { useProgressState } from "#/lib/store";

export const Route = createFileRoute("/library/")({ component: LibraryPage });

const PRIMARY_BUTTON =
	"w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night";
const OUTLINE_BUTTON =
	"w-full rounded-full border-2 border-night-edge bg-night-soft px-6 py-3 text-center font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream";

function LibraryPage() {
	const { cards, completedLessonIds } = useProgressState();
	const knownWordIds = selectKnownWordIds(cards);
	const knownConceptIds = selectKnownConceptIds(completedLessonIds, LESSONS);
	const statuses = selectLibraryStatuses(
		LIBRARY_ITEMS,
		knownWordIds,
		knownConceptIds,
	);
	const progress = selectLibraryProgress(statuses);

	const nextLessonId = selectNextLessonId(completedLessonIds, LESSONS);
	const nextLesson = nextLessonId ? LESSONS_BY_ID[nextLessonId] : undefined;
	const unlockCount = nextLesson
		? selectUnlockCountForLesson(
				LIBRARY_ITEMS,
				knownWordIds,
				knownConceptIds,
				nextLesson,
			)
		: 0;
	const nextLessonHref: string = nextLesson ? `/lesson/${nextLesson.id}` : "/";

	// The shelf is the tall thing here — fifty-odd pieces — so on desktop it
	// becomes the scrolling region and everything about it (the meter, what the
	// next lesson opens, the way home) sits beside it in a column that doesn't.
	return (
		<ScreenShell
			label="Library"
			backTo="/"
			backLabel="Back home"
			width="max-w-sm lg:max-w-5xl"
			regions
			pinnedOnPhone={false}
		>
			<div className="grid w-full gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[20rem_1fr] lg:gap-8">
				<div className="flex flex-col gap-6 lg:self-start">
					<CozyPanel>
						<div className="flex flex-col items-center gap-3">
							<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
								You can read
							</span>
							<ReadingMeter progress={progress} />
						</div>

						<div className="my-6 h-px w-full bg-night-edge lg:my-4" />

						<div className="flex flex-col items-center gap-3 text-center">
							{progress.readable === 0 ? (
								<span className="font-script text-2xl text-pink">
									Finish lesson 1 and this shelf opens up.
								</span>
							) : (
								<p className="font-sans text-sm text-mist">
									Every piece here uses only words you already know. No
									translation until you ask for one.
								</p>
							)}

							{nextLesson && unlockCount > 0 && (
								<Link to={nextLessonHref} className={PRIMARY_BUTTON}>
									Lesson {nextLesson.id} unlocks {unlockCount} more
								</Link>
							)}
						</div>
					</CozyPanel>

					<Link to="/" className={OUTLINE_BUTTON}>
						Back home
					</Link>
				</div>

				<CozyPanel className="relative flex flex-col lg:min-h-0 lg:py-6">
					<span className="shrink-0 font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
						Pieces
					</span>
					{/* The shelf scrolls inside its own card rather than growing the
					    page. The negative margin lets the scrollbar sit against the
					    card's padding instead of shaving the rows themselves. */}
					<div className="soft-scroll -mr-3 mt-3 min-h-0 flex-1 overflow-y-auto pr-3 [--scroll-rim:var(--color-night-soft)]">
						<LibraryShelf statuses={statuses} />
					</div>

					{/* The shelf dissolves into the card's own ground at the bottom
					    rather than being cut off square by it — the same edge the
					    trail board gives its wood, saying there is more below. */}
					<div className="pointer-events-none absolute inset-x-1 bottom-1 h-10 rounded-b-[30px] bg-gradient-to-t from-night-soft to-transparent" />
				</CozyPanel>
			</div>
		</ScreenShell>
	);
}
