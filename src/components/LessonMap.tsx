import { Link } from "@tanstack/react-router";
import { useEffect, useId, useMemo, useRef } from "react";
import { TrailTree } from "#/components/TrailTree";
import type { LessonProgress } from "#/lib/progress";
import { buildTrail, type TrailStop } from "#/lib/trail";

/**
 * The lessons, drawn as a trail climbing through the wood rather than listed as
 * rows. Lesson one is at the bottom: progress reads as ground covered, and the
 * path carries on past the last clearing into trees nobody has walked yet.
 *
 * The board is its own panel — a window cut down to the darker forest floor,
 * not a card inside a card — and it only ever shows a stretch of the trail,
 * opening centred on the clearing the learner is standing in. A course that
 * grows to thirty lessons therefore costs the home screen no extra height.
 */

const DISC_SIZE = { completed: 46, current: 62, locked: 38 } as const;

/** Widened so the router accepts an id only known at runtime. */
function lessonHref(lessonId: string): string {
	return `/lesson/${lessonId}`;
}

/** Entrance timings, shared with the keyframes in styles.css. */
const DRAW_START = 140;
const DRAW_MS = 820;

/**
 * Each clearing lights up as the drawing trail reaches it, so the entrance
 * replays the walk instead of running a stagger that ignores the path. The
 * clearings ahead fade in quietly once it has finished — they are not
 * achievements and should not arrive like one.
 */
function stopDelay(index: number, walkedTo: number): number {
	if (index > walkedTo) {
		return DRAW_START + DRAW_MS + 120 + Math.min(index - walkedTo, 12) * 80;
	}
	if (walkedTo === 0) return DRAW_START + 120;
	return Math.round(DRAW_START + (index / walkedTo) * DRAW_MS);
}

function Stop({
	entry,
	stop,
	delay,
	standingHere,
}: {
	entry: LessonProgress;
	stop: TrailStop;
	delay: number;
	/** The far end of the walked trail. Once the course has no lesson left to
	    be current this is the last one they finished, and it is only announced,
	    not drawn — the pink current marker carries "you are here" on its own. */
	standingHere: boolean;
}) {
	const { lesson, status } = entry;
	const size = DISC_SIZE[status];
	const isCurrent = status === "current";

	const disc = [
		"trail-disc relative z-10 flex h-full w-full items-center justify-center rounded-full font-display font-extrabold tabular-nums",
		status === "completed" && "bg-lavender text-night text-lg",
		isCurrent && "bg-pink text-night text-2xl",
		status === "locked" &&
			"border-2 border-night-edge bg-night-soft text-mist text-sm",
	]
		.filter(Boolean)
		.join(" ");

	const body = (
		<>
			<span className="sr-only">
				Lesson {lesson.id}: {lesson.topic} —{" "}
				{status === "completed"
					? standingHere
						? "done, and the end of the trail so far"
						: "done"
					: isCurrent
						? "you are here, continue"
						: "locked until you finish the lessons before it"}
			</span>
			<span
				className="trail-node relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				{/* The bare patch of forest floor the marker stands on. Trodden
				    ground is visible; ground nobody has reached barely is. */}
				<span
					className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-night-soft ${
						isCurrent
							? "h-[24px] w-[104px]"
							: status === "completed"
								? "h-[20px] w-[82px]"
								: "h-[16px] w-[64px] opacity-50"
					}`}
				/>
				{isCurrent && (
					<span className="trail-ring absolute -inset-1.5 rounded-full border-2 border-pink" />
				)}
				<span className={disc} aria-hidden="true">
					{lesson.id}
				</span>
			</span>
			<span
				className={`absolute top-1/2 w-[5.75rem] -translate-y-1/2 font-sans text-xs leading-snug font-semibold ${
					stop.labelSide === "right"
						? "left-full ml-2.5 text-left"
						: "right-full mr-2.5 text-right"
				} ${isCurrent ? "text-cream" : "text-mist"}`}
				aria-hidden="true"
			>
				{lesson.topic}
			</span>
		</>
	);

	const shell = "trail-stop absolute flex items-center justify-center";
	const position = {
		left: `${stop.x}%`,
		top: `${stop.y}px`,
		width: size,
		height: size,
		transform: "translate(-50%, -50%)",
		"--d": `${delay}ms`,
	} as React.CSSProperties;

	if (status === "locked") {
		return (
			<li>
				<span className={`${shell} opacity-75`} style={position}>
					{body}
				</span>
			</li>
		);
	}

	return (
		<li>
			<Link
				to={lessonHref(lesson.id)}
				aria-current={isCurrent ? "step" : undefined}
				className={`${shell} outline-none`}
				style={position}
			>
				{body}
			</Link>
		</li>
	);
}

export function LessonMap({
	lessonProgress,
}: {
	lessonProgress: LessonProgress[];
}) {
	const count = lessonProgress.length;
	const currentIndex = lessonProgress.findIndex((e) => e.status === "current");
	// With every lesson finished there is no "current" clearing, and the whole
	// trail counts as walked.
	const walkedTo = currentIndex === -1 ? count - 1 : currentIndex;
	const completed = lessonProgress.filter(
		(e) => e.status === "completed",
	).length;

	const complete = currentIndex === -1;
	const trail = useMemo(
		() => buildTrail(count, walkedTo, complete),
		[count, walkedTo, complete],
	);
	const boardRef = useRef<HTMLDivElement>(null);
	const maskId = `trail-${useId().replace(/:/g, "")}`;

	// Open on the learner, not on the top of the map. Set directly rather than
	// via scrollIntoView, which would drag the whole page with it.
	const focusY = trail.stops[walkedTo]?.y;
	useEffect(() => {
		const board = boardRef.current;
		if (!board || focusY === undefined) return;
		board.scrollTop = focusY - board.clientHeight / 2;
	}, [focusY]);

	return (
		<section className="flex w-full flex-col gap-3 lg:mx-auto lg:max-w-[32rem]">
			<div className="flex items-baseline justify-between px-1">
				<h2 className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					Lessons
				</h2>
				<p className="font-display text-sm font-bold tabular-nums text-mist">
					<span className="text-lavender">{completed}</span> / {count} walked
				</p>
			</div>

			<div className="relative w-full">
				<div
					ref={boardRef}
					className="trail-board relative max-h-[28rem] w-full overflow-x-hidden overflow-y-auto rounded-[32px] border-2 border-night-edge bg-night lg:max-h-[min(44rem,calc(100vh-9rem))]"
				>
					<div className="relative w-full" style={{ height: trail.height }}>
						{trail.troddenPath && (
							<svg
								className="absolute inset-0 h-full w-full"
								viewBox={`0 0 100 ${trail.height}`}
								preserveAspectRatio="none"
								aria-hidden="true"
								focusable="false"
							>
								<defs>
									{/* One long dash sweeping along the path, used as a mask, so
									    the trail underneath keeps its own colour and round cap
									    while it draws itself. */}
									<mask
										id={maskId}
										maskUnits="userSpaceOnUse"
										x="0"
										y="0"
										width="100"
										height={trail.height}
									>
										<path
											className="trail-draw"
											d={trail.troddenPath}
											fill="none"
											stroke="#fff"
											strokeWidth="26"
											strokeLinecap="round"
											pathLength={1}
											strokeDasharray="1 1"
										/>
									</mask>
								</defs>
								<path
									d={trail.troddenPath}
									mask={`url(#${maskId})`}
									fill="none"
									stroke="var(--color-lavender)"
									strokeWidth="7"
									strokeLinecap="round"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
						)}

						{/* Stepping stones, laid out as elements rather than a dashed SVG
						    stroke so they stay perfectly round at every board width — the
						    board's viewBox scales x and y by different amounts. */}
						<div className="absolute inset-0" aria-hidden="true">
							{trail.pebbles.map((pebble, index) => (
								<span
									key={`${pebble.x}-${pebble.y}`}
									className="trail-pebble absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-night-edge"
									style={
										{
											left: `${pebble.x}%`,
											top: `${pebble.y}px`,
											"--d": `${DRAW_START + DRAW_MS + Math.min(index, 40) * 22}ms`,
										} as React.CSSProperties
									}
								/>
							))}
						</div>

						<div className="absolute inset-0" aria-hidden="true">
							{trail.trees.map((tree) => (
								<span
									key={`${tree.x}-${tree.y}`}
									className="absolute -translate-x-1/2 -translate-y-full"
									style={{
										left: `${tree.x}%`,
										top: `${tree.y}px`,
										opacity: tree.far ? 0.7 : 1,
									}}
								>
									<TrailTree
										kind={tree.kind}
										height={tree.height}
										far={tree.far}
									/>
								</span>
							))}
						</div>

						<div className="absolute inset-0" aria-hidden="true">
							{trail.fireflies.map((fly) => (
								<span
									key={`${fly.x}-${fly.y}`}
									className={`trail-firefly absolute rounded-full ${
										fly.warm ? "bg-pink" : "bg-lavender"
									}`}
									style={
										{
											left: `${fly.x}%`,
											top: `${fly.y}px`,
											width: fly.size,
											height: fly.size,
											"--dur": `${fly.duration}s`,
											"--delay": `${fly.delay}s`,
											"--dx": `${fly.driftX}px`,
											"--dy": `${fly.driftY}px`,
										} as React.CSSProperties
									}
								/>
							))}
						</div>

						<ol className="absolute inset-0 m-0 list-none p-0">
							{lessonProgress.map((entry, index) => (
								<Stop
									key={entry.lesson.id}
									entry={entry}
									stop={trail.stops[index]}
									delay={stopDelay(index, walkedTo)}
									standingHere={index === walkedTo}
								/>
							))}
						</ol>
					</div>
				</div>

				{/* The wood keeps going in both directions. Fading the board's own
				    ground over its edges says so, and stops the trail being cut off
				    square by a border. Overlaid rather than masked so the border
				    itself stays crisp. */}
				<div className="pointer-events-none absolute inset-x-0.5 top-0.5 h-10 rounded-t-[30px] bg-gradient-to-b from-night to-transparent" />
				<div className="pointer-events-none absolute inset-x-0.5 bottom-0.5 h-10 rounded-b-[30px] bg-gradient-to-t from-night to-transparent" />
			</div>
		</section>
	);
}
