import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef } from "react";
import { TrailLantern } from "#/components/TrailLantern";
import { useCountUp } from "#/hooks/useCountUp";

/**
 * What happens when a learner who has finished all twenty-four lessons lights
 * the lantern at the top of the trail.
 *
 * The screen opens from the lantern itself — a circle of light spreading out of
 * the marker they just clicked — onto the same wood they have been climbing,
 * and the wood answers: sparks lift off the treeline, blossom petals come down
 * through them, and the app speaks to them in Toki Pona for the first time,
 * because now they can read it.
 *
 * Every speck is a flat fill on one canvas — no glow, no blur, no shadow, the
 * same rule the rest of the system holds to. The two accents do all of it.
 */

interface Speck {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	color: string;
	/** Petals tumble and fall; sparks arc and rise. */
	petal: boolean;
	rotation: number;
	spin: number;
	/** Lateral sway, so a falling petal never drops on a straight line. */
	sway: number;
	gravity: number;
	age: number;
	ttl: number;
}

const TAU = Math.PI * 2;

function readToken(name: string, fallback: string): string {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	return value || fallback;
}

function between(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

function pick<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

/**
 * The whole field, driven from one animation frame. Kept out of React state on
 * purpose: several hundred specks re-rendering a component tree sixty times a
 * second is the one way to make a celebration stutter.
 */
function useSpecks(
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	origin: { x: number; y: number } | null,
) {
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;

		const lavender = readToken("--color-lavender", "#d7b0fe");
		const pink = readToken("--color-pink", "#febcd5");
		const lavenderDim = readToken("--color-lavender-dim", "#b98ee6");
		const pinkDim = readToken("--color-pink-dim", "#f195b7");
		// Mostly full-strength: the dimmed tokens are for depth, and a field made
		// mostly of them turns muddy against the navy instead of reading as light.
		const sparkColors = [lavender, pink, lavender, pink, lavenderDim, pinkDim];
		// Conifers are lavender and blossoms are pink throughout this system, so
		// the petals coming down are pink and only pink.
		const petalColors = [pink, pink, pinkDim];

		let width = 0;
		let height = 0;
		const measure = () => {
			// Retina is worth paying for on shapes this small; beyond 2x is not.
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
		};
		measure();

		// A small phone should not run a desktop's particle count, and a very wide
		// window should not look sparse.
		const density = Math.min(1, Math.max(0.45, (width * height) / 1_100_000));
		const MAX_SPECKS = 700;
		const specks: Speck[] = [];

		/** The band of the screen the drawn treeline occupies. */
		const canopyY = () => height - between(10, 190);

		const spark = (x: number, y: number, vx: number, vy: number): Speck => ({
			x,
			y,
			vx,
			vy,
			size: between(1.8, 4.4),
			color: pick(sparkColors),
			petal: false,
			rotation: 0,
			spin: 0,
			sway: 0,
			gravity: 0,
			age: 0,
			ttl: between(5.5, 10),
		});

		const petal = (x: number, y: number): Speck => ({
			x,
			y,
			vx: between(-18, 18),
			vy: between(44, 104),
			size: between(5, 11),
			color: pick(petalColors),
			petal: true,
			rotation: between(0, TAU),
			spin: between(-1.4, 1.4),
			sway: between(0.6, 1.7),
			gravity: 0,
			age: 0,
			ttl: between(9, 16),
		});

		/** The first second: the lantern throws its light, and the wood answers. */
		const burst = () => {
			const fromLantern = Math.round(190 * density);
			const rect = canvas.getBoundingClientRect();
			const ox = origin ? origin.x - rect.left : width / 2;
			const oy = origin ? origin.y - rect.top : height * 0.4;
			for (let i = 0; i < fromLantern; i++) {
				const angle = between(0, TAU);
				const speed = between(220, 900);
				const s = spark(
					ox,
					oy,
					Math.cos(angle) * speed,
					Math.sin(angle) * speed * 0.85,
				);
				s.gravity = between(260, 460);
				s.ttl = between(1.6, 3.4);
				s.size = between(1.8, 4.2);
				specks.push(s);
			}
			const fromWood = Math.round(150 * density);
			for (let i = 0; i < fromWood; i++) {
				const s = spark(
					between(0, width),
					canopyY(),
					between(-110, 110),
					between(-680, -240),
				);
				s.gravity = between(200, 380);
				s.ttl = between(2.2, 4.6);
				specks.push(s);
			}
			// Petals take ten seconds to fall the height of a screen, so the sky
			// starts with a fall already in progress rather than empty.
			const alreadyFalling = Math.round(90 * density);
			for (let i = 0; i < alreadyFalling; i++) {
				const p = petal(between(-20, width + 20), between(-60, height));
				p.age = between(0.3, 4);
				specks.push(p);
			}
		};

		// Sustained emission, in specks per second, carried as fractions between
		// frames so a slow frame does not skip a batch.
		const SPARK_RATE = 24 * density;
		const PETAL_RATE = 15 * density;
		let sparkDebt = 0;
		let petalDebt = 0;

		const emit = (dt: number) => {
			sparkDebt += SPARK_RATE * dt;
			while (sparkDebt >= 1 && specks.length < MAX_SPECKS) {
				sparkDebt -= 1;
				specks.push(
					spark(
						between(0, width),
						canopyY(),
						between(-14, 14),
						between(-72, -26),
					),
				);
			}
			petalDebt += PETAL_RATE * dt;
			while (petalDebt >= 1 && specks.length < MAX_SPECKS) {
				petalDebt -= 1;
				specks.push(petal(between(-20, width + 20), between(-60, -10)));
			}
		};

		const alphaOf = (s: Speck): number => {
			const inCurve = Math.min(1, s.age / 0.28);
			const outCurve = Math.min(1, (s.ttl - s.age) / 0.9);
			return Math.max(0, Math.min(inCurve, outCurve)) * (s.petal ? 0.9 : 1);
		};

		const draw = () => {
			context.clearRect(0, 0, width, height);
			for (const s of specks) {
				context.globalAlpha = alphaOf(s);
				context.fillStyle = s.color;
				if (s.petal) {
					context.save();
					context.translate(s.x, s.y);
					context.rotate(s.rotation);
					context.beginPath();
					context.ellipse(0, 0, s.size, s.size * 0.42, 0, 0, TAU);
					context.fill();
					context.restore();
				} else {
					context.beginPath();
					context.arc(s.x, s.y, s.size, 0, TAU);
					context.fill();
				}
			}
			context.globalAlpha = 1;
		};

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (reduceMotion) {
			// Still a wood full of light — just a still one. Scattered rather than
			// animated, and drawn once.
			for (let i = 0; i < Math.round(90 * density); i++) {
				const still = Math.random() < 0.4 ? petal(0, 0) : spark(0, 0, 0, 0);
				still.x = between(0, width);
				still.y = between(0, height);
				still.age = 1;
				still.ttl = 99;
				specks.push(still);
			}
			draw();
			const onResize = () => {
				measure();
				draw();
			};
			window.addEventListener("resize", onResize);
			return () => window.removeEventListener("resize", onResize);
		}

		burst();

		let frame = 0;
		let last = performance.now();
		const step = (now: number) => {
			// Clamped so a stalled tab does not resume by teleporting every speck
			// off the top of the screen.
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			emit(dt);
			for (let i = specks.length - 1; i >= 0; i--) {
				const s = specks[i];
				s.age += dt;
				if (s.petal) {
					s.rotation += s.spin * dt;
					s.x += (s.vx + Math.sin(s.age * s.sway) * 26) * dt;
					s.y += s.vy * dt;
				} else {
					s.vy += s.gravity * dt;
					// Air drag, so the opening burst decelerates into a drift instead
					// of shooting off the edges at full speed.
					const drag = 1 - Math.min(0.9, 0.55 * dt);
					s.vx *= drag;
					s.vy *= drag;
					s.x += s.vx * dt;
					s.y += s.vy * dt;
				}
				if (s.age >= s.ttl || s.y < -120 || s.y > height + 140) {
					specks.splice(i, 1);
				}
			}
			draw();
			frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);

		const onVisibility = () => {
			// Coming back from a background tab, start the clock fresh.
			if (!document.hidden) last = performance.now();
		};
		const onResize = () => measure();
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("resize", onResize);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("resize", onResize);
		};
	}, [canvasRef, origin]);
}

/** One line of the tally: the number, then what it is. */
function Tally({
	value,
	label,
	durationMs,
}: {
	value: number;
	label: string;
	durationMs: number;
}) {
	const shown = useCountUp(value, durationMs);
	return (
		<li className="flex items-baseline gap-3.5">
			<span className="w-14 shrink-0 text-right font-display text-3xl leading-none font-extrabold tabular-nums text-lavender">
				{shown}
			</span>
			<span className="font-sans text-sm font-semibold text-mist">{label}</span>
		</li>
	);
}

export function SummitCelebration({
	origin,
	lessonsWalked,
	wordsLearned,
	readable,
	streak,
	onClose,
}: {
	/** Viewport position of the lantern, so the light opens from where it was lit. */
	origin: { x: number; y: number } | null;
	lessonsWalked: number;
	wordsLearned: number;
	readable: number;
	streak: number;
	onClose: () => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	useSpecks(canvasRef, origin);

	const onKeyDown = useCallback((event: React.KeyboardEvent) => {
		if (event.key !== "Tab") return;
		// A celebration that covers the screen has to keep the keyboard inside
		// it, or Tab walks off into the map nobody can see.
		const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
			"a[href], button:not([disabled])",
		);
		if (!focusable || focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}, []);

	useEffect(() => {
		// Put the lantern back under the keyboard when this closes, so a learner
		// who lit it with Enter is returned to the thing they pressed.
		const opener = document.activeElement;
		dialogRef.current?.focus();
		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";
		// Escape lives on the document rather than the dialog: clicking the wood
		// moves focus out of it, and Escape should still put it away.
		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onEscape);
		return () => {
			document.body.style.overflow = overflow;
			document.removeEventListener("keydown", onEscape);
			if (opener instanceof HTMLElement) opener.focus();
		};
	}, [onClose]);

	return (
		<div
			className="summit-veil fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-6 py-10"
			// The screen opens as a circle of light spreading from the lantern they
			// just lit, rather than as a panel arriving from nowhere.
			style={
				{
					"--ox": origin ? `${Math.round(origin.x)}px` : "50%",
					"--oy": origin ? `${Math.round(origin.y)}px` : "50%",
				} as React.CSSProperties
			}
		>
			{/* Clicking the wood puts it away, the same as the outline button. */}
			<button
				type="button"
				aria-label="Close"
				tabIndex={-1}
				onClick={onClose}
				className="absolute inset-0 h-full w-full cursor-default"
			/>
			<canvas
				ref={canvasRef}
				className="pointer-events-none absolute inset-0 h-full w-full"
				tabIndex={-1}
				aria-hidden="true"
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				onKeyDown={onKeyDown}
				className="summit-keepsake relative flex w-full max-w-sm flex-col items-center gap-6 rounded-[32px] border-2 border-night-edge bg-night-soft px-7 py-9 outline-none"
			>
				<TrailLantern
					height={58}
					body="var(--color-lavender)"
					light="var(--color-pink)"
					lit
				/>

				<div className="flex flex-col items-center gap-1.5">
					<h2
						id={titleId}
						className="text-center font-display text-3xl leading-tight font-extrabold text-cream"
					>
						sina sona e toki pona.
					</h2>
					{/* The one handwritten line this screen gets. It is the gloss, so
					    the sentence above it is the first thing the app has said to
					    them that they can simply read. */}
					<p className="text-center font-script text-2xl text-pink">
						you know toki pona
					</p>
				</div>

				<div className="h-px w-full bg-night-edge" />

				<ul className="flex list-none flex-col gap-3 p-0">
					<Tally
						value={lessonsWalked}
						label={`lesson${lessonsWalked === 1 ? "" : "s"} walked, first to last`}
						durationMs={700}
					/>
					<Tally
						value={wordsLearned}
						label={`word${wordsLearned === 1 ? "" : "s"} carried up the trail`}
						durationMs={950}
					/>
					<Tally
						value={readable}
						label={`text${readable === 1 ? "" : "s"} you can read untranslated`}
						durationMs={1200}
					/>
					{streak > 0 && (
						<Tally
							value={streak}
							label={`day${streak === 1 ? "" : "s"} in a row`}
							durationMs={1450}
						/>
					)}
				</ul>

				<div className="h-px w-full bg-night-edge" />

				<div className="flex w-full flex-col items-center gap-2.5">
					<p className="text-center font-sans text-sm text-mist">
						The lessons are done. What keeps them is reading, and the reviews
						that bring each word back just before you'd lose it.
					</p>
					<Link
						to="/library"
						onClick={onClose}
						className="w-full rounded-full border-2 border-night bg-pink px-6 py-3.5 text-center font-display text-base font-bold text-night transition-all duration-100 outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night-soft active:brightness-90"
					>
						Open the library
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="w-full cursor-pointer rounded-full border-2 border-night-edge bg-night px-6 py-2.5 text-center font-sans text-sm font-semibold text-mist transition-colors outline-none hover:border-lavender hover:text-cream focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night-soft"
					>
						Back to the wood
					</button>
				</div>
			</div>
		</div>
	);
}
