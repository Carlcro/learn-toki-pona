import { useSpeechSynthesis } from "#/hooks/useSpeechSynthesis";

export function SpeakerButton({ text }: { text: string }) {
	const { isSupported, speak } = useSpeechSynthesis();

	if (!isSupported) return null;

	return (
		<button
			type="button"
			onClick={() => speak(text)}
			aria-label={`Play pronunciation of ${text}`}
			className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-night-edge text-mist transition-colors hover:border-lavender hover:text-lavender"
		>
			<svg
				viewBox="0 0 20 20"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 8v4h3l4 3V5L6 8H3z" />
				<path d="M13.5 7.5a3.5 3.5 0 0 1 0 5" />
				<path d="M15.8 5.2a7 7 0 0 1 0 9.6" />
			</svg>
		</button>
	);
}
