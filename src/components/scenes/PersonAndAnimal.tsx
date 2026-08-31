export function PersonAndAnimal() {
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
			aria-label="A person standing next to a four-legged animal"
		>
			<circle cx="50" cy="35" r="16" />
			<path d="M30 100 Q30 65 50 65 Q70 65 70 100" />
			<ellipse cx="145" cy="82" rx="34" ry="16" />
			<circle cx="182" cy="64" r="11" />
			<line x1="122" y1="96" x2="122" y2="100" />
			<line x1="168" y1="96" x2="168" y2="100" />
			<line x1="20" y1="100" x2="180" y2="100" />
		</svg>
	);
}
