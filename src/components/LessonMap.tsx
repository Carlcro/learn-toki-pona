import { Link } from "@tanstack/react-router";
import type { LessonProgress } from "#/lib/progress";

const ROW_BASE =
	"flex items-center justify-between gap-3 rounded-[28px] border-2 border-night-edge bg-night-soft px-4 py-3";

function LessonText({
	lesson,
	titleColor,
}: {
	lesson: LessonProgress["lesson"];
	titleColor: string;
}) {
	return (
		<span className="flex min-w-0 flex-col">
			<span className={`font-display text-sm font-bold ${titleColor}`}>
				Lesson {lesson.id}
			</span>
			<span className="line-clamp-2 font-sans text-xs font-semibold text-mist">
				{lesson.topic}
			</span>
		</span>
	);
}

export function LessonMap({
	lessonProgress,
}: {
	lessonProgress: LessonProgress[];
}) {
	return (
		<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
			{lessonProgress.map(({ lesson, status }) => {
				if (status === "locked") {
					return (
						<div key={lesson.id} className={`${ROW_BASE} opacity-50`}>
							<LessonText lesson={lesson} titleColor="text-mist" />
							<span className="shrink-0 font-sans text-[0.65rem] font-bold tracking-[0.14em] text-mist uppercase">
								Locked
							</span>
						</div>
					);
				}

				const isCompleted = status === "completed";
				const href: string = `/lesson/${lesson.id}`;
				return (
					<Link
						key={lesson.id}
						to={href}
						className={`${ROW_BASE} transition-colors hover:border-lavender`}
					>
						<LessonText lesson={lesson} titleColor="text-cream" />
						<span
							className={`shrink-0 font-sans text-[0.65rem] font-bold tracking-[0.14em] uppercase ${
								isCompleted ? "text-pink" : "text-lavender"
							}`}
						>
							{isCompleted ? "Done" : "Continue"}
						</span>
					</Link>
				);
			})}
		</div>
	);
}
