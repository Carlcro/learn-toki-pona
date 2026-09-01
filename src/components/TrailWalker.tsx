/**
 * The learner, standing in the clearing they have reached — a soweli, the word
 * lesson 2 teaches for "animal", drawn in the same flat single-fill silhouette
 * grammar as the treeline.
 *
 * Cream rather than lavender or pink: the two accents are already carrying the
 * trail and the clearings, and a walker painted in either of them would sink
 * into the marker it is standing beside. Cream is a palette neutral, so this
 * stays inside the two-accent rule rather than inventing a third hue.
 */
export function TrailWalker({
	height = 34,
	facing = "right",
}: {
	height?: number;
	/** Which way it looks; it is always turned towards the marker it stands by. */
	facing?: "left" | "right";
}) {
	// The flip lives on a wrapper, not on the svg: the idle animation owns the
	// svg's own transform, and the two would overwrite each other.
	return (
		<span
			className="inline-block"
			style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
		>
			<svg
				className="trail-walker"
				style={{ color: "var(--color-cream)" }}
				viewBox="0 0 44 34"
				width={Math.round((height * 44) / 34)}
				height={height}
				aria-hidden="true"
				focusable="false"
			>
				{/* Tail first, so the body's fill sits over the join. */}
				<path
					d="M8 15 C 0.5 12, 1.5 3, 8.5 2.5"
					fill="none"
					stroke="currentColor"
					strokeWidth="4.5"
					strokeLinecap="round"
				/>
				<g fill="currentColor">
					<rect x="9" y="20" width="5" height="11" rx="2.5" />
					<rect x="20" y="20" width="5" height="11" rx="2.5" />
					<ellipse cx="18" cy="17" rx="11.5" ry="7.5" />
					<polygon points="25.5,7 26.5,0.5 31,5.5" />
					<circle cx="30.5" cy="11.5" r="6.5" />
					<circle cx="37.5" cy="14" r="3.5" />
				</g>
			</svg>
		</span>
	);
}
