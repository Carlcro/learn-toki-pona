import { createFileRoute, Link } from "@tanstack/react-router";
import { CozyPanel } from "#/components/CozyPanel";
import { LibraryShelf } from "#/components/LibraryShelf";
import { PageHeader } from "#/components/PageHeader";
import { ReadingMeter } from "#/components/ReadingMeter";
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

	return (
		<div className="flex min-h-screen flex-col items-center gap-10 px-6 py-16">
			<PageHeader
				label="Library"
				backTo="/"
				backLabel="Back home"
				className="max-w-sm lg:max-w-3xl"
			/>

			<main className="flex w-full max-w-sm flex-col items-center gap-8 lg:max-w-3xl">
				<CozyPanel>
					<div className="flex flex-col items-center gap-3">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							You can read
						</span>
						<ReadingMeter progress={progress} />
					</div>

					<div className="my-6 h-px w-full bg-night-edge" />

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
							<Link
								to={nextLessonHref}
								className="w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night"
							>
								Lesson {nextLesson.id} unlocks {unlockCount} more
							</Link>
						)}
					</div>
				</CozyPanel>

				<CozyPanel>
					<div className="flex flex-col gap-3">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							Pieces
						</span>
						<LibraryShelf statuses={statuses} />
					</div>
				</CozyPanel>

				<Link
					to="/"
					className="w-full max-w-sm rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night"
				>
					Back home
				</Link>
			</main>
		</div>
	);
}
