import { Cache } from "@/lib/cache";
import { createContext, useContext, useEffect, useRef } from "react";

const AudioContext = createContext<ReturnType<typeof useAudioContext__> | null>(
	null,
);

function useAudioContext__() {
	const audioContext = useRef<AudioContext | null>(null);
	const gainNode = useRef<GainNode | null>(null);
	const panner = useRef<StereoPannerNode | null>(null);
	const audioElementsCache = useRef(
		new Cache<string, HTMLAudioElement>(1000 * 60 * 60), // 1 hour
	);

	useEffect(() => {
		audioContext.current = new window.AudioContext();
		gainNode.current = audioContext.current.createGain();
		panner.current = new StereoPannerNode(audioContext.current, { pan: 0 });
		gainNode.current.gain.value = 1;

		const interval = setInterval(() => {
			audioElementsCache.current.clearExpired();
		}, 10_000);
		return () => clearInterval(interval);
	}, []);

	function connectAudio(audioElement: HTMLAudioElement | null) {
		if (!audioElement) return;
		if (!audioContext.current) return;

		const track = new MediaElementAudioSourceNode(audioContext.current, {
			mediaElement: audioElement,
		});

		track
			.connect(gainNode.current!)
			.connect(panner.current!)
			.connect(audioContext.current!.destination);
	}

	return {
		audioContext,
		gainNode,
		panner,
		connectAudio,
		audioElementsCache,
	};
}

export const AudioProvider: React.FC<React.PropsWithChildren> = (props) => {
	return (
		<AudioContext.Provider
			value={useAudioContext__()}
			{...props}
		></AudioContext.Provider>
	);
};

export function useAudioContext() {
	const context = useContext(AudioContext);
	if (!context) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
}
