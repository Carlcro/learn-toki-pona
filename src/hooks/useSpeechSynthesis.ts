import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

/**
 * How long to wait for the browser to actually begin an utterance before
 * treating it as swallowed. Chrome on macOS sometimes accepts speak() and then
 * never fires `start` — most often when speak() follows cancel() within the
 * same tick — and once it is in that state, every later utterance hangs too.
 * A single cancel-and-retry after a short delay is what gets it going again.
 */
const START_TIMEOUT_MS = 1000;
const RETRY_DELAY_MS = 120;

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
	// Chrome garbage-collects an utterance it has no strong reference to and
	// then drops its events, so the in-flight one is pinned here.
	const currentRef = useRef<SpeechSynthesisUtterance | null>(null);
	const timersRef = useRef<number[]>([]);

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

	useEffect(() => {
		return () => {
			for (const timer of timersRef.current) window.clearTimeout(timer);
		};
	}, []);

	const speak = useCallback(
		(text: string) => {
			if (!isSupported) return;
			const synth = window.speechSynthesis;
			for (const timer of timersRef.current) window.clearTimeout(timer);
			timersRef.current = [];

			const attempt = (retriesLeft: number) => {
				const utterance = new SpeechSynthesisUtterance(text);
				utterance.rate = 0.8;
				utterance.lang = voice?.lang ?? PREFERRED_VOICE_LANGS[0];
				if (voice) utterance.voice = voice;
				currentRef.current = utterance;

				let started = false;
				utterance.addEventListener("start", () => {
					started = true;
				});
				const clear = () => {
					if (currentRef.current === utterance) currentRef.current = null;
				};
				utterance.addEventListener("end", clear);
				utterance.addEventListener("error", clear);

				// Chrome leaves the engine paused across page loads more often
				// than it should; resuming a non-paused engine is harmless.
				synth.resume();
				synth.speak(utterance);

				const watchdog = window.setTimeout(() => {
					if (started || currentRef.current !== utterance) return;
					synth.cancel();
					if (retriesLeft > 0) {
						const retry = window.setTimeout(
							() => attempt(retriesLeft - 1),
							RETRY_DELAY_MS,
						);
						timersRef.current.push(retry);
					}
				}, START_TIMEOUT_MS);
				timersRef.current.push(watchdog);
			};

			// Interrupt whatever is playing, but never call speak() in the same
			// tick as cancel(): that pairing is what wedges Chrome's engine.
			if (synth.speaking || synth.pending) {
				synth.cancel();
				const delayed = window.setTimeout(() => attempt(1), RETRY_DELAY_MS);
				timersRef.current.push(delayed);
			} else {
				attempt(1);
			}
		},
		[isSupported, voice],
	);

	return useMemo(() => ({ isSupported, speak }), [isSupported, speak]);
}
