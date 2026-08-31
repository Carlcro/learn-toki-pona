export function NotEating() {
	return (
		<svg
			viewBox="0 0 200 140"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-auto w-full"
			role="img"
			aria-label="A person turning away from a bowl of food that is crossed out"
		>
			<circle cx="60" cy="35" r="16" />
			<path d="M40 95 Q40 65 60 65 Q80 65 80 95" />
			{/* Arm held out flat, palm forward — declining rather than reaching. */}
			<path d="M78 74 L104 74" />
			<path d="M104 66 L104 82" />
			<ellipse cx="145" cy="88" rx="30" ry="9" />
			<path d="M122 86 Q145 69 168 86" />
			{/* The cross reads as "no" without needing any words. */}
			<line x1="126" y1="66" x2="164" y2="100" />
			<line x1="164" y1="66" x2="126" y2="100" />
			<line x1="20" y1="100" x2="180" y2="100" />
		</svg>
	);
}
