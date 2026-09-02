import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

/**
 * The shell every screen but the home dashboard stands in: one viewport tall,
 * with the eyebrow header and the screen's actions pinned and the one region
 * between them scrolling inside itself. A long passage, a fifty-piece shelf, or
 * a lesson that introduces four words at once therefore costs the screen no
 * height — on a laptop the whole of it is visible without touching the wheel.
 *
 * Below `lg` the pin is optional. Exercise flows keep it, because a grade
 * button that has scrolled off is a step the learner cannot finish; reading
 * screens let go of it, because on a phone scrolling a page is the native
 * gesture and a passage boxed into a short window is worse than a long page.
 */
export function ScreenShell({
	label,
	backTo,
	backLabel,
	width = "max-w-sm",
	bodyWidth,
	regions = false,
	pinnedOnPhone = true,
	sub,
	footer,
	children,
}: {
	label: string;
	backTo: string;
	backLabel: string;
	/** Max-width classes for the content column. */
	width?: string;
	/**
	 * A wider cap for the body alone, where one screen's content spreads into
	 * columns the header and the action have no use for.
	 */
	bodyWidth?: string;
	/**
	 * True when the children lay out their own full-height regions and scroll
	 * inside them, rather than scrolling together as one column.
	 */
	regions?: boolean;
	/** False to let the page grow and scroll normally below `lg`. */
	pinnedOnPhone?: boolean;
	/** Sits between the header and the body, pinned — a progress bar, usually. */
	sub?: ReactNode;
	/** Sits below the body, pinned — the screen's primary action, usually. */
	footer?: ReactNode;
	children: ReactNode;
}) {
	const height = pinnedOnPhone
		? "h-[100dvh] overflow-hidden"
		: "min-h-[100dvh] lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden";

	// The scroll container spans the full width so its scrollbar rides the
	// window edge instead of the content column's rounded cards. Where the pin
	// only starts at `lg`, so does the clipping — below it the body is allowed
	// its natural height and the page carries the scroll.
	const at = pinnedOnPhone ? "" : "lg:";
	const flow = `${at}${regions ? "overflow-hidden" : "overflow-y-auto"}`;
	const body = regions ? `${at}h-full` : "h-fit";

	return (
		<div
			className={`flex w-full flex-col items-center gap-5 px-6 py-8 sm:gap-6 sm:py-10 ${height}`}
		>
			<PageHeader
				label={label}
				backTo={backTo}
				backLabel={backLabel}
				className={`shrink-0 ${width}`}
			/>

			{sub && <div className={`w-full shrink-0 ${width}`}>{sub}</div>}

			<main
				className={`soft-scroll flex w-full min-h-0 flex-1 items-center-safe justify-center ${flow}`}
			>
				<div
					className={`flex w-full flex-col items-center gap-6 ${
						bodyWidth ?? width
					} ${body}`}
				>
					{children}
				</div>
			</main>

			{footer && (
				<div
					className={`flex w-full shrink-0 flex-col items-center gap-3 ${width}`}
				>
					{footer}
				</div>
			)}
		</div>
	);
}
