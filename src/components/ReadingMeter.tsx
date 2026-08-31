import type { LibraryProgress } from "#/lib/library";

export function ReadingMeter({ progress }: { progress: LibraryProgress }) {
	return (
		<div className="flex w-full flex-col items-center gap-2.5">
			<span className="font-display text-3xl font-extrabold tabular-nums text-pink">
				{progress.percent}%
			</span>
			<div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-night-edge bg-night">
				<div
					className="h-full bg-pink"
					style={{ width: `${progress.percent}%` }}
				/>
			</div>
			<span className="font-sans text-xs text-mist">
				{progress.readable} of {progress.total} pieces
			</span>
		</div>
	);
}
