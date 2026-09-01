import { Link } from "@tanstack/react-router";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
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
	opensAfter,
}: {
	entry: LessonProgress;
	stop: TrailStop;
	delay: number;
	/** The lesson that unlocks this one — the one right before it on the trail.
	    Only ever missing for lesson one, which is never locked. */
	opensAfter?: string;
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
						: opensAfter
							? `locked until you finish lesson ${opensAfter}`
							: "locked until you finish the lessons before it"}
			</span>
			<span
				className="trail-node relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				{isCurrent && (
					/* "You are here": a broken ring that turns slowly around the
					   clearing. It keeps its size and weight throughout, so the
					   motion reads at a glance without tugging at the eye. */
					<svg
						className="trail-ring absolute -inset-1.5"
						viewBox="0 0 100 100"
						fill="none"
						aria-hidden="true"
					>
						<circle
							cx="50"
							cy="50"
							r="48"
							stroke="var(--color-pink)"
							strokeWidth="4"
							strokeLinecap="round"
							strokeDasharray="46 29"
						/>
					</svg>
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
				<span className={`${shell} group opacity-75`} style={position}>
					{body}
					{/* What it would take to get here, on hover. Ground the learner
					    cannot walk yet should still say why, rather than only
					    refusing the click. */}
					<span
						className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-full border-2 border-night-edge bg-night-soft px-3 py-1 font-sans text-[0.7rem] font-semibold whitespace-nowrap text-cream opacity-0 transition-opacity duration-150 group-hover:opacity-100"
						aria-hidden="true"
					>
						{opensAfter
							? `Opens after lesson ${opensAfter}`
							: "Opens further along the trail"}
					</span>
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

/**
 * The way back to the learner's own clearing, shown only once they have
 * scrolled it out of the board. It points the way it would have them travel:
 * down the map when they have wandered up ahead, up when they have gone back
 * over ground they already walked.
 */
function BackToHere({
	direction,
	onClick,
}: {
	direction: "up" | "down";
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Scroll back to where you are on the trail"
			className={`trail-return absolute left-1/2 -translate-x-1/2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-pink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender active:brightness-90 ${
				direction === "down" ? "bottom-4" : "top-4"
			}`}
		>
			{/* The chevron nods the way it would take you. The bob sits on this
			    wrapper so the animation has a transform to itself and the arrow
			    keeps whichever way it points. */}
			<span
				className="trail-beckon flex"
				style={
					{
						"--bob": direction === "down" ? "4px" : "-4px",
					} as React.CSSProperties
				}
			>
				<svg
					viewBox="0 0 24 24"
					className={`h-12 w-12 ${direction === "up" ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M6 9.5 12 15.5 18 9.5" />
				</svg>
			</span>
		</button>
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

	// Which way the learner's clearing lies once it is off the board, or null
	// while it is still in view. The margin keeps a marker that is only half on
	// screen counted as gone, since half a marker is not somewhere you can see
	// you are standing.
	const [wanderedOff, setWanderedOff] = useState<"up" | "down" | null>(null);
	useEffect(() => {
		const board = boardRef.current;
		if (!board || focusY === undefined) return;
		const MARGIN = 52;
		const look = () => {
			const top = board.scrollTop;
			const bottom = top + board.clientHeight;
			setWanderedOff(
				focusY < top + MARGIN ? "up" : focusY > bottom - MARGIN ? "down" : null,
			);
		};
		look();
		board.addEventListener("scroll", look, { passive: true });
		return () => board.removeEventListener("scroll", look);
	}, [focusY]);

	const walkBack = useCallback(() => {
		const board = boardRef.current;
		if (!board || focusY === undefined) return;
		board.scrollTo({
			top: focusY - board.clientHeight / 2,
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
				? "auto"
				: "smooth",
		});
	}, [focusY]);

	return (
		<section className="flex w-full flex-col gap-3 lg:mx-auto lg:max-w-[32rem]">
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
									opensAfter={lessonProgress[index - 1]?.lesson.id}
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

				{wanderedOff && (
					<BackToHere direction={wanderedOff} onClick={walkBack} />
				)}
			</div>
		</section>
	);
}
