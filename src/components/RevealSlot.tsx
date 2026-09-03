import type { ReactNode } from "react";

/**
 * Holds room for content that appears after the learner answers, so the card
 * keeps its size and nothing above it jumps when the reveal lands.
 *
 * `placeholder` is an invisible copy of the tallest thing the slot may show
 * (usually the wrong-answer version); it sets the height while `children`
 * stay hidden and stacks underneath them once they show.
 */
export function RevealSlot({
	show,
	placeholder,
	children,
	className = "",
}: {
	show: boolean;
	placeholder: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={`grid w-full ${className}`}>
			<div
				aria-hidden
				className="invisible col-start-1 row-start-1 flex w-full flex-col items-center gap-5"
			>
				{placeholder}
			</div>
			{show && (
				<div className="col-start-1 row-start-1 flex w-full flex-col items-center gap-5">
					{children}
				</div>
			)}
		</div>
	);
}
