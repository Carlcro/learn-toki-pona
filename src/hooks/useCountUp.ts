import { useEffect, useState } from "react";

export function useCountUp(target: number, durationMs = 900): number {
	const [value, setValue] = useState(0);

	useEffect(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduceMotion || target === 0) {
			setValue(target);
			return;
		}
		let raf: number;
		const start = performance.now();
		const tick = (now: number) => {
			const t = Math.min((now - start) / durationMs, 1);
			const eased = 1 - (1 - t) ** 3;
			setValue(Math.round(eased * target));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		// Browsers pause rAF in background tabs, which would otherwise strand the
		// headline number partway to its real value for as long as the page
		// stays open. The timer guarantees it lands on the truth either way.
		const settle = setTimeout(() => setValue(target), durationMs + 100);
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(settle);
		};
	}, [target, durationMs]);

	return value;
}
