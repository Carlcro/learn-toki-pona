import { useCallback, useEffect, useMemo, useState } from "react";

export interface SpeechSynthesisApi {
	isSupported: boolean;
	speak: (text: string) => void;
}

/**
 * Toki Pona's five vowels are pure — a, e, i, o, u as in Italian or Spanish —
 * and its consonants hold no surprises. An English voice mangles all of it
 * ("telo" as TEE-low, "mi" as my), which would teach a pronunciation the
 * learner then has to unlearn, so we borrow a voice from a language whose
 * vowels already match and only fall back to the default if none is installed.
 */
const PREFERRED_VOICE_LANGS = ["it-IT", "es-ES", "es-MX", "fi-FI", "id-ID"];

function pickVoice(
	voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
	for (const lang of PREFERRED_VOICE_LANGS) {
		const exact = voices.find((voice) => voice.lang === lang);
		if (exact) return exact;
		const prefix = lang.slice(0, 2);
		const loose = voices.find((voice) => voice.lang.startsWith(prefix));
		if (loose) return loose;
	}
	return null;
}

export function useSpeechSynthesis(): SpeechSynthesisApi {
	const isSupported =
		typeof window !== "undefined" && "speechSynthesis" in window;
	const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

	// Voice lists load asynchronously in most browsers and are empty on the
	// first synchronous read, so we listen for the list to arrive.
	useEffect(() => {
		if (!isSupported) return;
		const synth = window.speechSynthesis;
		const update = () => setVoice(pickVoice(synth.getVoices()));
		update();
		synth.addEventListener("voiceschanged", update);
		return () => synth.removeEventListener("voiceschanged", update);
	}, [isSupported]);

	const speak = useCallback(
		(text: string) => {
			if (!isSupported) return;
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = 0.8;
			utterance.lang = voice?.lang ?? PREFERRED_VOICE_LANGS[0];
			if (voice) utterance.voice = voice;
			window.speechSynthesis.speak(utterance);
		},
		[isSupported, voice],
	);

	return useMemo(() => ({ isSupported, speak }), [isSupported, speak]);
}
