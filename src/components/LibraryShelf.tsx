import { Link } from "@tanstack/react-router";
import { GRAMMAR_CONCEPTS_BY_ID } from "#/data/grammar";
import type { ItemStatus } from "#/lib/library";

const ROW_BASE =
	"flex items-center justify-between gap-3 rounded-[28px] border-2 border-night-edge bg-night-soft px-4 py-3.5";

const MAX_MISSING_SHOWN = 3;

/** "needs telo, pona +2" — the exact price of a locked piece, in words. */
function lockLabel(status: ItemStatus): string {
	if (status.missingWordIds.length > 0) {
		const shown = status.missingWordIds.slice(0, MAX_MISSING_SHOWN);
		const extra = status.missingWordIds.length - shown.length;
		return `needs ${shown.join(", ")}${extra > 0 ? ` +${extra}` : ""}`;
	}
	const conceptNames = status.missingConceptIds.map(
		(conceptId) => GRAMMAR_CONCEPTS_BY_ID[conceptId]?.name ?? conceptId,
	);
	return `needs ${conceptNames.join(", ")}`;
}

function lengthLabel(lineCount: number): string {
	return lineCount === 1 ? "1 line" : `${lineCount} lines`;
}

export function LibraryShelf({ statuses }: { statuses: ItemStatus[] }) {
	return (
		<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
			{statuses.map((status) => {
				const { item } = status;

				if (!status.readable) {
					return (
						<div key={item.id} className={`${ROW_BASE} opacity-50`}>
							<span className="font-display text-sm font-bold text-mist">
								{item.title}
							</span>
							<span className="shrink-0 font-sans text-[0.65rem] font-bold tracking-[0.14em] text-mist lowercase">
								{lockLabel(status)}
							</span>
						</div>
					);
				}

				const href: string = `/library/${item.id}`;
				return (
					<Link
						key={item.id}
						to={href}
						className={`${ROW_BASE} transition-colors hover:border-lavender`}
					>
						<span className="font-display text-sm font-bold text-cream">
							{item.title}
						</span>
						<span className="shrink-0 font-sans text-[0.65rem] font-bold tracking-[0.14em] text-lavender uppercase">
							{lengthLabel(item.lines.length)}
						</span>
					</Link>
				);
			})}
		</div>
	);
}
