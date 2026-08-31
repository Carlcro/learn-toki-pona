/** How far through a lesson or a review session the learner is. */
export function StepProgress({
	done,
	total,
	label,
}: {
	done: number;
	total: number;
	label: string;
}) {
	const percent = total === 0 ? 0 : Math.round((done / total) * 100);
	return (
		<div className="flex w-full flex-col gap-1.5">
			<div className="flex items-baseline justify-between">
				<span className="font-sans text-[0.65rem] font-bold tracking-[0.18em] text-mist uppercase">
					{label}
				</span>
				<span className="font-display text-xs font-bold tabular-nums text-mist">
					{done} / {total}
				</span>
			</div>
			<div
				className="h-2 w-full overflow-hidden rounded-full border-2 border-night-edge bg-night"
				role="progressbar"
				aria-valuenow={done}
				aria-valuemin={0}
				aria-valuemax={total}
				aria-label={label}
			>
				<div
					className="h-full bg-lavender transition-[width] duration-300"
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
}
