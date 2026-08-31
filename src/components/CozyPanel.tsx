import type { ReactNode } from "react";

export function CozyPanel({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`w-full rounded-[32px] border-2 border-night-edge bg-night-soft px-6 py-8 ${className}`}
		>
			{children}
		</div>
	);
}
