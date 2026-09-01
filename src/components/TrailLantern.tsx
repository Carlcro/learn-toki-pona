/**
 * The lantern at the top of the trail. Built from the same vocabulary as the
 * wood around it — rounded slabs, flat fills, no shadow — so the thing waiting
 * at the end of the map belongs to the map.
 *
 * Legibility at ~50px comes from silhouette, not detail. Three things carry it:
 * a handle arc, a roof that *overhangs* the glass, and a foot that overhangs it
 * again. Without the overhang the parts stack into one blob and the whole thing
 * reads as a bottle; without the arc it reads as a padlock. The pane inside is a
 * lit window, never a hole punched through the middle.
 *
 * It takes its two colours from the caller rather than picking them, because
 * the same glyph is drawn dark-with-a-cream-pane on a lit summit disc,
 * structural-line dark on an unlit one, and lavender-with-pink in the
 * celebration.
 */
export function TrailLantern({
	height,
	body,
	light,
	lit = false,
	className = "",
}: {
	height: number;
	/** Fill for the casing: handle, roof, frame, foot. */
	body: string;
	/** Fill for the pane of light set into the casing. */
	light: string;
	/** Breathe the pane. Ignored under reduced motion. */
	lit?: boolean;
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 40 44"
			width={Math.round((height * 40) / 44)}
			height={height}
			className={className}
			aria-hidden="true"
			focusable="false"
		>
			{/* The handle you would carry it by, springing from the roof rather
			    than floating above it — an open arc, drawn as a stroke. */}
			<path
				d="M11 12 A 9 9 0 0 1 29 12"
				fill="none"
				stroke={body}
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
			<g fill={body}>
				{/* Roof 28 wide, glass 22, foot 26: the roof and the foot both step
				    out past the glass, which is what makes this read as a lantern
				    at a glance instead of a rounded box. */}
				<rect x="6" y="11" width="28" height="5" rx="2.5" />
				<rect x="9" y="16" width="22" height="20" rx="6" />
				<rect x="7" y="36" width="26" height="5" rx="2.5" />
			</g>
			<rect
				className={lit ? "lantern-light" : undefined}
				x="13"
				y="19.5"
				width="14"
				height="13"
				rx="4"
				fill={light}
			/>
		</svg>
	);
}
