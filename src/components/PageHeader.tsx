import { Link } from "@tanstack/react-router";

/**
 * The eyebrow header every non-home screen shares, with a back control anchored
 * to the left of the content column. `backTo` is the screen's parent in the app
 * hierarchy rather than browser history, so the target is predictable no matter
 * how the learner arrived.
 */
export function PageHeader({
	label,
	backTo,
	backLabel,
	className = "max-w-sm",
}: {
	label: string;
	backTo: string;
	backLabel: string;
	className?: string;
}) {
	return (
		<header
			className={`relative flex w-full items-center justify-center ${className}`}
		>
			<Link
				to={backTo}
				aria-label={backLabel}
				className="absolute left-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-night-edge bg-night-soft text-mist transition-colors outline-none hover:border-lavender hover:text-lavender focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-night"
			>
				<svg
					viewBox="0 0 20 20"
					width="16"
					height="16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M12 4 6 10l6 6" />
				</svg>
			</Link>

			<div className="flex items-center gap-2 px-12">
				<span className="h-2 w-2 shrink-0 rounded-full bg-lavender" />
				<span className="font-sans text-xs font-bold tracking-[0.2em] text-mist uppercase">
					{label}
				</span>
			</div>
		</header>
	);
}
