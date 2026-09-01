import type { ReactNode } from "react";
import type { TreeKind } from "#/lib/trail";

/**
 * The same four silhouettes the page's background treeline is built from, drawn
 * at map scale so the forest inside the board and the forest behind the page
 * are recognisably the same wood. Conifers are lavender, round canopies are
 * pink — the system's fixed silhouette-to-hue mapping, not a random alternation.
 */
const SHAPES: Record<
	TreeKind,
	{ viewBox: string; ratio: number; conifer: boolean; path: ReactNode }
> = {
	pine: {
		viewBox: "0 0 60 88",
		ratio: 60 / 88,
		conifer: true,
		path: (
			<>
				<rect x="26" y="74" width="8" height="14" />
				<polygon points="8,74 52,74 30,46" />
				<polygon points="14,52 46,52 30,24" />
				<polygon points="19,30 41,30 30,2" />
			</>
		),
	},
	sapling: {
		viewBox: "0 0 44 74",
		ratio: 44 / 74,
		conifer: true,
		path: (
			<>
				<rect x="18" y="60" width="8" height="14" />
				<polygon points="4,60 40,60 22,30" />
				<polygon points="10,36 34,36 22,6" />
			</>
		),
	},
	blossom: {
		viewBox: "0 0 72 90",
		ratio: 72 / 90,
		conifer: false,
		path: (
			<>
				<rect x="32" y="74" width="8" height="16" />
				<circle cx="36" cy="40" r="24" />
				<circle cx="16" cy="50" r="15" />
				<circle cx="56" cy="50" r="15" />
				<circle cx="36" cy="14" r="13" />
			</>
		),
	},
	shrub: {
		viewBox: "0 0 56 36",
		ratio: 56 / 36,
		conifer: false,
		path: (
			<>
				<rect x="25" y="28" width="6" height="8" />
				<circle cx="28" cy="20" r="14" />
				<circle cx="14" cy="26" r="9" />
				<circle cx="42" cy="26" r="9" />
			</>
		),
	},
};

export function TrailTree({
	kind,
	height,
	far,
}: {
	kind: TreeKind;
	height: number;
	far: boolean;
}) {
	const shape = SHAPES[kind];
	// Distance is scale, vertical offset, and the dimmed tokens — never a blur or
	// a third hue.
	const fill = shape.conifer
		? far
			? "var(--color-lavender-dim)"
			: "var(--color-lavender)"
		: far
			? "var(--color-pink-dim)"
			: "var(--color-pink)";
	return (
		<svg
			viewBox={shape.viewBox}
			width={Math.round(height * shape.ratio)}
			height={height}
			fill={fill}
			aria-hidden="true"
			focusable="false"
		>
			{shape.path}
		</svg>
	);
}
