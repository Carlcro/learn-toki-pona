import type { MasteryBreakdown } from "#/lib/progress";

export function MasteryBar({ breakdown }: { breakdown: MasteryBreakdown }) {
	const total = breakdown.new + breakdown.learning + breakdown.mature;
	const pct = (count: number) => (total === 0 ? 0 : (count / total) * 100);

	return (
		<div className="flex w-full flex-col gap-2.5">
			<div className="flex h-2.5 w-full overflow-hidden rounded-full border-2 border-night-edge bg-night">
				<div
					className="h-full bg-pink"
					style={{ width: `${pct(breakdown.mature)}%` }}
				/>
				<div
					className="h-full bg-lavender"
					style={{ width: `${pct(breakdown.learning)}%` }}
				/>
			</div>
			<div className="flex justify-between font-sans text-xs text-mist">
				<span>
					<span className="font-bold text-pink">{breakdown.mature}</span>{" "}
					mastered
				</span>
				<span>
					<span className="font-bold text-lavender">{breakdown.learning}</span>{" "}
					learning
				</span>
				<span>
					<span className="font-bold text-mist">{breakdown.new}</span> new
				</span>
			</div>
		</div>
	);
}
