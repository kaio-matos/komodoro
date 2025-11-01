import { useEffect, useRef } from "react";

// TODO: make it work with async import audio files
export function useAudio(url: string) {
	const audio = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audio.current = new Audio(url);
	}, [url]);

	return {
		audioRef: audio,

		play() {
			return audio.current?.play();
		},

		pause() {
			return audio.current?.play();
		},

		reset() {
			if (audio.current) {
				audio.current.currentTime = 0;
			}
		},

		forcePlay() {
			this.reset();
			this.play();
		},
	};
}
