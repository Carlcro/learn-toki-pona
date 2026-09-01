/**
 * Geometry for the forest trail on the home screen: where each lesson's
 * clearing sits, the curve of the path between them, the stepping stones on the
 * stretch nobody has walked yet, and the trees and fireflies around it.
 *
 * All of it is derived from the lesson count alone, so a growing curriculum
 * lays itself out without anyone hand-placing a node — and it is deterministic,
 * so the same course always draws the same forest. Nothing here measures the
 * DOM: `x` is a percentage of the board's width and `y` is a pixel offset from
 * its top, which is exactly the pair an SVG `viewBox="0 0 100 height"` and an
 * absolutely positioned element can both consume without a resize observer.
 */

/** Vertical distance between two clearings. */
const PITCH = 116;
/** Room above the last clearing for the trail to wander off into the trees. */
const PAD_TOP = 104;
/** Room below the first clearing for its label. */
const PAD_BOTTOM = 86;
/**
 * How far the trail is allowed to swing from the centre line. Narrow enough
 * that a 112px label centred on the outermost clearing still clears the edge
 * of a ~224px board — the tightest the panel gets on a 320px phone.
 */
const X_MIN = 28;
const X_MAX = 72;

/** The reference board width tree spacing is reasoned about in. */
const REFERENCE_WIDTH = 320;

/**
 * How far a signpost's centre sits from its clearing's, at the reference
 * width. Kept in step with the label box in LessonMap so the forest is thinned
 * where the words go, not only where the markers are.
 */
const LABEL_OFFSET = 78;

/** Lateral wander of the halfway point between two clearings, in board %. */
const MEANDER = 7;

export type TreeKind = "pine" | "sapling" | "blossom" | "shrub";

export interface TrailPoint {
	/** Percentage across the board, 0–100. */
	x: number;
	/** Pixels down from the top of the board. */
	y: number;
}

/**
 * A clearing, plus the side its signpost hangs on. Labels sit beside their
 * marker the way they do on a real trail map, never under it — under it is
 * exactly where the path leaves the clearing, and a caption laid over the trail
 * is the one thing that would make this board read as a diagram.
 */
export interface TrailStop extends TrailPoint {
	labelSide: "left" | "right";
}

export interface TrailTree extends TrailPoint {
	kind: TreeKind;
	/** Rendered height in pixels; the trunk sits on `y`. */
	height: number;
	/** Past the learner's current clearing, so it is drawn dim and distant. */
	far: boolean;
}

/** A drifting speck of light, animated entirely from these numbers. */
export interface Firefly extends TrailPoint {
	size: number;
	/** Seconds for one there-and-back drift. */
	duration: number;
	delay: number;
	driftX: number;
	driftY: number;
	/** Fireflies alternate the two accents rather than introducing a third. */
	warm: boolean;
}

export interface TrailLayout {
	height: number;
	stops: TrailStop[];
	/** The stretch already walked. Empty while the learner is still at stop one. */
	troddenPath: string;
	/**
	 * Stepping stones over the stretch ahead, running past the last clearing and
	 * out of the board. Dots rather than a line because unwalked ground should
	 * read as a route you can make out, not a road already laid.
	 */
	pebbles: TrailPoint[];
	trees: TrailTree[];
	fireflies: Firefly[];
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/** Two out-of-phase sines: a wander that never falls into an even zigzag. */
function stopX(index: number): number {
	return clamp(
		50 + 18 * Math.sin(index * 2.3 + 1.8) + 4 * Math.sin(index * 3.7 + 2.4),
		X_MIN,
		X_MAX,
	);
}

function round(value: number): number {
	return Math.round(value * 100) / 100;
}

function at(points: TrailPoint[], i: number): TrailPoint {
	return points[clamp(i, 0, points.length - 1)];
}

/** One cubic of the trail, in board coordinates. */
interface Cubic {
	a: TrailPoint;
	c1: TrailPoint;
	c2: TrailPoint;
	b: TrailPoint;
}

/**
 * A Catmull-Rom spline through the points, as cubic Béziers. Splitting the
 * walked and unwalked stretches means drawing two ranges of the *same* point
 * list rather than two independent curves, so the join at the learner's current
 * clearing is continuous instead of kinked.
 */
function curveThrough(points: TrailPoint[], from: number, to: number): Cubic[] {
	const curve: Cubic[] = [];
	for (let i = from; i < to; i++) {
		const p0 = at(points, i - 1);
		const p1 = at(points, i);
		const p2 = at(points, i + 1);
		const p3 = at(points, i + 2);
		curve.push({
			a: p1,
			c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
			c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
			b: p2,
		});
	}
	return curve;
}

function cubicAt(c: Cubic, t: number): TrailPoint {
	const u = 1 - t;
	const axis = (a: number, b: number, d: number, e: number) =>
		u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * d + t * t * t * e;
	return {
		x: axis(c.a.x, c.c1.x, c.c2.x, c.b.x),
		y: axis(c.a.y, c.c1.y, c.c2.y, c.b.y),
	};
}

/** The stretch of a cubic from `t` to its end, by de Casteljau. */
function cubicFrom(c: Cubic, t: number): Cubic {
	const mix = (p: TrailPoint, q: TrailPoint): TrailPoint => ({
		x: p.x + (q.x - p.x) * t,
		y: p.y + (q.y - p.y) * t,
	});
	const ab = mix(c.a, c.c1);
	const bc = mix(c.c1, c.c2);
	const cd = mix(c.c2, c.b);
	const abc = mix(ab, bc);
	const bcd = mix(bc, cd);
	return { a: mix(abc, bcd), c1: bcd, c2: cd, b: c.b };
}

/** The stretch of a cubic up to `t`: the same split, kept the other way round. */
function cubicUpTo(c: Cubic, t: number): Cubic {
	const flipped = cubicFrom({ a: c.b, c1: c.c2, c2: c.c1, b: c.a }, 1 - t);
	return { a: flipped.b, c1: flipped.c2, c2: flipped.c1, b: flipped.a };
}

/**
 * Backs the curve away from the clearing at each end until it is `gap` pixels
 * clear of it, so the ribbon stops on the bare ground around a marker instead
 * of running under it. Measured in pixels at the reference width, like the
 * stepping stones, so the gap holds its size as the board is resized.
 */
function backOff(curve: Cubic[], startGap: number, endGap: number): Cubic[] {
	const STEPS = 24;
	const clearOf = (anchor: TrailPoint, point: TrailPoint, gap: number) =>
		distance(toPixels(anchor), toPixels(point)) >= gap;

	// Walk in from the first clearing until the curve is clear of it, then keep
	// everything from there on.
	const head = curve[0]?.a;
	let cut: { index: number; t: number } | undefined;
	for (let i = 0; i < curve.length && head && !cut; i++) {
		for (let step = 0; step <= STEPS; step++) {
			if (!clearOf(head, cubicAt(curve[i], step / STEPS), startGap)) continue;
			cut = { index: i, t: step / STEPS };
			break;
		}
	}
	const trail = cut
		? [cubicFrom(curve[cut.index], cut.t), ...curve.slice(cut.index + 1)]
		: [];

	// And the same walking back from the clearing at the far end.
	const tail = trail[trail.length - 1]?.b;
	cut = undefined;
	for (let i = trail.length - 1; i >= 0 && tail && !cut; i--) {
		for (let step = STEPS; step >= 0; step--) {
			if (!clearOf(tail, cubicAt(trail[i], step / STEPS), endGap)) continue;
			cut = { index: i, t: step / STEPS };
			break;
		}
	}
	return cut
		? [...trail.slice(0, cut.index), cubicUpTo(trail[cut.index], cut.t)]
		: [];
}

function toPath(curve: Cubic[]): string {
	const head = curve[0];
	if (!head) return "";
	let d = `M ${round(head.a.x)} ${round(head.a.y)}`;
	for (const c of curve) {
		d += ` C ${round(c.c1.x)} ${round(c.c1.y)}, ${round(c.c2.x)} ${round(c.c2.y)}, ${round(c.b.x)} ${round(c.b.y)}`;
	}
	return d;
}

/** The same spline `curveThrough` emits, evaluated at a point. */
function splineAt(points: TrailPoint[], i: number, t: number): TrailPoint {
	const p0 = at(points, i - 1);
	const p1 = at(points, i);
	const p2 = at(points, i + 1);
	const p3 = at(points, i + 2);
	const t2 = t * t;
	const t3 = t2 * t;
	const axis = (a: number, b: number, c: number, d: number) =>
		0.5 *
		(2 * b +
			(c - a) * t +
			(2 * a - 5 * b + 4 * c - d) * t2 +
			(3 * b - a - 3 * c + d) * t3);
	return {
		x: axis(p0.x, p1.x, p2.x, p3.x),
		y: axis(p0.y, p1.y, p2.y, p3.y),
	};
}

function toPixels(point: TrailPoint): TrailPoint {
	return { x: (point.x / 100) * REFERENCE_WIDTH, y: point.y };
}

function distance(a: TrailPoint, b: TrailPoint): number {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Fixed-seed PRNG, so the forest is the same on every render and every device. */
function mulberry32(seed: number): () => number {
	let a = seed;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Points along the curve, cheap enough to brute-force trees against. */
function samplePolyline(points: TrailPoint[]): TrailPoint[] {
	const samples: TrailPoint[] = [];
	for (let i = 0; i < points.length - 1; i++) {
		for (let step = 0; step < 8; step++) {
			samples.push(toPixels(splineAt(points, i, step / 8)));
		}
	}
	return samples;
}

/**
 * How far short of a clearing the walked ribbon stops. Kept in step with the
 * markers in LessonMap: a finished clearing is a 46px disc, and the one the
 * learner stands on carries a ring around its 62px disc — the trail should
 * arrive at the bare ground around each, not slide under it.
 */
const RIBBON_GAP = { done: 26, here: 38 } as const;

/** Distance between stepping stones, measured at the reference width. */
const PEBBLE_SPACING = 17;
/** How much bare ground a clearing keeps around itself. */
const PEBBLE_CLEARANCE = 31;

/**
 * Steps along the unwalked stretch at a fixed arc length, so the stones stay evenly
 * spaced through a tight bend instead of bunching up the way a per-segment
 * split would.
 */
function layStones(
	points: TrailPoint[],
	stops: TrailStop[],
	from: number,
): TrailPoint[] {
	const stones: TrailPoint[] = [];
	const nearStops = stops.map(toPixels);
	let carried = PEBBLE_SPACING / 2;
	let previous = toPixels(splineAt(points, from, 0));

	for (let i = from; i < points.length - 1; i++) {
		for (let step = 1; step <= 24; step++) {
			const here = splineAt(points, i, step / 24);
			const herePx = toPixels(here);
			carried += distance(previous, herePx);
			previous = herePx;
			if (carried < PEBBLE_SPACING) continue;
			carried = 0;
			if (nearStops.some((s) => distance(s, herePx) < PEBBLE_CLEARANCE))
				continue;
			stones.push({ x: round(here.x), y: round(here.y) });
		}
	}
	return stones;
}

const TREE_KINDS: TreeKind[] = ["pine", "blossom", "sapling", "shrub", "pine"];

/**
 * Scatter trees into whatever the trail and its clearings leave free. Rejection
 * sampling rather than a grid: the point of the forest is that it reads as
 * grown, not planted in rows.
 */
function plantTrees(
	points: TrailPoint[],
	stops: TrailStop[],
	height: number,
	currentY: number,
): TrailTree[] {
	const random = mulberry32(0x7ca1);
	const spine = samplePolyline(points);
	const stopsInPixels = stops.map(toPixels);
	const labelsInPixels = stops.map((stop) => {
		const centre = toPixels(stop);
		return {
			x: centre.x + (stop.labelSide === "right" ? LABEL_OFFSET : -LABEL_OFFSET),
			y: centre.y,
		};
	});
	const trees: TrailTree[] = [];
	const target = stops.length * 5 + 18;

	for (let attempt = 0; attempt < 2600 && trees.length < target; attempt++) {
		// The last few go up near the vanishing point, thickening the forest the
		// trail disappears into.
		const crowdTop = trees.length >= target - 5;
		const candidate = {
			x: 8 + random() * 84,
			y: crowdTop
				? 24 + random() * (PAD_TOP + PITCH)
				: 18 + random() * (height - 40),
		};
		const inPixels = toPixels(candidate);
		const far = candidate.y < currentY - 24;
		const kind = TREE_KINDS[trees.length % TREE_KINDS.length];
		const scale = 0.6 + random() * 0.4;
		const base = kind === "shrub" ? 34 : kind === "sapling" ? 52 : 70;
		const treeHeight = Math.round(base * scale * (far ? 0.72 : 1));
		// A tree is planted by its trunk but read by its canopy, so both ends of
		// it have to clear the trail's furniture — otherwise a tall pine sited a
		// comfortable distance below a marker still leans right over it.
		const canopy = { x: inPixels.x, y: inPixels.y - treeHeight * 0.6 };
		const clears = (targets: TrailPoint[], trunk: number, crown: number) =>
			!targets.some(
				(t) => distance(t, inPixels) < trunk || distance(t, canopy) < crown,
			);

		if (!clears(spine, 36, 30)) continue;
		if (!clears(stopsInPixels, 62, 56)) continue;
		if (!clears(labelsInPixels, 54, 48)) continue;
		if (trees.some((t) => distance(toPixels(t), inPixels) < 46)) continue;

		trees.push({ ...candidate, kind, height: treeHeight, far });
	}
	return trees;
}

/**
 * A handful of specks drifting between the trees. Sparse and slow on purpose:
 * they are the wood breathing, not a second thing competing with the trail for
 * the eye.
 */
function releaseFireflies(height: number): Firefly[] {
	const random = mulberry32(0x1e50);
	const count = clamp(Math.round(height / 240), 3, 7);
	return Array.from({ length: count }, (_, i) => ({
		x: round(10 + random() * 80),
		y: round(40 + random() * Math.max(1, height - 90)),
		size: round(2.5 + random() * 1.5),
		duration: round(13 + random() * 9),
		delay: round(-random() * 12),
		driftX: round(14 + random() * 20) * (random() < 0.5 ? -1 : 1),
		driftY: round(-10 - random() * 22),
		warm: i % 2 === 0,
	}));
}

/**
 * @param count how many lessons the course has.
 * @param currentIndex the clearing the learner stands on; everything before it
 *   is walked.
 * @param complete every lesson is finished, so the learner is standing at the
 *   last clearing rather than partway along. The trail stops there: stepping
 *   stones running on past the end would promise lessons that do not exist.
 */
export function buildTrail(
	count: number,
	currentIndex: number,
	complete = false,
): TrailLayout {
	const height = PAD_TOP + PAD_BOTTOM + PITCH * Math.max(0, count - 1);

	// Lesson one sits at the bottom and the trail climbs, so progress reads as
	// ground covered rather than a list scrolled.
	const stops: TrailStop[] = Array.from({ length: count }, (_, i) => {
		const x = stopX(i);
		return {
			x,
			y: height - PAD_BOTTOM - i * PITCH + 8 * Math.sin(i * 2.7 + 1.1),
			// The signpost hangs on whichever side has the board's width to spare.
			labelSide: x <= 50 ? "right" : "left",
		};
	});

	// A wandering point halfway between each pair of clearings, plus one past the
	// last one and off the top of the board. Without the halfway points a spline
	// through near-vertical stops comes out as a polyline of straight runs; with
	// them the trail actually winds, and it carries on into the trees instead of
	// stopping dead at the final lesson.
	const points: TrailPoint[] = [];
	for (let i = 0; i < count; i++) {
		points.push(stops[i]);
		const next = stops[i + 1];
		const from = stops[i];
		const swing = (i % 2 === 0 ? 1 : -1) * MEANDER;
		points.push(
			next
				? {
						x: clamp((from.x + next.x) / 2 + swing, 18, 82),
						y: (from.y + next.y) / 2,
					}
				: { x: clamp(from.x + swing, 18, 82), y: from.y - PITCH * 0.55 },
		);
	}
	points.push({ x: stopX(count), y: 6 });

	// Each clearing is at twice its lesson index, with a halfway point between.
	const walkedTo = clamp(currentIndex, 0, Math.max(0, count - 1)) * 2;

	return {
		height,
		stops,
		troddenPath: toPath(
			backOff(
				curveThrough(points, 0, walkedTo),
				RIBBON_GAP.done,
				// With the course finished the far end is a completed clearing
				// like any other; otherwise it is the ringed one.
				complete ? RIBBON_GAP.done : RIBBON_GAP.here,
			),
		),
		pebbles: complete ? [] : layStones(points, stops, walkedTo),
		trees: plantTrees(points, stops, height, points[walkedTo]?.y ?? height),
		fireflies: releaseFireflies(height),
	};
}
