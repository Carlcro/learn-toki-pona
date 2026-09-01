import type { Grade } from "#/lib/srs";

const GRADE_OPTIONS: { grade: Grade; label: string; style: string }[] = [
	{
		grade: "again",
		label: "Again",
		style:
			"border-2 border-night-edge bg-transparent text-mist hover:border-mist hover:text-cream",
	},
	{
		grade: "good",
		label: "Good",
		style: "border-2 border-night bg-lavender text-night active:brightness-90",
	},
	{
		grade: "easy",
		label: "Easy",
		style: "border-2 border-night bg-pink text-night active:brightness-90",
	},
];

export function GradeButtons({ onGrade }: { onGrade: (grade: Grade) => void }) {
	return (
		<div className="flex w-full gap-2">
			{GRADE_OPTIONS.map(({ grade, label, style }) => (
				<button
					key={grade}
					type="button"
					onClick={() => onGrade(grade)}
					className={`flex-1 rounded-full px-3 py-2.5 font-display text-sm font-bold transition-all ${style}`}
				>
					{label}
				</button>
			))}
		</div>
	);
}
