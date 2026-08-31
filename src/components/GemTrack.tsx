export function GemTrack({ due, slots }: { due: number; slots: number }) {
	const filled = Math.min(due, slots);
	const overflow = due > slots ? due - slots : 0;
	return (
		<div className="flex items-center gap-3">
			<div className="flex gap-2">
				{Array.from({ length: slots }, (_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length positional gem slots, never reordered
						key={i}
						className={`pop-anim h-4 w-4 rounded-full border-2 ${
							i < filled
								? "border-pink-dim bg-gradient-to-br from-pink to-lavender"
								: "border-night-edge bg-transparent"
						}`}
						style={{ animationDelay: `${520 + i * 45}ms` }}
					/>
				))}
			</div>
			{overflow > 0 && (
				<span className="font-display text-sm font-bold tabular-nums text-mist">
					+{overflow}
				</span>
			)}
		</div>
	);
}
