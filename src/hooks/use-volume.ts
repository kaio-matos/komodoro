import { useRef, useState } from "react";

export function useVolume(initial: number) {
	const [volume, setVolume] = useState(initial);
	const isMuted = volume === 0;
	const previousVolume = useRef<number | null>(null);

	function mute() {
		previousVolume.current = volume;
		setVolume(0);
	}

	function unmute() {
		if (!isMuted) return;
		setVolume(previousVolume.current ?? 0.7);
	}

	return {
		value: volume,
		set: setVolume,
		previousVolume,
		mute,
		unmute,
		isMuted,
	};
}
export type TUseVolumeReturn = ReturnType<typeof useVolume>;
