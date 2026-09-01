import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CozyPanel } from "#/components/CozyPanel";
import { GemTrack } from "#/components/GemTrack";
import { LessonMap } from "#/components/LessonMap";
import { MasteryBar } from "#/components/MasteryBar";
import { ReadingMeter } from "#/components/ReadingMeter";
import { SummitCelebration } from "#/components/SummitCelebration";
import { LESSONS, LESSONS_BY_ID } from "#/data/lessons";
import { LIBRARY_ITEMS } from "#/data/library";
import { COURSE_WORD_COUNT } from "#/data/words";
import { useCountUp } from "#/hooks/useCountUp";
import {
	selectKnownConceptIds,
	selectKnownWordIds,
	selectLibraryProgress,
	selectLibraryStatuses,
	selectUnlockCountForLesson,
} from "#/lib/library";
import {
	type DailyPlan,
	describeTimeUntil,
	selectDailyPlan,
	selectLessonProgress,
	selectMasteryBreakdown,
	selectNextLessonId,
	selectReviewQueue,
	selectWordsLearnedCount,
} from "#/lib/progress";
import { useProgressState } from "#/lib/store";

export const Route = createFileRoute("/")({ component: Home });

const REVIEW_SLOTS = 8;

const PRIMARY_BUTTON =
	"w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none active:brightness-90 focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night";
const OUTLINE_BUTTON =
	"w-full rounded-full border-2 border-night-edge bg-night-soft px-6 py-2.5 text-center font-sans text-sm font-semibold text-mist transition-colors hover:border-lavender hover:text-cream";

function formatDate(isoDate: string): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	});
}

/** Widened so the router accepts an id only known at runtime. */
function lessonHref(lessonId: string): string {
	return `/lesson/${lessonId}`;
}

/** The one thing to do next, plus the quieter option beside it. */
function NextAction({ plan, now }: { plan: DailyPlan; now: Date }) {
	switch (plan.kind) {
		case "first-lesson":
			return (
				<Link to={lessonHref(plan.lessonId)} className={PRIMARY_BUTTON}>
					Begin lesson 1
				</Link>
			);
		case "lesson":
			return (
				<Link to={lessonHref(plan.lessonId)} className={PRIMARY_BUTTON}>
					Start lesson {plan.lessonId}
				</Link>
			);
		case "review":
			return (
				<Link to="/review" className={PRIMARY_BUTTON}>
					Review {plan.dueCount} item{plan.dueCount === 1 ? "" : "s"}
				</Link>
			);
		case "rest":
			// Never a hard lock — just a strong hint. Cramming the whole course in
			// one evening is the fastest way to have forgotten it by the weekend.
			return (
				<div className="flex w-full flex-col items-center gap-2.5">
					<p className="text-center font-sans text-sm text-mist">
						{plan.nextDueAt
							? `Today's lesson is done. Your next review lands ${describeTimeUntil(plan.nextDueAt, now)}.`
							: "Today's lesson is done."}
					</p>
					<Link to="/library" className={PRIMARY_BUTTON}>
						Read something
					</Link>
					{plan.nextLessonId && (
						<Link to={lessonHref(plan.nextLessonId)} className={OUTLINE_BUTTON}>
							Learn lesson {plan.nextLessonId} anyway
						</Link>
					)}
				</div>
			);
		case "course-complete":
			return (
				<div className="flex w-full flex-col items-center gap-2.5">
					<p className="text-center font-sans text-sm text-mist">
						You've finished every lesson the course has. Reviews keep it all
						alive
						{plan.nextDueAt
							? ` — the next batch is due ${describeTimeUntil(plan.nextDueAt, now)}.`
							: "."}
					</p>
					<Link to="/library" className={PRIMARY_BUTTON}>
						Open the library
					</Link>
				</div>
			);
	}
}

function Home() {
	const progress = useProgressState();
	const {
		cards,
		completedLessonIds,
		lastStudiedAt,
		lastLessonCompletedAt,
		currentStreak,
	} = progress;
	const now = new Date();

	const wordsLearned = selectWordsLearnedCount(cards);
	const dueCount = selectReviewQueue(progress, now).length;
	const mastery = selectMasteryBreakdown(cards);
	const lessonProgress = selectLessonProgress(completedLessonIds, LESSONS);
	const learned = useCountUp(wordsLearned);

	const plan = selectDailyPlan({
		decks: progress,
		completedLessonIds,
		lastLessonCompletedAt,
		lessons: LESSONS,
		now,
	});

	const knownWordIds = selectKnownWordIds(cards);
	const knownConceptIds = selectKnownConceptIds(completedLessonIds, LESSONS);
	const libraryProgress = selectLibraryProgress(
		selectLibraryStatuses(LIBRARY_ITEMS, knownWordIds, knownConceptIds),
	);
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

	const isFirstRun = plan.kind === "first-lesson";

	// Where the lantern was on screen when they lit it, so the celebration can
	// open from it. Null means the lookout is dark or has been put away again.
	const [litFrom, setLitFrom] = useState<{ x: number; y: number } | null>(null);

	return (
		<div
			className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 lg:mx-auto lg:grid lg:max-w-6xl lg:items-start lg:justify-normal lg:gap-x-12 lg:gap-y-6 lg:px-16 lg:py-20"
			style={{
				gridTemplateColumns: "22rem 1fr",
				gridTemplateAreas: `"header header" "stats lessons" "cta lessons" "meta lessons"`,
			}}
		>
			<header className="flex items-baseline gap-1.5 lg:mb-4 lg:[grid-area:header]">
				<span className="font-display text-2xl font-extrabold text-cream">
					toki
				</span>
				<span className="font-script text-3xl text-pink">lili</span>
			</header>

			<main className="flex w-full max-w-sm flex-col items-center gap-8 lg:contents">
				<CozyPanel className="lg:[grid-area:stats]">
					<div className="flex flex-col items-center gap-3">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							Words learned
						</span>
						{/* Measured against the words this course actually teaches, not
						    the language's full 137 — a denominator you cannot reach is
						    a progress bar that never fills. */}
						<div className="flex items-baseline gap-1.5">
							<span className="font-display text-5xl leading-none font-extrabold tabular-nums text-lavender">
								{learned}
							</span>
							<span className="font-display text-xl font-bold text-mist">
								/
							</span>
							<span className="font-display text-xl font-bold tabular-nums text-mist">
								{COURSE_WORD_COUNT}
							</span>
						</div>
					</div>

					<div className="my-6 h-px w-full bg-night-edge" />

					<div className="flex flex-col items-center gap-3">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							Due for review
						</span>
						<GemTrack due={dueCount} slots={REVIEW_SLOTS} />
					</div>

					{currentStreak > 0 && (
						<>
							<div className="my-6 h-px w-full bg-night-edge" />
							<div className="flex flex-col items-center gap-3">
								<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
									Day streak
								</span>
								<span className="font-display text-2xl font-extrabold text-pink">
									{currentStreak}
								</span>
							</div>
						</>
					)}

					{wordsLearned > 0 && (
						<>
							<div className="my-6 h-px w-full bg-night-edge" />
							<MasteryBar breakdown={mastery} />
						</>
					)}

					<div className="my-6 h-px w-full bg-night-edge" />

					<div className="flex flex-col items-center gap-3">
						<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
							You can read
						</span>
						<ReadingMeter progress={libraryProgress} />
						{unlockCount > 0 && nextLesson && (
							<span className="text-center font-sans text-xs text-mist">
								Lesson {nextLesson.id} unlocks {unlockCount} more.
							</span>
						)}
						<Link to="/library" className={OUTLINE_BUTTON}>
							Open the library
						</Link>
					</div>
				</CozyPanel>

				{/* The map board is its own panel — a window cut down to the darker
				    forest floor. Wrapping it in a CozyPanel would nest one rounded
				    card inside another and push the trail into a slot. */}
				{lessonProgress.length > 0 && (
					<div className="w-full lg:[grid-area:lessons]">
						<LessonMap
							lessonProgress={lessonProgress}
							onLightTheLookout={setLitFrom}
						/>
					</div>
				)}

				<div className="flex w-full flex-col items-center lg:[grid-area:cta]">
					<NextAction plan={plan} now={now} />
				</div>

				{!isFirstRun && lastStudiedAt && (
					<span className="font-sans text-xs text-mist lg:[grid-area:meta]">
						Last studied {formatDate(lastStudiedAt)}
					</span>
				)}
			</main>

			{litFrom && (
				<SummitCelebration
					origin={litFrom}
					lessonsWalked={completedLessonIds.length}
					wordsLearned={wordsLearned}
					readable={libraryProgress.readable}
					streak={currentStreak}
					onClose={() => setLitFrom(null)}
				/>
			)}
		</div>
	);
}
