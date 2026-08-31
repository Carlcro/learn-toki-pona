export function AskingGood() {
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
			aria-label="A person pointing at a bowl of food with a question mark above it"
		>
			<circle cx="52" cy="42" r="16" />
			<path d="M32 102 Q32 72 52 72 Q72 72 72 102" />
			<path d="M70 80 L100 74" />
			<ellipse cx="140" cy="95" rx="30" ry="9" />
			<path d="M117 93 Q140 76 163 93" />
			{/* Question mark, drawn rather than typeset so it inherits the stroke. */}
			<path d="M130 44 Q130 30 141 30 Q152 30 152 40 Q152 48 141 50 L141 56" />
			<circle cx="141" cy="65" r="1.6" fill="currentColor" stroke="none" />
			<line x1="20" y1="107" x2="180" y2="107" />
		</svg>
	);
}
